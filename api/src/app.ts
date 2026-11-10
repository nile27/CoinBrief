import express from "express";
import type { ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import otpRoutes from "./routes/otp.js";
import coinRoutes from "./routes/coins.js";
import marketRoutes from "./routes/market.js";
import { HttpError } from "./lib/http.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api", authRoutes, otpRoutes, coinRoutes, marketRoutes);

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  // body-parser 등 4xx 에러와 이미 시작된 응답은 Express 기본 처리에 맡긴다
  if (res.headersSent || (!(err instanceof HttpError) && err.status < 500)) return next(err);
  // 캐시 헤더가 준비된 라우트(upbit)의 실패 응답은 캐시하지 않는다
  if (res.getHeader("Cache-Control")) res.set("Cache-Control", "no-store");
  if (err instanceof HttpError) res.status(err.status).json(err.body);
  else res.status(500).json({ message: "서버 에러 발생" });
};
app.use(errorHandler);

export default app;
