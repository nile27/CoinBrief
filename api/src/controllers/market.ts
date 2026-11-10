import type { NextFunction, Request, Response } from "express";
import { HttpError, fail } from "../lib/http.js";
import { getUsdKrw } from "../services/exchangeRate.js";
import * as svc from "../services/market.js";
import { getPopularCoins } from "../services/popularCoins.js";

// Vercel CDN 캐시용. 실패 응답은 app.ts 에러 미들웨어가 no-store로 바꾼다.
export function cacheHeader(_req: Request, res: Response, next: NextFunction) {
  res.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  next();
}

const serverError = () => ({ error: "서버 오류 발생" });

export async function coins(_req: Request, res: Response) {
  try {
    res.status(200).json(await svc.listCoins());
  } catch (e) {
    throw fail(e, serverError, "업비트 API 호출 실패:");
  }
}

export async function detailCoin(req: Request, res: Response) {
  const id = req.query.id as string | undefined;
  if (!id) throw new HttpError(400, { error: "마켓 정보가 필요합니다." });
  try {
    res.status(200).json(await svc.getTicker(id));
  } catch (e) {
    throw fail(e, serverError, "업비트 캔들 데이터 호출 실패:");
  }
}

export async function kline(req: Request, res: Response) {
  const market = req.query.market as string | undefined;
  const interval = (req.query.interval as string) || "days";
  const count = (req.query.count as string) || "30";
  if (!market) throw new HttpError(400, { error: "마켓 정보가 필요합니다." });
  try {
    res.status(200).json(await svc.getCandles(market, interval, count));
  } catch (e) {
    throw fail(e, serverError, "업비트 캔들 데이터 호출 실패:");
  }
}

export async function popular(_req: Request, res: Response) {
  const result = await getPopularCoins();
  if (result.fetchedAt === null) res.set("Cache-Control", "no-store");
  res.json(result);
}

export async function exchange(_req: Request, res: Response) {
  const usd = await getUsdKrw();
  if (!usd) {
    res.set("Cache-Control", "no-store");
    throw new HttpError(500, { message: "환율 정보를 가져오는데 실패하였습니다." });
  }
  res.set("Cache-Control", "public, s-maxage=3600").json({ USD: usd.rate, date: usd.date });
}
