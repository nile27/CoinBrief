import type { Request, Response } from "express";
import { cookieOpts, fail } from "../lib/http.js";
import * as svc from "../services/otp.js";

export async function sendOtp(req: Request, res: Response) {
  const { email, name, purpose = "signup" } = req.body ?? {};
  if (!email || !name) {
    res.status(400).json({ message: "이메일과 이름을 입력해주세요." });
    return;
  }
  try {
    const ip = String(req.headers["x-forwarded-for"] ?? "").split(",")[0].trim() || req.ip || "unknown";
    await svc.sendOtp(email, name, purpose === "pwfind", ip);
    res.status(200).json({ message: "OTP가 전송되었습니다." });
  } catch (e) {
    throw fail(e, (error) => ({ message: "OTP 전송에 실패했습니다.", error }), "OTP 전송 실패:");
  }
}

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body ?? {};
    if (!email || !otp) {
      res.status(400).json({ message: "이메일과 OTP를 입력해주세요." });
      return;
    }
    await svc.checkOtp(email, otp);
    const token = await svc.issueSignupToken(email);
    res.cookie("signupok", token, { ...cookieOpts, path: "/api", maxAge: 15 * 60 * 1000 });
    res.status(200).json({ message: "OTP 인증 성공!" });
  } catch (e) {
    throw fail(e, (error) => ({ message: "서버 에러가 발생했습니다.", error }), "OTP 검증 실패:");
  }
}

export async function pwFind(req: Request, res: Response) {
  const { email, name, otp } = req.body ?? {};
  if (!email || !name || !otp) {
    res.status(400).json({ message: "이메일, 비밀번호, 본인 인증을 입력해주세요." });
    return;
  }
  try {
    const token = await svc.issueResetToken(email, name, otp);
    res.cookie("pwreset", token, { ...cookieOpts, path: "/api", maxAge: 10 * 60 * 1000 });
    res.status(200).json({ message: "OTP 인증 성공!" });
  } catch (e) {
    throw fail(e, (error) => ({ message: "서버 에러 발생", error }));
  }
}

export async function pwChange(req: Request, res: Response) {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ message: "이메일과 이름을 입력해주세요." });
    return;
  }
  try {
    await svc.consumeResetToken(email, req.cookies?.pwreset);
    res.clearCookie("pwreset", { ...cookieOpts, path: "/api" });
    await svc.changePassword(email, password);
    res.json({ message: "비밀번호 변경 성공!" });
  } catch (e) {
    throw fail(e, (error) => ({ message: "비밀번호 변경에 실패했습니다.", error }), "비밀번호 변경 에러:");
  }
}
