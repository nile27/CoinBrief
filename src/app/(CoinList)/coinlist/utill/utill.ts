import { ProcessedCoin, CoinDetails, TickerData } from "@/type/type";

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
