import type { Request, Response } from "express";
import { cookieOpts, FIVE_DAYS, fail } from "../lib/http.js";
import { readSession } from "../middlewares/session.js";
import * as svc from "../services/auth.js";

const setSessionCookie = async (res: Response, idToken: string) =>
  res.cookie("session", await svc.createSessionCookie(idToken), { ...cookieOpts, maxAge: FIVE_DAYS });

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ message: "이메일, 비밀번호을 입력해주세요." });
    return;
  }
  try {
    const { idToken, body } = await svc.loginWithPassword(email, password);
    await setSessionCookie(res, idToken);
    res.status(200).json(body);
  } catch (e) {
    throw fail(e, (error) => ({ message: "서버 에러 발생", error }));
  }
}

// OAuth: 클라이언트에서 로그인한 ID 토큰을 세션 쿠키로 교환
export async function setSession(req: Request, res: Response) {
  try {
    const { token } = req.body ?? {};
    if (!token) {
      res.status(400).json({ message: "토큰이 제공되지 않았습니다." });
      return;
    }
    await setSessionCookie(res, token);
    res.json({ message: "세션 저장 완료" });
  } catch (e) {
    throw fail(e, (error) => ({ message: "세션 저장 실패", error }));
  }
}

export async function logout(req: Request, res: Response) {
  const s = await readSession(req);
  res.clearCookie("session", cookieOpts);
  if (s) await svc.revokeSession(s.uid);
  res.json({ message: "로그아웃 성공" });
}

export async function me(req: Request, res: Response) {
  const s = await readSession(req);
  if (!s) {
    res.status(401).json({ message: "로그인이 필요합니다." });
    return;
  }
  res.json({ uid: s.uid, email: s.email, displayName: s.name || "" });
}

export async function register(req: Request, res: Response) {
  const { email, password, displayName, name } = req.body ?? {};
  if (!email || !password || !displayName || !name) {
    res.status(400).json({ message: "이메일, 비밀번호, 닉네임을 입력해주세요." });
    return;
  }
  try {
    await svc.register(email, password, displayName, name);
    res.status(200).json({ message: "회원가입 성공!" });
  } catch (e) {
    throw fail(e, (error) => ({ message: "서버 에러 발생", error }));
  }
}

export async function oauthEmail(req: Request, res: Response) {
  try {
    const { accessToken } = req.body ?? {};
    if (!accessToken) {
      res.status(400).json({ error: "카카오 액세스 토큰이 필요합니다." });
      return;
    }
    const { status, body } = await svc.kakaoLogin(accessToken);
    res.status(status).json(body);
  } catch (e) {
    throw fail(e, () => ({ error: "서버 처리 중 오류" }), "서버 처리 중 오류:");
  }
}
