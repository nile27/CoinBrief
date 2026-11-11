import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeFirebase } from "./helpers.js";

const { fake, sendMail } = vi.hoisted(() => ({ fake: {} as any, sendMail: vi.fn(async () => {}) }));
vi.mock("../lib/firebase.js", async () => {
  const { createFakeFirebase } = await import("./helpers.js");
  Object.assign(fake, createFakeFirebase());
  return fake;
});
vi.mock("nodemailer", () => ({ default: { createTransport: () => ({ sendMail }) } }));

import * as svc from "../services/otp.js";

const ts = (offset: number) => fake.Timestamp.fromMillis(Date.now() + offset);
const store = (): Map<string, any> => fake.store;
void createFakeFirebase;

beforeEach(() => {
  store().clear();
  sendMail.mockClear();
  vi.useRealTimers();
});

describe("sendOtp 발송 제한", () => {
  it("첫 요청은 통과해 메일을 보낸다", async () => {
    await svc.sendOtp("a@a.com", "n", false, "1.1.1.1");
    expect(sendMail).toHaveBeenCalledOnce();
    expect(store().get("otps/a@a.com")?.otp).toMatch(/^\d{6}$/);
  });

  it("같은 이메일 60초 이내 재요청은 429", async () => {
    await svc.sendOtp("a@a.com", "n", false, "1.1.1.1");
    await expect(svc.sendOtp("a@a.com", "n", false, "1.1.1.1")).rejects.toMatchObject({ status: 429 });
    expect(sendMail).toHaveBeenCalledOnce();
  });

  it("이메일당 시간당 5회 초과는 429", async () => {
    vi.useFakeTimers();
    for (let i = 0; i < 5; i++) {
      await svc.sendOtp("a@a.com", "n", false, "1.1.1.1");
      vi.advanceTimersByTime(61_000);
    }
    await expect(svc.sendOtp("a@a.com", "n", false, "1.1.1.1")).rejects.toMatchObject({ status: 429 });
  });

  it("IP 는 해시되어 저장된다(원문 미저장)", async () => {
    await svc.sendOtp("a@a.com", "n", false, "9.9.9.9");
    const keys = [...store().keys()].filter((k) => k.startsWith("otpRate/ip_"));
    expect(keys).toHaveLength(1);
    expect(keys[0]).not.toContain("9.9.9.9");
  });
});

describe("checkOtp", () => {
  it("OTP 없으면 404", async () => {
    await expect(svc.checkOtp("a@a.com", "123456")).rejects.toMatchObject({ status: 404 });
  });

  it("만료되면 400 이고 문서를 삭제한다", async () => {
    store().set("otps/a@a.com", { otp: "123456", expiresAt: ts(-1) });
    await expect(svc.checkOtp("a@a.com", "123456")).rejects.toMatchObject({ status: 400 });
    expect(store().has("otps/a@a.com")).toBe(false);
  });

  it("일치하면 통과하고 일회용으로 삭제", async () => {
    store().set("otps/a@a.com", { otp: "123456", expiresAt: ts(60_000) });
    await svc.checkOtp("a@a.com", "123456");
    expect(store().has("otps/a@a.com")).toBe(false);
  });

  it("5회 틀리면 429 와 함께 폐기", async () => {
    store().set("otps/a@a.com", { otp: "123456", expiresAt: ts(60_000) });
    for (let i = 0; i < 4; i++) {
      await expect(svc.checkOtp("a@a.com", "000000")).rejects.toMatchObject({ status: 400 });
    }
    await expect(svc.checkOtp("a@a.com", "000000")).rejects.toMatchObject({ status: 429 });
    expect(store().has("otps/a@a.com")).toBe(false);
  });
});

describe("signup / reset 토큰", () => {
  it("올바른 토큰은 소비되고 재사용 불가", async () => {
    const token = await svc.issueSignupToken("a@a.com");
    await svc.consumeSignupToken("a@a.com", token);
    await expect(svc.consumeSignupToken("a@a.com", token)).rejects.toMatchObject({ status: 403 });
  });

  it("토큰이 다르거나 없으면 403", async () => {
    await svc.issueSignupToken("a@a.com");
    await expect(svc.consumeSignupToken("a@a.com", "wrong")).rejects.toMatchObject({ status: 403 });
    await expect(svc.consumeSignupToken("a@a.com", undefined)).rejects.toMatchObject({ status: 403 });
  });

  it("만료된 reset 토큰은 403", async () => {
    store().set("pwreset/a@a.com", { token: "t", expiresAt: ts(-1) });
    await expect(svc.consumeResetToken("a@a.com", "t")).rejects.toMatchObject({ status: 403 });
  });
});
