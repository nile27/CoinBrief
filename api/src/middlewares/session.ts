import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/firebase.js";

export async function readSession(req: Request) {
  const cookie = req.cookies?.session;
  if (!cookie) return null;
  try {
    return await auth.verifySessionCookie(cookie, true);
  } catch {
    return null;
  }
}

export async function requireSession(req: Request, res: Response, next: NextFunction) {
  const s = await readSession(req);
  if (!s) {
    res.status(401).json({ message: "로그인이 필요합니다." });
    return;
  }
  res.locals.uid = s.uid;
  next();
}
