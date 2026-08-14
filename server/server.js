require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const ALLOWED_ORIGINS = [
  "https://coinbrief.vercel.app",
  "http://localhost:3000",
];

const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS },
});

const UPBIT_WEBSOCKET_URL =
  process.env.UPBIT_WEBSOCKET_URL || "wss://api.upbit.com/websocket/v1";

// 헬스체크 / 깨우기(keep-alive)용 엔드포인트
app.get("/", (req, res) => {
  res.status(200).send("OK");
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", time: Date.now() });
});

io.on("connection", (socket) => {
  console.log("✅ 클라이언트 연결됨");

  let upbitSocket = null;

  socket.on("subscribe", (symbol) => {
    console.log(`🔗 ${symbol} 구독 요청`);

    if (upbitSocket) {
      upbitSocket.close();
    }

    upbitSocket = new WebSocket(UPBIT_WEBSOCKET_URL);

    upbitSocket.on("open", () => {
      console.log("✅ 업비트 웹소켓 연결됨");

      const subscribeData = [
        { ticket: "test" },
        { type: "ticker", codes: [`KRW-${symbol}`] },
      ];
      upbitSocket.send(JSON.stringify(subscribeData));
    });

    upbitSocket.on("message", (data) => {
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

    upbitSocket.on("close", () => {
      console.log("🔴 업비트 웹소켓 종료");
    });

    upbitSocket.on("error", (error) => {
      console.error("❌ 업비트 웹소켓 에러:", error);
    });
  });

  socket.on("unsubscribe", (symbol) => {
    console.log(`🚫 ${symbol} 구독 해제`);
    if (upbitSocket) {
      upbitSocket.close();
      upbitSocket = null;
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 클라이언트 연결 해제");
    if (upbitSocket) {
      upbitSocket.close();
    }
  });
});

const PORT = process.env.PORT || process.env.SERVER_PORT || 4000;
server.listen(PORT, () => {
  console.log(`웹소켓 서버 시작 ${PORT}`);
});
