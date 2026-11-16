require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const WebSocket = require("ws");

const ALLOWED_ORIGINS = [
  "https://coinbrief.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173", // Vite SPA dev
];

function createRelay(options = {}) {
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS },
});

const UPBIT_WEBSOCKET_URL =
  options.upbitUrl ||
  process.env.UPBIT_WEBSOCKET_URL ||
  "wss://api.upbit.com/websocket/v1";

// 헬스체크 / 깨우기(keep-alive)용 엔드포인트
app.get("/", (req, res) => {
  res.status(200).send("OK");
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", time: Date.now() });
});

const RECONNECT_BASE_MS =
  options.reconnectBaseMs ?? Number(process.env.UPBIT_RECONNECT_BASE_MS || 1000);
const RECONNECT_MAX_MS =
  options.reconnectMaxMs ?? Number(process.env.UPBIT_RECONNECT_MAX_MS || 30000);
const PING_INTERVAL_MS =
  options.pingIntervalMs ?? Number(process.env.UPBIT_PING_INTERVAL_MS || 30000);

io.on("connection", (socket) => {
  console.log("✅ 클라이언트 연결됨");

  // 클라이언트당 업스트림 소켓은 최대 1개.
  // generation 은 subscribe/unsubscribe/disconnect 마다 증가해, 이전 소켓의
  // 늦은 close/error 핸들러가 재연결을 일으키지 못하게 한다.
  let generation = 0;
  let upbitSocket = null;
  let reconnectTimer = null;
  let heartbeat = null;
  let attempts = 0;

  const teardown = () => {
    generation++;
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
    clearInterval(heartbeat);
    heartbeat = null;
    if (upbitSocket) {
      const old = upbitSocket;
      upbitSocket = null;
      old.removeAllListeners("message");
      old.on("error", () => {}); // 닫는 도중 에러로 프로세스가 죽지 않게
      try {
        old.close();
      } catch {
        old.terminate();
      }
    }
  };

  const connect = (symbol) => {
    const gen = generation;
    const ws = new WebSocket(UPBIT_WEBSOCKET_URL);
    upbitSocket = ws;
    let alive = true;

    const onDown = (why) => {
      if (gen !== generation) return; // 의도적으로 닫힌(낡은) 소켓
      clearInterval(heartbeat);
      heartbeat = null;
      if (reconnectTimer) return; // close 와 error 가 둘 다 와도 한 번만
      const delay = Math.min(RECONNECT_BASE_MS * 2 ** attempts, RECONNECT_MAX_MS);
      attempts++;
      console.log(`🔁 업비트 ${why}, ${delay}ms 후 재연결 (${attempts}회차)`);
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        if (gen !== generation) return;
        connect(symbol);
      }, delay);
    };

    ws.on("open", () => {
      if (gen !== generation) return;
      console.log("✅ 업비트 웹소켓 연결됨");
      attempts = 0;
      alive = true;
      ws.send(
        JSON.stringify([
          { ticket: "test" },
          { type: "ticker", codes: [`KRW-${symbol}`] },
        ]),
      );
      heartbeat = setInterval(() => {
        if (!alive) {
          console.error("❌ 업비트 pong 없음, 연결 종료 후 재연결");
          ws.terminate(); // close 이벤트 -> onDown
          return;
        }
        alive = false;
        ws.ping();
      }, PING_INTERVAL_MS);
    });

    ws.on("pong", () => {
      alive = true;
    });

    ws.on("message", (data) => {
      if (gen !== generation) return;
      try {
        const receivedData = JSON.parse(data);
        if (receivedData.error) {
          console.error("❌ 업비트 오류 발생:", receivedData.error);
          return;
        }

        socket.emit("upbit_data", receivedData);
      } catch (error) {
        console.error("❌ JSON 파싱 오류:", error);
      }
    });

    ws.on("close", () => {
      console.log("🔴 업비트 웹소켓 종료");
      onDown("종료");
    });

    ws.on("error", (error) => {
      console.error("❌ 업비트 웹소켓 에러:", error);
      onDown("에러"); // 연결 실패 시 close 가 안 오는 경우 대비
    });
  };

  socket.on("subscribe", (symbol) => {
    console.log(`🔗 ${symbol} 구독 요청`);
    teardown();
    attempts = 0;
    connect(symbol);
  });

  socket.on("unsubscribe", (symbol) => {
    console.log(`🚫 ${symbol} 구독 해제`);
    teardown();
  });

  socket.on("disconnect", () => {
    console.log("🔴 클라이언트 연결 해제");
    teardown();
  });
});

return { app, server, io };
}

module.exports = { createRelay, ALLOWED_ORIGINS };

if (require.main === module) {
  const { server } = createRelay();
  const PORT = process.env.PORT || process.env.SERVER_PORT || 4000;
  server.listen(PORT, () => {
    console.log(`웹소켓 서버 시작 ${PORT}`);
  });
}
