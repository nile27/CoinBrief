import { test, expect } from "@playwright/test";
import {
  expectNoErrorOverlay,
  expectNoHorizontalOverflow,
  isNarrow,
  shootBothThemes,
} from "./helpers";

test.describe("signed-out", () => {
  test("1. 랜딩: 인기 코인 4개, 스테이블 없음, USD/KRW, 소켓 연결 없음", async ({ page }, info) => {
    const wsOpened: string[] = [];
    const socketReqs: string[] = [];
    page.on("websocket", (ws) => {
      // dev HMR(Vite 는 같은 origin 의 ws) 제외
      if (new URL(ws.url()).host !== new URL(page.url()).host) wsOpened.push(ws.url());
    });
    page.on("request", (r) => {
      const u = r.url();
      if (/:4000\b|socket\.io/.test(u)) socketReqs.push(u);
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    const cards = page.locator('section[aria-label="오늘의 인기 코인"] ul > li');
    await expect(cards).toHaveCount(4);
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/USDT|USDC|테더|USD\s?코인/i);
    await expect(page.getByText(/USD\/KRW\s[\d,.]+/)).toBeVisible();

    expect(wsOpened, "websocket opened on /").toEqual([]);
    expect(socketReqs, "socket requests on /").toEqual([]);

    await expectNoErrorOverlay(page);
    await shootBothThemes(page, "landing", info);
  });

  test("2. 헤더(비로그인): / 와 /login", async ({ page }, info) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header.getByRole("link", { name: "CoinBrief 홈" })).toBeVisible();
    await expect(header.getByRole("link", { name: "로그인" })).toBeVisible();
    // 홈에서는 히어로와 중복되지 않게 회원가입 링크를 헤더에 두지 않는다
    await expect(header.getByRole("link", { name: "회원가입" })).toHaveCount(0);
    await expect(header.getByRole("button", { name: "테마 전환" })).toBeVisible();

    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await expect(header.getByRole("link", { name: "로그인" })).toBeVisible();
    await expect(header.getByRole("link", { name: "회원가입" })).toBeVisible();
    await expect(page.getByRole("button", { name: "테스트 계정 로그인" })).toBeVisible();
    await expectNoErrorOverlay(page);
    await shootBothThemes(page, "login", info);

    await page.goto("/signup");
    await page.waitForLoadState("networkidle");
    await expectNoErrorOverlay(page);
    await shootBothThemes(page, "signup", info);

    for (const route of ["pwfind", "pwchange", "signend"]) {
      await page.goto(`/${route}`);
      await page.waitForLoadState("networkidle");
      await expectNoErrorOverlay(page);
      await shootBothThemes(page, route, info);
    }

    await page.goto("/존재하지-않는-페이지");
    await expect(page.getByText("페이지를 찾을 수 없습니다.")).toBeVisible();
    await shootBothThemes(page, "not-found", info);
  });

  test("4. 다크 모드 토글이 html.dark 를 바꾼다", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);
    const toggle = page.getByRole("button", { name: "테마 전환" });
    await toggle.click();
    await expect(html).toHaveClass(/dark/);
    await toggle.click();
    await expect(html).not.toHaveClass(/dark/);
  });
});

