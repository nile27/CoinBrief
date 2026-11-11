import { beforeEach, describe, expect, it, vi } from "vitest";

const { verifySessionCookie } = vi.hoisted(() => ({ verifySessionCookie: vi.fn() }));
vi.mock("../lib/firebase.js", () => ({ auth: { verifySessionCookie } }));

import { readSession, requireSession } from "../middlewares/session.js";

function mockRes() {
  const res: any = { locals: {} };
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
}

beforeEach(() => {
  verifySessionCookie.mockReset();
});

describe("readSession", () => {
  it("쿠키가 없으면 null (검증 호출 없음)", async () => {
    expect(await readSession({ cookies: {} } as any)).toBeNull();
    expect(verifySessionCookie).not.toHaveBeenCalled();
  });

  it("검증 실패 시 null", async () => {
    verifySessionCookie.mockRejectedValue(new Error("bad"));
    expect(await readSession({ cookies: { session: "x" } } as any)).toBeNull();
  });

  it("폐기 여부(checkRevoked)를 true 로 확인한다", async () => {
    verifySessionCookie.mockResolvedValue({ uid: "u1" });
    await readSession({ cookies: { session: "c" } } as any);
    expect(verifySessionCookie).toHaveBeenCalledWith("c", true);
  });
});

describe("requireSession", () => {
  it("세션이 없으면 401 이고 next 를 호출하지 않는다", async () => {
    const res = mockRes();
    const next = vi.fn();
    await requireSession({ cookies: {} } as any, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("유효하면 res.locals.uid 를 설정하고 next 호출", async () => {
    verifySessionCookie.mockResolvedValue({ uid: "u1" });
    const res = mockRes();
    const next = vi.fn();
    await requireSession({ cookies: { session: "c" } } as any, res, next);
    expect(res.locals.uid).toBe("u1");
    expect(next).toHaveBeenCalledOnce();
  });
});
