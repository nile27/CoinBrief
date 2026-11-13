import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

// 안전장치: 에뮬레이터 + demo- 프로젝트가 아니면 즉시 실패 (실제 Firebase 접근 차단)
const projectId = process.env.GCLOUD_PROJECT ?? process.env.FIREBASE_PROJECT_ID ?? "";
if (!process.env.FIRESTORE_EMULATOR_HOST) throw new Error("FIRESTORE_EMULATOR_HOST 가 설정되지 않았습니다. npm run test:emu 로 실행하세요.");
if (!projectId.startsWith("demo-")) throw new Error(`demo- 프로젝트가 아닙니다: "${projectId}"`);

type Svc = typeof import("../../services/otp.js");
type Fb = typeof import("../../lib/firebase.js");
let checkOtp: Svc["checkOtp"];
let fb: Fb;

const EMAIL = "race@test.com";
const CODE = "123456";
const ref = () => fb.db.collection("otps").doc(EMAIL);

// sendOtp 가 쓰는 것과 같은 형태로 직접 시딩
const seed = () => ref().set({ otp: CODE, expiresAt: fb.Timestamp.fromMillis(Date.now() + 5 * 60 * 1000) });

const statusOf = (r: PromiseSettledResult<unknown>) =>
  r.status === "fulfilled" ? 200 : ((r.reason as { status?: number }).status ?? -1);

beforeAll(async () => {
  fb = await import("../../lib/firebase.js");
  ({ checkOtp } = await import("../../services/otp.js"));
});
beforeEach(async () => {
  await ref().delete();
  await seed();
});
afterEach(async () => {
  await ref().delete();
});

describe("checkOtp 동시성 (Firestore 에뮬레이터)", () => {
  it("A: 틀린 OTP 20건 동시 요청에도 실제 비교(평가)는 최대 5회", async () => {
    const results = await Promise.allSettled(Array.from({ length: 20 }, (_, i) => checkOtp(EMAIL, `00000${i % 10}`)));
    const count: Record<number, number> = {};
    for (const r of results) count[statusOf(r)] = (count[statusOf(r)] ?? 0) + 1;
    // 비교가 수행된 요청 = 400(불일치) + 429(5회째 후 폐기) + 상태 없는 오류(-1: 비교는 불일치였으나
    // 그 사이 문서가 삭제돼 update 가 NOT_FOUND 로 실패한 경우). 404(이미 폐기됨)만 비교 전에 걸러진 요청이다.
    const evaluated = results.length - (count[404] ?? 0) - (count[200] ?? 0);
    console.log("A 결과:", JSON.stringify(count), "evaluated =", evaluated);
    expect(count[200] ?? 0).toBe(0);
    expect(evaluated).toBeLessThanOrEqual(5);
    expect((await ref().get()).exists).toBe(false);
  });

  it("B: 올바른 OTP 5건 동시 제출 시 성공은 정확히 1건", async () => {
    const results = await Promise.allSettled(Array.from({ length: 5 }, () => checkOtp(EMAIL, CODE)));
    const count: Record<number, number> = {};
    for (const r of results) count[statusOf(r)] = (count[statusOf(r)] ?? 0) + 1;
    console.log("B 결과:", JSON.stringify(count));
    expect(count[200] ?? 0).toBe(1);
  });
});
