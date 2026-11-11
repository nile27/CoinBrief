// 서버 전용: 업비트 REST로 24h 거래대금 상위 KRW 마켓을 가져온다. (소켓/릴레이 사용 안 함)
export interface PopularCoin {
  market: string;
  symbol: string;
  koreanName: string;
  price: number;
  /** 등락률 (%, 부호 포함) */
  changePercent: number;
}

export interface PopularCoinsResult {
  coins: PopularCoin[];
  /** 데이터를 가져온 시각 (epoch ms). 실패 시 null */
  fetchedAt: number | null;
}

interface MarketInfo {
  market: string;
  korean_name: string;
}
interface Ticker {
  market: string;
  trade_price: number;
  signed_change_rate: number;
  acc_trade_price_24h: number;
}


// 스테이블코인은 "인기 코인"에서 제외
const STABLECOINS = new Set([
  "USDT", "USDC", "USDS", "USDE", "DAI", "TUSD", "FDUSD", "PYUSD",
]);

export async function getPopularCoins(count = 4): Promise<PopularCoinsResult> {
  try {
    const base = process.env.UPBIT_API_URL;
    const [marketRes, tickerRes] = await Promise.all([
      fetch(`${base}/market/all?isDetails=false`),
      fetch(`${base}/ticker/all?quoteCurrencies=KRW`),
    ]);
    if (!marketRes.ok || !tickerRes.ok) throw new Error("upbit response not ok");

    const markets: MarketInfo[] = await marketRes.json();
    const tickers: Ticker[] = await tickerRes.json();
    const names = new Map(markets.map((m) => [m.market, m.korean_name]));

    const coins = tickers
      .filter(
        (t) =>
          t.market.startsWith("KRW-") &&
          !STABLECOINS.has(t.market.replace("KRW-", "").toUpperCase())
      )
      .sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h)
      .slice(0, count)
      .map((t) => ({
        market: t.market,
        symbol: t.market.replace("KRW-", ""),
        koreanName: names.get(t.market) ?? t.market.replace("KRW-", ""),
        price: t.trade_price,
        changePercent: t.signed_change_rate * 100,
      }));

    if (coins.length === 0) throw new Error("empty");
    return { coins, fetchedAt: Date.now() };
  } catch (e) {
    console.error("인기 코인 조회 실패:", e);
    return { coins: [], fetchedAt: null };
  }
}
