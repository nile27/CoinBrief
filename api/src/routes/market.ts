import { Router } from "express";
import * as c from "../controllers/market.js";

const r = Router();
r.use("/upbit", c.cacheHeader);
r.get("/upbit/coins", c.coins);
r.get("/upbit/detailcoin", c.detailCoin);
r.get("/upbit/kline", c.kline);
r.get("/upbit/popular", c.popular);
r.get("/exchange", c.exchange);

export default r;
