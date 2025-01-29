export interface CoinDetails {
  market: string;
  korean_name: string;
  english_name: string;
}

export interface TickerData {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;

  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;

  change: "RISE" | "FALL" | "EVEN";
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;

  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;

  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;

  timestamp: number;
}

export interface ProcessedCoin extends TickerData, CoinDetails {
  symbol: string;
}

export const getCoinData = async (): Promise<ProcessedCoin[]> => {
  const nameResponse = await fetch(
    "https://api.upbit.com/v1/market/all?isDetails=false",
    {
      headers: { "Cache-Control": "no-cache" },
    }
  );
  const nameData: CoinDetails[] = await nameResponse.json();

  const priceResponse = await fetch(
    `https://api.upbit.com/v1/ticker/all?quoteCurrencies=KRW`,
    { headers: { "Cache-Control": "no-cache" } }
  );
  const priceData: TickerData[] = await priceResponse.json();

  const marketInfoMap = new Map(
    nameData.map((market) => [market.market, market])
  );

  const processedCoin = priceData.map((price) => {
    const marketInfo = marketInfoMap.get(price.market);
    const symbol = price.market.replace("KRW-", "");

    return {
      ...price,
      symbol,
      korean_name: marketInfo ? marketInfo.korean_name : "알 수 없음",
      english_name: marketInfo ? marketInfo.english_name : "Unknown",
    };
  });

  return processedCoin;
};
