const { test } = require("node:test");
const assert = require("node:assert");
const { createRequire } = require("node:module");
const path = require("node:path");
const WebSocket = require("ws");
const { createRelay } = require("../server");

// socket.io-client 는 server 의존성이 아니므로 web/node_modules 에서 빌려 쓴다 (새 의존성 없음).
const webRequire = createRequire(path.join(__dirname, "../../web/package.json"));
const { io: connect } = webRequire("socket.io-client");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(fn, ms = 4000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (fn()) return true;
    await wait(10);
  }
  return false;
}

async function setup({ relayOptions = {}, autoPong = true } = {}) {
  const conns = []; // 업스트림(가짜 업비트)에 들어온 연결들
  const subs = []; // 받은 구독 메시지
  const wss = new WebSocket.Server({ port: 0, autoPong });
  wss.on("connection", (ws) => {
    conns.push(ws);
    ws.on("message", (m) => subs.push(JSON.parse(m.toString())));
    ws.on("error", () => {});
  });
  await new Promise((r) => wss.on("listening", r));
  const upbitUrl = `ws://127.0.0.1:${wss.address().port}`;

  const relay = createRelay({
    upbitUrl,
    reconnectBaseMs: 20,
    reconnectMaxMs: 100,
    pingIntervalMs: 60,
    ...relayOptions,
  });
  await new Promise((r) => relay.server.listen(0, "127.0.0.1", r));
  const client = connect(`http://127.0.0.1:${relay.server.address().port}`, {
    transports: ["websocket"],
    reconnection: false,
  });
  const received = [];
  client.on("upbit_data", (d) => received.push(d));
  await new Promise((r) => client.on("connect", r));

  const close = async () => {
    client.close();
    for (const ws of wss.clients) ws.terminate();
    await new Promise((r) => wss.close(r));
    relay.io.close();
    if (relay.server.listening) await new Promise((r) => relay.server.close(r));
  };
  return { conns, subs, wss, relay, client, received, close };
}

const tick = (n) => JSON.stringify({ type: "ticker", code: "KRW-BTC", trade_price: n });

test("(1) 업스트림 ticker 가 클라이언트로 전달된다", async () => {
  const t = await setup();
  try {
    t.client.emit("subscribe", "BTC");
    assert.ok(await until(() => t.conns.length === 1), "업스트림 연결");
    assert.ok(await until(() => t.subs.length === 1), "구독 메시지");
    assert.deepStrictEqual(t.subs[0][1].codes, ["KRW-BTC"]);
    t.conns[0].send(tick(1));
    assert.ok(await until(() => t.received.length === 1));
    assert.strictEqual(t.received[0].trade_price, 1);
  } finally {
    await t.close();
  }
});

test("(2) 업스트림이 끊기면 재연결·재구독하고 이후 ticker 가 전달된다", async () => {
  const t = await setup();
  try {
    t.client.emit("subscribe", "BTC");
    assert.ok(await until(() => t.subs.length === 1));
    t.conns[0].terminate();
    assert.ok(await until(() => t.conns.length === 2), "재연결 안 됨");
    assert.ok(await until(() => t.subs.length === 2), "재구독 안 됨");
    assert.deepStrictEqual(t.subs[1][1].codes, ["KRW-BTC"]);
    t.conns[1].send(tick(2));
    assert.ok(await until(() => t.received.some((d) => d.trade_price === 2)));
  } finally {
    await t.close();
  }
});

test("(3a) unsubscribe 후에는 재연결하지 않는다", async () => {
  const t = await setup();
  try {
    t.client.emit("subscribe", "BTC");
    assert.ok(await until(() => t.subs.length === 1));
    t.client.emit("unsubscribe", "BTC");
    await wait(300);
    assert.strictEqual(t.conns.length, 1);
  } finally {
    await t.close();
  }
});

test("(3b) 업스트림이 끊긴 뒤 backoff 대기 중 unsubscribe 하면 재연결하지 않는다", async () => {
  const t = await setup({ relayOptions: { reconnectBaseMs: 200, reconnectMaxMs: 200 } });
  try {
    t.client.emit("subscribe", "BTC");
    assert.ok(await until(() => t.subs.length === 1));
    t.conns[0].terminate();
    await wait(60); // close 처리 후 타이머 대기 중
    t.client.emit("unsubscribe", "BTC");
    await wait(500);
    assert.strictEqual(t.conns.length, 1);
  } finally {
    await t.close();
  }
});

test("(3c) 클라이언트 disconnect 후에는 재연결하지 않는다", async () => {
  const t = await setup({ relayOptions: { reconnectBaseMs: 200, reconnectMaxMs: 200 } });
  try {
    t.client.emit("subscribe", "BTC");
    assert.ok(await until(() => t.subs.length === 1));
    t.conns[0].terminate();
    await wait(60);
    t.client.close();
    await wait(500);
    assert.strictEqual(t.conns.length, 1);
  } finally {
    await t.close();
  }
});

test("(3d) 다른 심볼로 재구독하면 이전 소켓은 재연결하지 않고 연결은 하나만 유지된다", async () => {
  const t = await setup();
  try {
    t.client.emit("subscribe", "BTC");
    assert.ok(await until(() => t.subs.length === 1));
    t.client.emit("subscribe", "ETH");
    assert.ok(await until(() => t.conns.length === 2));
    await wait(300);
    assert.strictEqual(t.conns.length, 2);
    assert.ok(await until(() => t.subs.length === 2));
    assert.deepStrictEqual(t.subs[1][1].codes, ["KRW-ETH"]);
  } finally {
    await t.close();
  }
});

test("(4) pong 이 오지 않으면 terminate 후 재연결한다", async () => {
  const t = await setup({ autoPong: false });
  try {
    t.client.emit("subscribe", "BTC");
    assert.ok(await until(() => t.subs.length === 1));
    assert.ok(await until(() => t.conns.length >= 2, 3000), "heartbeat 로 재연결 안 됨");
    assert.ok(await until(() => t.subs.length >= 2));
    t.conns[t.conns.length - 1].send(tick(3));
    assert.ok(await until(() => t.received.some((d) => d.trade_price === 3)));
  } finally {
    await t.close();
  }
});
