import type { NextFunction, Request, Response } from "express";
import { auth, env } from "./firebase.js";

const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;

export const cookieOpts = {
  httpOnly: true,
  sameSite: "strict" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export async function setSession(res: Response, idToken: string) {
  const cookie = await auth.createSessionCookie(idToken, { expiresIn: FIVE_DAYS });
  res.cookie("session", cookie, { ...cookieOpts, maxAge: FIVE_DAYS });
}

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

export { env };
