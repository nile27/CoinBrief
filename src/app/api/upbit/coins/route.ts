import { NextResponse } from "next/server";

interface CoinDetails {
  market: string;
  korean_name: string;
  english_name: string;
}

interface TickerData {
  market: string;
  trade_price: number;
  change_rate: number;
  acc_trade_price_24h: number;
}

interface ProcessedCoin extends TickerData {
  symbol: string;
  korean_name: string;
  english_name: string;
}

export async function GET() {
  try {
    const nameResponse = await fetch(
      `${process.env.NEXT_PUBLIC_UPBIT_API_URL}/market/all?isDetails=false`,
      { headers: { "Cache-Control": "no-cache" } }
    );

    if (!nameResponse.ok) {
      return NextResponse.json(
        { error: "업비트 마켓 데이터 가져오기 실패1" },
        { status: 500 }
      );
    }

    const nameData: CoinDetails[] = await nameResponse.json();

    const priceResponse = await fetch(
      `${process.env.NEXT_PUBLIC_UPBIT_API_URL}/ticker/all?quoteCurrencies=KRW`,
      { headers: { "Cache-Control": "no-cache" } }
    );

    if (!priceResponse.ok) {
      return NextResponse.json(
        { error: "업비트 가격 데이터 가져오기 실패2" },
        { status: 500 }
      );
    }

    const priceData: TickerData[] = await priceResponse.json();

    const marketInfoMap = new Map(
      nameData.map((market) => [market.market, market])
    );

    const processedCoin: ProcessedCoin[] = priceData.map((price) => {
      const marketInfo = marketInfoMap.get(price.market);
      const symbol = price.market.replace("KRW-", "");

      return {
        ...price,
        symbol,
        korean_name: marketInfo ? marketInfo.korean_name : "알 수 없음",
        english_name: marketInfo ? marketInfo.english_name : "Unknown",
      };
    });

    return NextResponse.json(processedCoin, { status: 200 });
  } catch (error) {
    console.error("업비트 API 호출 실패:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
