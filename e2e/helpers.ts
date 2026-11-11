import { expect, type Page, type TestInfo } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

export const SHOT_DIR =
  process.env.SHOT_DIR ??
  path.join(process.cwd(), "test-results", "screenshots");

/** 모바일 프로젝트인지 (뷰포트 너비 기준) */
export const isNarrow = (page: Page) => (page.viewportSize()?.width ?? 1440) <= 500;

/** Vite 개발 오류 오버레이가 없는지 */
export async function expectNoErrorOverlay(page: Page) {
  await expect(page.locator("vite-error-overlay")).toHaveCount(0);
}

/** 모바일에서 가로 스크롤이 생기지 않는지 */
export async function expectNoHorizontalOverflow(page: Page) {
  if (!isNarrow(page)) return;
  // isMobile 에뮬레이션은 넘치면 innerWidth 자체를 키우므로, 설정한 뷰포트 너비와 비교한다
  const iw = page.viewportSize()!.width;
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(sw, `scrollWidth(${sw}) > innerWidth(${iw}) @ ${page.url()}`).toBeLessThanOrEqual(iw);
}

/** 라이트/다크 풀페이지 스크린샷 (+ 모바일이면 오버플로 검사) */
export async function shootBothThemes(page: Page, name: string, info: TestInfo) {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await expect(page.locator("html")).toHaveClass(scheme === "dark" ? /dark/ : /^((?!dark).)*$/);
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(SHOT_DIR, `${info.project.name}-${scheme}-${name}.png`),
      fullPage: true,
    });
    if (scheme === "light") await expectNoHorizontalOverflow(page);
  }
  await page.emulateMedia({ colorScheme: "light" });
}
