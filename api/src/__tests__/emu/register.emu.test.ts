import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

// 안전장치: 에뮬레이터(Firestore+Auth) + demo- 프로젝트가 아니면 즉시 실패 (실제 Firebase 접근 차단)
const projectId = process.env.GCLOUD_PROJECT ?? process.env.FIREBASE_PROJECT_ID ?? "";
if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error("FIRESTORE_EMULATOR_HOST 가 설정되지 않았습니다. npm run test:emu 로 실행하세요.");
if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) throw new Error("FIREBASE_AUTH_EMULATOR_HOST 가 설정되지 않았습니다. npm run test:emu 로 실행하세요.");
if (!projectId.startsWith("demo-")) throw new Error(`demo- 프로젝트가 아닙니다: "${projectId}"`);

// 메일은 절대 보내지 않는다 (nodemailer 목)
const { sendMail } = vi.hoisted(() => ({ sendMail: vi.fn(async () => {}) }));
vi.mock("nodemailer", () => ({ default: { createTransport: () => ({ sendMail }) } }));

type Fb = typeof import("../../lib/firebase.js");
let fb: Fb;
let server: Server;
let base: string;
let sendOtp: typeof import("../../services/otp.js").sendOtp;
let n = 0;
const uniq = () => `dup${Date.now()}_${n++}@test.com`;

beforeAll(async () => {
  fb = await import("../../lib/firebase.js");
  ({ sendOtp } = await import("../../services/otp.js"));
  const express = (await import("express")).default;
  const cookieParser = (await import("cookie-parser")).default;
  const authRoutes = (await import("../../routes/auth.js")).default;
  const otpRoutes = (await import("../../routes/otp.js")).default;
  const { HttpError } = await import("../../lib/http.js");
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use("/api", authRoutes, otpRoutes);
  app.use(((err, _req, res, _next) => {
    if (err instanceof HttpError) res.status(err.status).json(err.body);
    else res.status(500).json({ message: "서버 에러 발생" });
  }) as import("express").ErrorRequestHandler);
  server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(() => new Promise((r) => server.close(() => r(undefined))));

const TOKEN = "t".repeat(64);
const seedToken = (email: string) =>
  fb.db.collection("signupVerified").doc(email).set({ token: TOKEN, expiresAt: fb.Timestamp.fromMillis(Date.now() + 15 * 60_000) });
const postRegister = async (email: string) => {
  const r = await fetch(`${base}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: `signupok=${TOKEN}` },
    body: JSON.stringify({ email, password: "Passw0rd!x", displayName: "nick", name: "홍길동" }),
  });
  return r.status;
};
const countAuth = async (email: string) => (await fb.auth.listUsers()).users.filter((u) => u.email === email).length;
const countDocs = async (email: string) => (await fb.db.collection("users").where("email", "==", email).get()).size;
const tally = (xs: number[]) => xs.reduce<Record<number, number>>((a, x) => ((a[x] = (a[x] ?? 0) + 1), a), {});

describe("회원가입 중복 요청 (Auth + Firestore 에뮬레이터)", () => {
  it("a: 이미 가입된 이메일로 register 하면 409 (500 아님)", async () => {
    const email = uniq();
    await fb.auth.createUser({ email, password: "Passw0rd!x" });
    await seedToken(email);
    const status = await postRegister(email);
    console.log("a 결과: 기존 이메일 가입 →", status);
    expect(status).toBe(409);
    expect(await countDocs(email)).toBe(0);
  });

  it("b: 같은 가입 토큰으로 동시 5건 register 하면 성공 정확히 1건, 나머지는 4xx, Auth 계정·users 문서 1개", async () => {
    const email = uniq();
    await seedToken(email);
    const statuses = await Promise.all(Array.from({ length: 5 }, () => postRegister(email)));
    const t = tally(statuses);
    const [authN, docN] = [await countAuth(email), await countDocs(email)];
    console.log("b 결과:", JSON.stringify(t), "auth =", authN, "users 문서 =", docN);
    expect(t[200] ?? 0).toBe(1);
    expect(statuses.filter((s) => s >= 500)).toEqual([]);
    expect(authN).toBe(1);
    expect(docN).toBe(1);
  });

  it("c: 회원가입 OTP 발송은 이름이 달라도 기존 이메일이면 409, 메일 미발송", async () => {
    const email = uniq();
    await fb.db.collection("users").doc("u-" + email).set({ email, name: "기존이름", displayName: "x", mycoin: [] });
    sendMail.mockClear();
    const err = await sendOtp(email, "다른이름", false, "10.0.0." + n).then(
      () => null,
      (e) => e as { status?: number },
    );
    console.log("c 결과: 같은 이메일+다른 이름 →", err?.status ?? "성공(메일 발송)", "sendMail 호출 =", sendMail.mock.calls.length);
    expect(err?.status).toBe(409);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("d: 비밀번호 찾기는 이메일+이름 조합 검사를 유지한다 (이름 다르면 404)", async () => {
    const email = uniq();
    await fb.db.collection("users").doc("u-" + email).set({ email, name: "기존이름", displayName: "x", mycoin: [] });
    sendMail.mockClear();
    await expect(sendOtp(email, "다른이름", true, "10.1.0." + n)).rejects.toMatchObject({ status: 404 });
    expect(sendMail).not.toHaveBeenCalled();
    await fb.db.collection("otpRate").doc(email).delete(); // 60초 쿨다운 초기화
    await sendOtp(email, "기존이름", true, "10.2.0." + n);
    expect(sendMail).toHaveBeenCalledOnce();
  });
});
