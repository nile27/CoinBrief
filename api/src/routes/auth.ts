import { Router } from "express";
import { randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { auth, db, env, FieldValue, Timestamp } from "../firebase.js";
import { cookieOpts, readSession, setSession } from "../session.js";

const r = Router();

// 이메일/비밀번호 로그인: 클라이언트 SDK 대신 REST (상태 공유 없음) 후 세션 쿠키 발급
r.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ message: "이메일, 비밀번호을 입력해주세요." });
    return;
  }
  try {
    const key = env("FIREBASE_API_KEY");
    const signIn = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    const result = await signIn.json();
    if (!signIn.ok) {
      res.status(401).json({
        message: "서버 에러 발생",
        error: `Firebase: ${result?.error?.message ?? "auth error"}`,
      });
      return;
    }
    const uid: string = result.localId;
    const docSnap = await db.collection("users").doc(uid).get();
    if (!docSnap.exists) {
      res.status(404).json({ message: "사용자 데이터가 존재하지 않습니다." });
      return;
    }
    const userData = docSnap.data()!;
    await setSession(res, result.idToken);
    res.status(200).json({
      message: "로그인 성공!",
      data: {
        id: uid,
        name: userData.name,
        email: result.email,
        nickname: userData.displayName,
        mycoin: userData.mycoin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "서버 에러 발생", error: (error as Error).message });
  }
});

// OAuth: 클라이언트에서 로그인한 ID 토큰을 세션 쿠키로 교환
r.post("/setsession", async (req, res) => {
  try {
    const { token } = req.body ?? {};
    if (!token) {
      res.status(400).json({ message: "토큰이 제공되지 않았습니다." });
      return;
    }
    await setSession(res, token);
    res.json({ message: "세션 저장 완료" });
  } catch (error) {
    res.status(500).json({ message: "세션 저장 실패", error: (error as Error).message });
  }
});

r.post("/logout", async (req, res) => {
  const s = await readSession(req);
  res.clearCookie("session", cookieOpts);
  if (s) await auth.revokeRefreshTokens(s.uid).catch(() => {});
  res.json({ message: "로그아웃 성공" });
});

r.get("/me", async (req, res) => {
  const s = await readSession(req);
  if (!s) {
    res.status(401).json({ message: "로그인이 필요합니다." });
    return;
  }
  res.json({ uid: s.uid, email: s.email, displayName: s.name || "" });
});

r.post("/register", async (req, res) => {
  const { email, password, displayName, name } = req.body ?? {};
  if (!email || !password || !displayName || !name) {
    res.status(400).json({ message: "이메일, 비밀번호, 닉네임을 입력해주세요." });
    return;
  }
  try {
    const user = await auth.createUser({ email, password, displayName });
    await db.collection("users").doc(user.uid).set({ email, displayName, name, mycoin: [] });
    res.status(200).json({ message: "회원가입 성공!" });
  } catch (error) {
    res.status(500).json({ message: "서버 에러 발생", error: (error as Error).message });
  }
});

