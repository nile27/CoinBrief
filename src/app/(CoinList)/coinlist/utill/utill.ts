export interface CoinDetails {
  market: string;
  korean_name: string;
  english_name: string;
}

export interface ProcessedCoin {
  symbol: string;
  korean_name: string;
  closing_price: string;
  fluctate_rate_24H: string;
  max_price: string;
  min_price: string;
  acc_trade_value_24H: string;
}

let cachedData: ProcessedCoin[] | null = null;

export const getCoinData = async (): Promise<ProcessedCoin[]> => {
  if (cachedData) {
    return cachedData;
  }

  const nameResponse = await fetch(
    "https://api.bithumb.com/v1/market/all?isDetails=false"
  );
  const nameData = await nameResponse.json();

  const priceResponse = await fetch(
    "https://api.bithumb.com/public/ticker/ALL_KRW"
  );
  const priceData = await priceResponse.json();

  const processedData: ProcessedCoin[] = [];

  for (const details of nameData) {
    const market = details.market;
    if (market.startsWith("KRW-")) {
      const symbol = market.substring(4);
      const priceInfo = priceData.data[symbol];

      if (priceInfo) {
        processedData.push({
          symbol,
          korean_name: details.korean_name,
          closing_price: priceInfo.closing_price,
          fluctate_rate_24H: priceInfo.fluctate_rate_24H,
          max_price: priceInfo.max_price,
          min_price: priceInfo.min_price,
          acc_trade_value_24H: priceInfo.acc_trade_value_24H,
        });
      }
    }
  }

  cachedData = processedData;
  return processedData;
};

export function formatKRW(value: number): string {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(2)}조`;
  } else if (value >= 1e8) {
    return `${(value / 1e8).toFixed(2)}억`;
  } else if (value >= 1e4) {
    return `${(value / 1e4).toFixed(2)}만`;
  }
  return `${value.toLocaleString()}`;
}