test.describe("signed-in (테스트 계정, 읽기 전용)", () => {
  test("3. 로그인 → 내 코인 → 코인리스트 → 상세 → 로그아웃 (+5. 모바일 오버플로)", async ({ page }, info) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (e) => pageErrors.push(e.message));

    await page.goto("/login");
    await page.getByRole("button", { name: "테스트 계정 로그인" }).click();
    await page.waitForURL("**/mycoin");
    await page.waitForLoadState("networkidle");

    // 헤더 (로그인 상태)
    const header = page.getByRole("banner");
    await expect(header.getByRole("button", { name: "계정 메뉴" })).toBeVisible();
    await expect(header.getByRole("button", { name: "테마 전환" })).toBeVisible();
    if (isNarrow(page)) {
      await expect(header.getByRole("button", { name: "메뉴", exact: true })).toBeVisible();
    } else {
      await expect(header.getByRole("link", { name: "내 코인" })).toBeVisible();
      await expect(header.getByRole("link", { name: "코인리스트" })).toBeVisible();
    }
    await page.waitForTimeout(2500); // 실시간 값 수신 대기
    await expectNoErrorOverlay(page);
    await shootBothThemes(page, "mycoin", info);

    // 모달은 화면 확인용으로만 열고 닫는다 (등록/삭제 확정 금지)
    page.on("dialog", (d) => d.dismiss()); // 4개 가득이면 등록 시 alert 이 뜬다
    await page.getByRole("button", { name: "코인 삭제" }).click();
    await expect(page.getByRole("heading", { name: "내 코인 삭제" })).toBeVisible();
    await shootBothThemes(page, "mycoin-delete-modal", info);
    await page.getByRole("button", { name: "닫기" }).click();
    await expect(page.getByRole("heading", { name: "내 코인 삭제" })).toHaveCount(0);

    await page.getByRole("button", { name: "코인 등록" }).click();
    if (await page.getByRole("heading", { name: "내 코인 추가" }).isVisible()) {
      await shootBothThemes(page, "mycoin-add-modal", info);
      await page.keyboard.press("Escape");
      await page.mouse.click(5, 5);
    }

    // 코인리스트 1페이지
    await page.goto("/coinlist/1");
    await page.waitForLoadState("networkidle");
    await expect(page.getByPlaceholder("코인 이름 또는 심볼 검색")).toBeVisible();
    await expect(page.locator('a[href^="/detailcoin/"]').first()).toBeVisible();
    if (isNarrow(page)) {
      // 모바일: 각 행의 이름 박스와 가격 박스가 겹치지 않아야 한다
      const rows = page.locator("ul.divide-y a");
      const n = Math.min(await rows.count(), 50);
      for (let i = 0; i < n; i++) {
        const name = await rows.nth(i).locator("span.truncate").boundingBox();
        const price = await rows.nth(i).locator("span", { hasText: /^₩/ }).first().boundingBox();
        expect(name && price, `row ${i} boxes`).toBeTruthy();
        expect(name!.x + name!.width, `row ${i} 이름/가격 겹침`).toBeLessThanOrEqual(price!.x + 0.5);
      }
    }
    await expectNoErrorOverlay(page);
    await shootBothThemes(page, "coinlist", info);

    // 상세 (BTC)
    await page.goto(`/detailcoin/BTC/${encodeURIComponent("비트코인")}`);
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "비트코인" })).toBeVisible();
    await page.waitForTimeout(1500);
    await expectNoErrorOverlay(page);
    await shootBothThemes(page, "detail-btc", info);

    // 마이페이지 (보기만)
    await page.goto("/mypage");
    await page.waitForLoadState("networkidle");
    await expectNoErrorOverlay(page);
    await shootBothThemes(page, "mypage", info);
    await page.getByRole("button", { name: "회원탈퇴" }).click(); // 열기만 하고 확정하지 않는다
    await expect(page.getByPlaceholder("회원탈퇴를 입력하세요.")).toBeVisible();
    await shootBothThemes(page, "mypage-delete-modal", info);
    await page.keyboard.press("Escape");
    await page.mouse.click(5, 5);
    await expect(page.getByPlaceholder("회원탈퇴를 입력하세요.")).toHaveCount(0);

    // 계정 메뉴 -> 마이페이지 링크 후 메뉴가 닫히는지(asChild 수정 확인)
    await page.goto("/mycoin");
    await page.getByRole("banner").getByRole("button", { name: "계정 메뉴" }).click();
    await page.getByRole("menuitem", { name: "마이페이지" }).click();
    await page.waitForURL("**/mypage");
    await expect(page.getByRole("menu")).toHaveCount(0);

    // 로그아웃
    await page.getByRole("banner").getByRole("button", { name: "계정 메뉴" }).click();
    await page.getByRole("menuitem", { name: "로그아웃" }).click();
    await page.waitForURL((u) => u.pathname === "/");
    await expect(page.getByRole("banner").getByRole("link", { name: "로그인" })).toBeVisible();

    expect(pageErrors, "uncaught page errors").toEqual([]);
    await expectNoHorizontalOverflow(page);
  });
});
