import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  const interval = searchParams.get("interval");
  const limit = searchParams.get("limit");

  if (!symbol || !interval || !limit) {
    return NextResponse.json(
      { error: "입력한 값이 부족합니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("차트 데이터 실패");
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("차트 데이터 실패:", error);
    return NextResponse.json({ error: "차트 데이터 실패" }, { status: 500 });
  }
}
