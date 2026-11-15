import { test, expect, type Page, type Route, type WebSocketRoute } from "@playwright/test";

/**
 * 시세 수신 중단(stale) 감지 테스트.
 * 릴레이(socket.io)를 완전히 모킹한다: 배포 릴레이/로컬 릴레이 모두 접속하지 않는다.
 * 테스트 계정은 로그인/조회만 한다 (코인 추가/삭제 없음).
 * 이 값은 BoxRealTime 의 STALE_MS(30s) 보다 충분히 커야 한다.
 */
const PAST_STALE_MS = 45_000;

type Mock = {
  /** 구독된 심볼 하나를 골라 upbit_data 를 보낸다 */
  quote: (price: number) => void;
  symbol: () => string | undefined;
  /** 이후의 새 연결(재연결)을 거부한다 */
  refuseNew: () => void;
  /** 열려 있는 모든 소켓을 서버 쪽에서 끊는다 */
  dropAll: () => void;
};

async function mockRelay(page: Page): Promise<Mock> {
  let seq = 0;
  let refuse = false;
  const symbols = new Map<string, string>(); // sid -> symbol
  const sockets = new Map<string, WebSocketRoute>();
  const probed = new Set<string>();
  const upgraded = new Set<string>();
  const phase = new Map<string, number>(); // sid -> polling GET 횟수
  const held = new Map<string, Route[]>(); // 업그레이드 시 noop 으로 풀어줄 long-poll

  const cors = { "access-control-allow-origin": "*", "content-type": "text/plain; charset=UTF-8" };

  await page.route(/\/socket\.io\/\?.*transport=polling/, async (route) => {
    const req = route.request();
    if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(req.url())) return route.abort(); // 로컬 외 차단
    if (refuse) return route.abort();
    const sid = new URL(req.url()).searchParams.get("sid");
    if (req.method() === "POST") {
      for (const p of (req.postData() ?? "").split("\x1e")) {
        const m = p.match(/^42\["subscribe","([^"]+)"\]/);
        if (m && sid) symbols.set(sid, m[1]);
      }
      return route.fulfill({ status: 200, headers: cors, body: "ok" });
    }
    if (!sid) {
      const id = `s${++seq}`;
      phase.set(id, 0);
      const open = { sid: id, upgrades: ["websocket"], pingInterval: 1e7, pingTimeout: 1e7, maxPayload: 1e6 };
      return route.fulfill({ status: 200, headers: cors, body: `0${JSON.stringify(open)}` });
    }
    const n = (phase.get(sid) ?? 0) + 1;
    phase.set(sid, n);
    if (n === 1) return route.fulfill({ status: 200, headers: cors, body: `40{"sid":"n${sid}"}` });
    if (probed.has(sid)) return route.fulfill({ status: 200, headers: cors, body: "6" });
    held.set(sid, [...(held.get(sid) ?? []), route]); // 업그레이드까지 보류
  });

  await page.routeWebSocket(/\/socket\.io\/\?.*transport=websocket/, (ws) => {
    const sid = new URL(ws.url()).searchParams.get("sid") ?? "";
    if (refuse) return void ws.close();
    sockets.set(sid, ws);
    ws.onMessage((raw) => {
      const msg = String(raw);
      if (msg === "2probe") {
        probed.add(sid);
        ws.send("3probe");
        for (const r of held.get(sid) ?? []) void r.fulfill({ status: 200, headers: cors, body: "6" });
        held.delete(sid);
      }
      if (msg === "5") upgraded.add(sid); // 클라이언트가 업그레이드를 마친 뒤부터 전송 가능
      const m = msg.match(/^42\["subscribe","([^"]+)"\]/);
      if (m) symbols.set(sid, m[1]);
    });
    ws.onClose(() => sockets.delete(sid));
  });

  const target = () => [...sockets.keys()].find((s) => symbols.has(s) && upgraded.has(s));
  return {
    symbol: () => symbols.get(target() ?? ""),
    quote: (price) => {
      const sid = target();
      if (!sid) throw new Error("no subscribed socket");
      const sym = symbols.get(sid)!;
      const data = {
        code: `KRW-${sym}`,
        trade_price: price,
        change_rate: 0.0123,
        change: "RISE",
        acc_trade_price_24h: 1,
        high_price: price,
        low_price: price,
        acc_trade_volume_24h: 1,
      };
      sockets.get(sid)!.send(`42${JSON.stringify(["upbit_data", data])}`);
    },
    refuseNew: () => {
      refuse = true;
    },
    dropAll: () => {
      for (const ws of sockets.values()) void ws.close();
    },
  };
}

async function openMyCoin(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "테스트 계정 로그인" }).click();
  await page.waitForURL("**/mycoin");
}

test.describe("시세 수신 중단 감지 (테스트 계정, 읽기 전용)", () => {
  test("시세가 끊기면 지연 표시, 다시 오면 사라진다", async ({ page }) => {
    await page.clock.install();
    const relay = await mockRelay(page);
    await openMyCoin(page);

    await expect.poll(() => relay.symbol(), { timeout: 30_000 }).toBeTruthy();
    // 업그레이드(ws 연결)까지 기다린 뒤 시세 전송
    await expect
      .poll(async () => {
        try {
          relay.quote(1_000_000);
          return true;
        } catch {
          return false;
        }
      })
      .toBe(true);
    await expect(page.getByText("₩1,000,000").first()).toBeVisible();
    await expect(page.getByText(/시세 지연/)).toHaveCount(0);

    // 이후 침묵: 연결은 유지된 채 시간만 흐른다
    await page.clock.fastForward(PAST_STALE_MS);
    await expect(page.getByText(/시세 지연 · \d+초 전 기준/).first()).toBeVisible();
    await expect(page.getByText("실시간 연결 끊김 · 재연결 중")).toHaveCount(0);

    // 시세가 다시 수신된 코인만 지연 표시가 사라진다 (다른 코인은 계속 침묵 중)
    const before = await page.getByText(/시세 지연/).count();
    relay.quote(1_100_000);
    await expect(page.getByText(/시세 지연/)).toHaveCount(before - 1);
  });

  test("연결 끊김이 시세 지연보다 우선한다", async ({ page }) => {
    await page.clock.install();
    const relay = await mockRelay(page);
    await openMyCoin(page);

    await expect.poll(() => relay.symbol(), { timeout: 30_000 }).toBeTruthy();
    await expect
      .poll(async () => {
        try {
          relay.quote(1_000_000);
          return true;
        } catch {
          return false;
        }
      })
      .toBe(true);

    relay.refuseNew();
    relay.dropAll();
    await expect(page.getByText("실시간 연결 끊김 · 재연결 중").first()).toBeVisible();
    await page.clock.fastForward(PAST_STALE_MS);
    await expect(page.getByText("실시간 연결 끊김 · 재연결 중").first()).toBeVisible();
    await expect(page.getByText(/시세 지연/)).toHaveCount(0);
  });
});
