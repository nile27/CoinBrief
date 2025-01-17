import { NextResponse } from "next/server";

let btcPrice: any = null; // 실시간 가격 저장
let ws = null; // WebSocket 인스턴스

// WebSocket 초기화 (최초 연결)
if (!ws) {
  ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    btcPrice = message.p; // 현재 비트코인 가격
    console.log(`BTC Price Updated: ${btcPrice}`);
  };

  ws.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket Closed. Reconnecting...");
    ws = null;
  };
}

export async function GET() {
  // 비트코인 가격 반환
  if (btcPrice) {
    return NextResponse.json({ symbol: "BTCUSDT", price: btcPrice });
  } else {
    return NextResponse.json(
      { error: "No data available yet" },
      { status: 500 }
    );
  }
}