r.post("/sendotp", async (req, res) => {
  const { email, name, purpose = "signup" } = req.body ?? {};
  if (!email || !name) {
    res.status(400).json({ message: "이메일과 이름을 입력해주세요." });
    return;
  }
  const isPwFind = purpose === "pwfind";
  try {
    const users = await db.collection("users").where("email", "==", email).where("name", "==", name).get();
    if (isPwFind && users.empty) {
      res.status(404).json({ message: "가입 정보를 찾을 수 없습니다. 이름과 이메일을 확인해주세요." });
      return;
    }
    if (!isPwFind && !users.empty) {
      res.status(401).json({ message: "이미 가입된 회원입니다." });
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.collection("otps").doc(email).set({
      otp,
      expiresAt: Timestamp.fromMillis(Date.now() + 5 * 60 * 1000),
    });
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.GMAIL_APP_EMAIL, pass: process.env.GMAIL_APP_PASSWORD },
    });
    const title = isPwFind ? "비밀번호 재설정 인증 번호" : "회원가입 인증 번호";
    await transporter.sendMail({
      from: process.env.GMAIL_APP_EMAIL,
      to: email,
      subject: title,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h1 style="color: #4CAF50;">${title}</h1>
        <p>인증 번호는 <strong>${otp}</strong>입니다.</p>
        <p>5분 내로 입력해주세요.</p>
        <footer style="margin-top: 20px; font-size: 0.9em; color: #888;">
          <p>CoinBrief 팀</p>
        </footer>
      </div>`,
    });
    res.status(200).json({ message: "OTP가 전송되었습니다." });
  } catch (error) {
    console.error("OTP 전송 실패:", error);
    res.status(500).json({ message: "OTP 전송에 실패했습니다.", error: (error as Error).message });
  }
});

// verifyotp / pwfind 공통: OTP 검사 후 일회용으로 삭제. 실패 시 응답을 보내고 false.
async function checkOtp(email: string, otp: string, res: import("express").Response) {
  const ref = db.collection("otps").doc(email);
  const doc = await ref.get();
  if (!doc.exists) {
    res.status(404).json({ message: "OTP가 존재하지 않습니다." });
    return false;
  }
  const { otp: stored, expiresAt } = doc.data() as { otp: string; expiresAt: InstanceType<typeof Timestamp> };
  if (Date.now() > expiresAt.toMillis()) {
    await ref.delete();
    res.status(400).json({ message: "OTP가 만료되었습니다." });
    return false;
  }
  if (stored !== otp) {
    // 5회 틀리면 OTP 폐기
    await ref.update({ attempts: FieldValue.increment(1) });
    if (((await ref.get()).data()?.attempts ?? 0) >= 5) {
      await ref.delete();
      res.status(429).json({ message: "인증 시도 횟수를 초과했습니다. 인증 번호를 다시 받아주세요." });
    } else {
      res.status(400).json({ message: "OTP가 일치하지 않습니다." });
    }
    return false;
  }
  await ref.delete();
  return true;
}

r.post("/verifyotp", async (req, res) => {
  try {
    const { email, otp } = req.body ?? {};
    if (!email || !otp) {
      res.status(400).json({ message: "이메일과 OTP를 입력해주세요." });
      return;
    }
    if (await checkOtp(email, otp, res)) res.status(200).json({ message: "OTP 인증 성공!" });
  } catch (error) {
    console.error("OTP 검증 실패:", error);
    res.status(500).json({ message: "서버 에러가 발생했습니다.", error: (error as Error).message });
  }
});

r.post("/pwfind", async (req, res) => {
  const { email, name, otp } = req.body ?? {};
  if (!email || !name || !otp) {
    res.status(400).json({ message: "이메일, 비밀번호, 본인 인증을 입력해주세요." });
    return;
  }
  try {
    const user = await db.collection("users").where("email", "==", email).where("name", "==", name).get();
    if (user.empty) {
      res.status(401).json({ message: "등록되지 않는 회원입니다." });
      return;
    }
    if (await checkOtp(email, otp, res)) {
      // 비밀번호 변경 증명용 일회성 토큰 (10분)
      const token = randomBytes(32).toString("hex");
      await db.collection("pwreset").doc(email).set({
        token,
        expiresAt: Timestamp.fromMillis(Date.now() + 10 * 60 * 1000),
      });
      res.cookie("pwreset", token, { ...cookieOpts, path: "/api", maxAge: 10 * 60 * 1000 });
      res.status(200).json({ message: "OTP 인증 성공!" });
    }
  } catch (error) {
    res.status(500).json({ message: "서버 에러 발생", error: (error as Error).message });
  }
});

r.post("/pwchange", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ message: "이메일과 이름을 입력해주세요." });
    return;
  }
  try {
    const ref = db.collection("pwreset").doc(email);
    const doc = await ref.get();
    const d = doc.data() as { token: string; expiresAt: InstanceType<typeof Timestamp> } | undefined;
    if (!d || !req.cookies?.pwreset || d.token !== req.cookies.pwreset || Date.now() > d.expiresAt.toMillis()) {
      res.status(403).json({ message: "본인 인증이 필요합니다." });
      return;
    }
    await ref.delete();
    res.clearCookie("pwreset", { ...cookieOpts, path: "/api" });
    const user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, { password });
    res.json({ message: "비밀번호 변경 성공!" });
  } catch (error) {
    console.error("비밀번호 변경 에러:", error);
    res.status(500).json({ message: "비밀번호 변경에 실패했습니다.", error: (error as Error).message });
  }
});

// Kakao: 클라이언트가 보낸 이메일을 믿지 않고 액세스 토큰으로 서버가 직접 프로필 조회
r.post("/oauthemail", async (req, res) => {
  try {
    const { accessToken } = req.body ?? {};
    if (!accessToken) {
      res.status(400).json({ error: "카카오 액세스 토큰이 필요합니다." });
      return;
    }
    const kakao = await fetch(process.env.KAKAO_KAPI_URL ?? "https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!kakao.ok) {
      res.status(401).json({ error: "카카오 인증 실패" });
      return;
    }
    const profile = await kakao.json();
    const account = profile.kakao_account ?? {};
    const email: string | undefined = account.email;
    const displayName: string | undefined = profile.properties?.nickname;
    if (!email || !displayName || account.is_email_verified === false) {
      res.status(401).json({ error: "카카오 계정의 인증된 이메일/닉네임이 필요합니다." });
      return;
    }
    const name = displayName;
    try {
      const userRecord = await auth.getUserByEmail(email);
      const userDoc = await db.collection("users").doc(userRecord.uid).get();
      const userData = userDoc.exists ? userDoc.data() : null;
      if (!userData) {
        res.status(404).json({ error: "Firestore 데이터가 없습니다." });
        return;
      }
      const customToken = await auth.createCustomToken(userRecord.uid);
      res.status(200).json({ message: "User exists", customToken, user: userData });
    } catch (error: any) {
      if (error.code !== "auth/user-not-found") throw error;
      const newUser = await auth.createUser({ email, displayName });
      const newUserData = { name, email, displayName, mycoin: [] };
      await db.collection("users").doc(newUser.uid).set(newUserData);
      const customToken = await auth.createCustomToken(newUser.uid);
      res.status(201).json({ message: "가입 완료", customToken, user: newUserData });
    }
  } catch (error) {
    console.error("서버 처리 중 오류:", error);
    res.status(500).json({ error: "서버 처리 중 오류" });
  }
});

export default r;
