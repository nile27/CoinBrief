import { Router } from "express";
import * as c from "../controllers/coins.js";
import { requireSession } from "../middlewares/session.js";

const r = Router();
r.post("/addcoin", requireSession, c.addCoin);
r.post("/deletecoin", requireSession, c.deleteCoin);
r.delete("/deleteuser", requireSession, c.deleteUser);

export default r;
