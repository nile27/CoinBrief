import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const market = searchParams.get("market");
  const interval = searchParams.get("interval") || "days";
  const count = searchParams.get("count") || "30";

  if (!market) {
    return NextResponse.json(
      { error: "마켓 정보가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_UPBIT_API_URL}/candles/${interval}?market=${market}&count=${count}`,
      {
        headers: { Accept: "application/json" },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "업비트 API 요청 실패" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("업비트 캔들 데이터 호출 실패:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
