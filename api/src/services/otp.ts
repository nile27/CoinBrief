import { randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { auth, db, FieldValue, Timestamp } from "../lib/firebase.js";
import { HttpError } from "../lib/http.js";

const findUser = (email: string, name: string) =>
  db.collection("users").where("email", "==", email).where("name", "==", name).get();

export async function sendOtp(email: string, name: string, isPwFind: boolean) {
  const users = await findUser(email, name);
  if (isPwFind && users.empty) {
    throw new HttpError(404, { message: "가입 정보를 찾을 수 없습니다. 이름과 이메일을 확인해주세요." });
  }
  if (!isPwFind && !users.empty) throw new HttpError(401, { message: "이미 가입된 회원입니다." });
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
}

// verifyotp / pwfind 공통: OTP 검사 후 일회용으로 삭제. 실패하면 HttpError.
export async function checkOtp(email: string, otp: string) {
  const ref = db.collection("otps").doc(email);
  const doc = await ref.get();
  if (!doc.exists) throw new HttpError(404, { message: "OTP가 존재하지 않습니다." });
  const { otp: stored, expiresAt } = doc.data() as { otp: string; expiresAt: InstanceType<typeof Timestamp> };
  if (Date.now() > expiresAt.toMillis()) {
    await ref.delete();
    throw new HttpError(400, { message: "OTP가 만료되었습니다." });
  }
  if (stored !== otp) {
    // 5회 틀리면 OTP 폐기
    await ref.update({ attempts: FieldValue.increment(1) });
    if (((await ref.get()).data()?.attempts ?? 0) >= 5) {
      await ref.delete();
      throw new HttpError(429, { message: "인증 시도 횟수를 초과했습니다. 인증 번호를 다시 받아주세요." });
    }
    throw new HttpError(400, { message: "OTP가 일치하지 않습니다." });
  }
  await ref.delete();
}

// 가입자 확인 + OTP 검사 후 비밀번호 변경 증명용 일회성 토큰(10분) 발급
export async function issueResetToken(email: string, name: string, otp: string) {
  if ((await findUser(email, name)).empty) throw new HttpError(401, { message: "등록되지 않는 회원입니다." });
  await checkOtp(email, otp);
  const token = randomBytes(32).toString("hex");
  await db.collection("pwreset").doc(email).set({
    token,
    expiresAt: Timestamp.fromMillis(Date.now() + 10 * 60 * 1000),
  });
  return token;
}

export async function consumeResetToken(email: string, cookieToken?: string) {
  const ref = db.collection("pwreset").doc(email);
  const d = (await ref.get()).data() as { token: string; expiresAt: InstanceType<typeof Timestamp> } | undefined;
  if (!d || !cookieToken || d.token !== cookieToken || Date.now() > d.expiresAt.toMillis()) {
    throw new HttpError(403, { message: "본인 인증이 필요합니다." });
  }
  await ref.delete();
}

export async function changePassword(email: string, password: string) {
  const user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { password });
}
