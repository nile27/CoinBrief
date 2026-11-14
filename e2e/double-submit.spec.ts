import { test, expect, type Page } from "@playwright/test";

// 쓰기 엔드포인트는 전부 page.route 로 목킹한다 (실제 서버/계정에 요청이 나가지 않는다).
// 같은 tick 에 click 을 두 번 발사해, React 리렌더(disabled) 이전에 두 번째 클릭이 통과하는지 본다.
const DELAY = 500;
const WRITE = ["sendotp", "verifyotp", "register", "pwfind", "pwchange"] as const;
type Ep = (typeof WRITE)[number];

async function mockWrites(page: Page, overrides: Partial<Record<Ep, { status: number; body: object }>> = {}) {
  const calls: Record<Ep, number> = { sendotp: 0, verifyotp: 0, register: 0, pwfind: 0, pwchange: 0 };
  page.on("dialog", (d) => d.accept());
  for (const ep of WRITE) {
    await page.route(`**/api/${ep}`, async (route) => {
      calls[ep]++;
      await new Promise((r) => setTimeout(r, DELAY));
      const o = overrides[ep] ?? { status: 200, body: { message: "ok" } };
      await route.fulfill({ status: o.status, contentType: "application/json", body: JSON.stringify(o.body) });
    });
  }
  return calls;
}

const sameTickDoubleClick = (loc: ReturnType<Page["locator"]>) =>
  loc.evaluate((el) => {
    (el as HTMLElement).click();
    (el as HTMLElement).click();
  });

const fillSignupBasics = async (page: Page) => {
  await page.getByPlaceholder("이름").fill("홍길동");
  await page.getByPlaceholder("이메일").fill("dbl@example.com");
};

test.describe("중복 제출 방어 (모든 쓰기 API 목킹)", () => {
  test("회원가입 OTP 발송: 같은 tick 더블클릭 → sendotp 1건", async ({ page }) => {
    const calls = await mockWrites(page);
    await page.goto("/signup");
    await fillSignupBasics(page);
    await sameTickDoubleClick(page.getByRole("button", { name: /메일 보내기|재발송/ }));
    await page.waitForTimeout(DELAY + 400);
    expect(calls.sendotp, "sendotp 요청 수").toBe(1);
  });

  test("회원가입 OTP 검증: 더블클릭 → verifyotp 1건", async ({ page }) => {
    const calls = await mockWrites(page);
    await page.goto("/signup");
    await fillSignupBasics(page);
    await page.getByRole("button", { name: /메일 보내기|재발송/ }).click();
    await page.getByPlaceholder("인증 번호").fill("123456");
    await sameTickDoubleClick(page.getByRole("button", { name: "인증", exact: true }));
    await page.waitForTimeout(DELAY + 400);
    expect(calls.verifyotp, "verifyotp 요청 수").toBe(1);
  });

  test("회원가입 제출: 더블클릭 → register 1건", async ({ page }) => {
    const calls = await mockWrites(page);
    await page.goto("/signup");
    await fillSignupBasics(page);
    await page.getByRole("button", { name: /메일 보내기|재발송/ }).click();
    await page.getByPlaceholder("인증 번호").fill("123456");
    await page.getByRole("button", { name: "인증", exact: true }).click();
    await expect(page.getByText("OTP 인증 성공!")).toBeVisible();
    await page.getByRole("button", { name: "닫기" }).click();
    await page.getByPlaceholder("닉네임").fill("닉네임");
    await page.getByPlaceholder(/^비밀번호 \(/).fill("Passw0rd!x");
    await page.getByPlaceholder("비밀번호 확인").fill("Passw0rd!x");
    await sameTickDoubleClick(page.getByRole("button", { name: "SIGN UP" }));
    await page.waitForTimeout(DELAY + 600);
    expect(calls.register, "register 요청 수").toBe(1);
  });

  test("비밀번호 찾기 OTP 발송: 더블클릭 → sendotp 1건", async ({ page }) => {
    const calls = await mockWrites(page);
    await page.goto("/pwfind");
    await fillSignupBasics(page);
    await sameTickDoubleClick(page.getByRole("button", { name: /메일 보내기|재발송/ }));
    await page.waitForTimeout(DELAY + 400);
    expect(calls.sendotp, "sendotp 요청 수").toBe(1);
  });

  test("비밀번호 찾기 OTP 검증: 더블클릭 → pwfind 1건", async ({ page }) => {
    const calls = await mockWrites(page);
    await page.goto("/pwfind");
    await fillSignupBasics(page);
    await page.getByRole("button", { name: /메일 보내기|재발송/ }).click();
    await expect(page.getByPlaceholder("인증 번호")).toBeVisible();
    await page.getByPlaceholder("인증 번호").fill("123456");
    await sameTickDoubleClick(page.getByRole("button", { name: "인증", exact: true }));
    await page.waitForTimeout(DELAY + 400);
    expect(calls.pwfind, "pwfind 요청 수").toBe(1);
  });

  test("비밀번호 변경: 더블클릭 → pwchange 1건", async ({ page }) => {
    const calls = await mockWrites(page);
    const email = Buffer.from("dbl@example.com").toString("base64");
    await page.goto(`/pwchange?email=${encodeURIComponent(email)}`);
    await page.getByPlaceholder(/^비밀번호 \(/).fill("Passw0rd!x");
    await page.getByPlaceholder("비밀번호 확인").fill("Passw0rd!x");
    await sameTickDoubleClick(page.getByRole("button", { name: "SIGN UP" }));
    await page.waitForTimeout(DELAY + 600);
    expect(calls.pwchange, "pwchange 요청 수").toBe(1);
  });
});
