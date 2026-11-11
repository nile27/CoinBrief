import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  verifySessionCookie: vi.fn(),
  addCoin: vi.fn(async () => {}),
  deleteCoin: vi.fn(async () => {}),
  deleteUser: vi.fn(async () => {}),
}));
vi.mock("../lib/firebase.js", () => ({
  auth: { verifySessionCookie: m.verifySessionCookie },
  db: {},
  FieldValue: {},
  Timestamp: {},
}));
vi.mock("../services/coins.js", () => ({
  addCoin: m.addCoin,
  deleteCoin: m.deleteCoin,
  deleteUser: m.deleteUser,
}));

import app from "../app.js";

let server: Server;
let base: string;
beforeAll(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
});
afterAll(() => new Promise((r) => server.close(r)));
beforeEach(() => {
  vi.clearAllMocks();
  m.verifySessionCookie.mockResolvedValue({ uid: "me" });
});

const post = (path: string, body: unknown, cookie = "session=ok") =>
  fetch(`${base}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body),
  });

describe("코인 라우트 보안", () => {
  it("세션 쿠키가 없으면 401", async () => {
    const r = await post("/addcoin", { uid: "me", coin: { id: "BTC" } }, "");
    expect(r.status).toBe(401);
    expect(m.addCoin).not.toHaveBeenCalled();
  });

  it("본문 uid 가 세션 uid 와 다르면 403 (IDOR 차단)", async () => {
    const r = await post("/addcoin", { uid: "victim", coin: { id: "BTC" } });
    expect(r.status).toBe(403);
    expect(m.addCoin).not.toHaveBeenCalled();
  });

  it("필수 데이터가 없으면 400", async () => {
    expect((await post("/addcoin", { uid: "me" })).status).toBe(400);
    expect((await post("/deletecoin", { uid: "me" })).status).toBe(400);
  });

  it("본인 요청은 200 으로 서비스 호출", async () => {
    const r = await post("/addcoin", { uid: "me", coin: { id: "BTC" } });
    expect(r.status).toBe(200);
    expect(m.addCoin).toHaveBeenCalledWith("me", { id: "BTC" });
  });

  it("deleteuser: 타인 uid 는 403, 본인은 200", async () => {
    const del = (uid: string) =>
      fetch(`${base}/deleteuser?uid=${uid}`, { method: "DELETE", headers: { cookie: "session=ok" } });
    expect((await del("victim")).status).toBe(403);
    expect(m.deleteUser).not.toHaveBeenCalled();
    expect((await del("me")).status).toBe(200);
    expect(m.deleteUser).toHaveBeenCalledWith("me");
  });

  it("서비스의 예기치 못한 에러는 500 본문으로 변환", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    m.addCoin.mockRejectedValueOnce(new Error("db down"));
    const r = await post("/addcoin", { uid: "me", coin: { id: "BTC" } });
    expect(r.status).toBe(500);
    expect(await r.json()).toEqual({ error: "코인 추가 실패" });
  });

  it("잘못된 JSON 본문은 4xx (500 아님)", async () => {
    const r = await fetch(`${base}/addcoin`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: "session=ok" },
      body: "{bad",
    });
    expect(r.status).toBe(400);
  });
});
