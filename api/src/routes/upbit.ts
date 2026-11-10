import { Router } from "express";
import { env } from "../firebase.js";
import { getPopularCoins } from "../popularCoins.js";
import { getUsdKrw } from "../exchangeRate.js";

const r = Router();

// Vercel CDN 캐시용
const upbitCache = "public, s-maxage=60, stale-while-revalidate=300";
// shortcut: fallback to old NEXT_PUBLIC_ name until .env is renamed, remove after
const upbit = () => env("UPBIT_API_URL");

r.use("/upbit", (_req, res, next) => {
  res.set("Cache-Control", upbitCache);
  next();
});

r.get("/upbit/coins", async (_req, res) => {
  try {
    const nameRes = await fetch(`${upbit()}/market/all?isDetails=false`);
    if (!nameRes.ok) {
      res.set("Cache-Control", "no-store").status(500).json({ error: "업비트 마켓 데이터 가져오기 실패1" });
      return;
    }
    const names: { market: string; korean_name: string; english_name: string }[] = await nameRes.json();
    const priceRes = await fetch(`${upbit()}/ticker/all?quoteCurrencies=KRW`);
    if (!priceRes.ok) {
      res.set("Cache-Control", "no-store").status(500).json({ error: "업비트 가격 데이터 가져오기 실패2" });
      return;
    }
    const prices: { market: string }[] = await priceRes.json();
    const info = new Map(names.map((m) => [m.market, m]));
    res.status(200).json(
      prices.map((p) => {
        const m = info.get(p.market);
        return {
          ...p,
          symbol: p.market.replace("KRW-", ""),
          korean_name: m ? m.korean_name : "알 수 없음",
          english_name: m ? m.english_name : "Unknown",
        };
      })
    );
  } catch (error) {
    console.error("업비트 API 호출 실패:", error);
    res.set("Cache-Control", "no-store").status(500).json({ error: "서버 오류 발생" });
  }
});

r.get("/upbit/detailcoin", async (req, res) => {
  const id = req.query.id as string | undefined;
  if (!id) {
    res.set("Cache-Control", "no-store").status(400).json({ error: "마켓 정보가 필요합니다." });
    return;
  }
  try {
    const up = await fetch(`${upbit()}/ticker?markets=KRW-${encodeURIComponent(id.toUpperCase())}`);
    if (!up.ok) {
      res.set("Cache-Control", "no-store").status(up.status).json({ error: "업비트 API 요청 실패" });
      return;
    }
    res.status(200).json(await up.json());
  } catch (error) {
    console.error("업비트 캔들 데이터 호출 실패:", error);
    res.set("Cache-Control", "no-store").status(500).json({ error: "서버 오류 발생" });
  }
});

r.get("/upbit/kline", async (req, res) => {
  const market = req.query.market as string | undefined;
  const interval = (req.query.interval as string) || "days";
  const count = (req.query.count as string) || "30";
  if (!market) {
    res.set("Cache-Control", "no-store").status(400).json({ error: "마켓 정보가 필요합니다." });
    return;
  }
  try {
    const up = await fetch(
      `${upbit()}/candles/${encodeURIComponent(interval)}?market=${encodeURIComponent(market)}&count=${encodeURIComponent(count)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!up.ok) {
      res.set("Cache-Control", "no-store").status(up.status).json({ error: "업비트 API 요청 실패" });
      return;
    }
    res.status(200).json(await up.json());
  } catch (error) {
    console.error("업비트 캔들 데이터 호출 실패:", error);
    res.set("Cache-Control", "no-store").status(500).json({ error: "서버 오류 발생" });
  }
});

r.get("/upbit/popular", async (_req, res) => {
  const result = await getPopularCoins();
  if (result.fetchedAt === null) res.set("Cache-Control", "no-store");
  res.json(result);
});

r.get("/exchange", async (_req, res) => {
  const usd = await getUsdKrw();
  if (!usd) {
    res.set("Cache-Control", "no-store").status(500).json({ message: "환율 정보를 가져오는데 실패하였습니다." });
    return;
  }
  res.set("Cache-Control", "public, s-maxage=3600").json({ USD: usd.rate, date: usd.date });
});

export default r;
