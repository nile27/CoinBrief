require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const UPBIT_WEBSOCKET_URL =
  process.env.UPBIT_WEBSOCKET_URL || "wss://api.upbit.com/websocket/v1";

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
      console.log(symbol);
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

        console.log("📩 업비트 데이터:", receivedData);
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

const PORT = process.env.SERVER_PORT || 4000;
server.listen(PORT, () => {
  console.log(`웹소켓 서버 시작 ${PORT}`);
});
