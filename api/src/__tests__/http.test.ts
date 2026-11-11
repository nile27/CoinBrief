import { describe, expect, it, vi } from "vitest";
import { HttpError, fail } from "../lib/http.js";

describe("HttpError / fail", () => {
  it("status 와 body 를 보존한다", () => {
    const e = new HttpError(418, { a: 1 });
    expect(e).toBeInstanceOf(Error);
    expect(e.status).toBe(418);
    expect(e.body).toEqual({ a: 1 });
  });

  it("HttpError 는 그대로 반환한다", () => {
    const e = new HttpError(403, { error: "x" });
    expect(fail(e, () => ({}))).toBe(e);
  });

  it("그 외 에러는 500 으로 변환하고 로그를 남긴다", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const r = fail(new Error("boom"), (m) => ({ error: m }), "로그:");
    expect(r.status).toBe(500);
    expect(r.body).toEqual({ error: "boom" });
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });
});
