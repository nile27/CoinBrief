import { Router } from "express";
import * as c from "../controllers/otp.js";

const r = Router();
r.post("/sendotp", c.sendOtp);
r.post("/verifyotp", c.verifyOtp);
r.post("/pwfind", c.pwFind);
r.post("/pwchange", c.pwChange);

export default r;
