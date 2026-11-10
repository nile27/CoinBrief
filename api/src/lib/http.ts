// 서비스가 던지는 "예상된 실패". 최종 에러 미들웨어가 status+body 그대로 응답한다.
export class HttpError extends Error {
  constructor(public status: number, public body: object) {
    super();
  }
}

export const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;

export const cookieOpts = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

// 컨트롤러 catch용: HttpError는 그대로, 그 외는 라우트별 500 본문으로 변환 (log가 있으면 기록)
export function fail(e: unknown, body: (message: string) => object, log?: string) {
  if (e instanceof HttpError) return e;
  if (log) console.error(log, e);
  return new HttpError(500, body((e as Error).message));
}
