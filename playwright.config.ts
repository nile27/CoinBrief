import { defineConfig } from "@playwright/test";

// E2E_BASE_URL 로 대상(기본 Vite :5173)을 바꾼다. 이미 떠 있는 서버를 재사용한다. 브라우저는 시스템 Chrome 사용.
const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:5173";

export default defineConfig({
  testDir: "e2e",
  timeout: 150_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    channel: "chrome",
    headless: true,
    trace: "retain-on-failure",
  },
  // 기본(:5173)일 때만 Vite 를 띄운다. 다른 대상은 직접 실행해 둔다. (api 는 직접 띄워야 한다)
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm --prefix web run dev",
        url: "http://localhost:5173",
        reuseExistingServer: true,
        timeout: 120_000,
      },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
