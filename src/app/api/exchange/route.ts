import { NextResponse } from "next/server";
import { getUsdKrw } from "@/lib/exchangeRate";

export async function GET() {
  const usd = await getUsdKrw();
  if (!usd) {
    return NextResponse.json(
      { message: "환율 정보를 가져오는데 실패하였습니다." },
      { status: 500 }
    );
  }
  return NextResponse.json({ USD: usd.rate, date: usd.date });
}
