import { HttpError } from "../lib/http.js";

const upbit = () => process.env.UPBIT_API_URL;

export async function listCoins() {
  const nameRes = await fetch(`${upbit()}/market/all?isDetails=false`);
  if (!nameRes.ok) throw new HttpError(500, { error: "업비트 마켓 데이터 가져오기 실패1" });
  const names: { market: string; korean_name: string; english_name: string }[] = await nameRes.json();
  const priceRes = await fetch(`${upbit()}/ticker/all?quoteCurrencies=KRW`);
  if (!priceRes.ok) throw new HttpError(500, { error: "업비트 가격 데이터 가져오기 실패2" });
  const prices: { market: string }[] = await priceRes.json();
  const info = new Map(names.map((m) => [m.market, m]));
  return prices.map((p) => {
    const m = info.get(p.market);
    return {
      ...p,
      symbol: p.market.replace("KRW-", ""),
      korean_name: m ? m.korean_name : "알 수 없음",
      english_name: m ? m.english_name : "Unknown",
    };
  });
}

// 업비트 응답 JSON을 그대로 전달, 실패 시 업비트 status 유지
async function upbitJson(url: string, init?: RequestInit) {
  const up = await fetch(url, init);
  if (!up.ok) throw new HttpError(up.status, { error: "업비트 API 요청 실패" });
  return up.json();
}

export const getTicker = (id: string) =>
  upbitJson(`${upbit()}/ticker?markets=KRW-${encodeURIComponent(id.toUpperCase())}`);

export const getCandles = (market: string, interval: string, count: string) =>
  upbitJson(
    `${upbit()}/candles/${encodeURIComponent(interval)}?market=${encodeURIComponent(market)}&count=${encodeURIComponent(count)}`,
    { headers: { Accept: "application/json" } }
  );
