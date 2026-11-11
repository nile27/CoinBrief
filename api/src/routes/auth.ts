import { Router } from "express";
import * as c from "../controllers/auth.js";

const r = Router();
r.post("/login", c.login);
r.post("/setsession", c.setSession);
r.post("/logout", c.logout);
r.get("/me", c.me);
r.post("/register", c.register);
r.post("/oauthemail", c.oauthEmail);

export default r;
