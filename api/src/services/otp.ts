import { createHash, randomBytes } from "node:crypto";
import nodemailer from "nodemailer";
import { auth, db, FieldValue, Timestamp } from "../lib/firebase.js";
import { HttpError } from "../lib/http.js";

const findUser = (email: string, name: string) =>
  db.collection("users").where("email", "==", email).where("name", "==", name).get();

const HOUR = 60 * 60 * 1000;
const TOO_MANY = { message: "인증 메일 요청이 너무 많습니다. 잠시 후 다시 시도해주세요." };

// 메일 발송 제한 (Firestore, 서버리스라 메모리 상태 없음): 이메일당 60초 1회·시간당 5회, IP당 시간당 20회.
// IP는 해시해서 저장. 발송 전에 호출하며 통과하면 시도를 기록한다.
async function checkRate(email: string, ip: string) {
  const emailRef = db.collection("otpRate").doc(email);
  const ipRef = db.collection("otpRate").doc(`ip_${createHash("sha256").update(ip).digest("hex")}`);
  await db.runTransaction(async (tx) => {
    const now = Date.now();
    const recent = async (ref: typeof emailRef) =>
      ((await tx.get(ref)).data()?.hits as number[] | undefined)?.filter((t) => now - t < HOUR) ?? [];
    const [eh, ih] = [await recent(emailRef), await recent(ipRef)];
    if (eh.length && now - eh[eh.length - 1] < 60_000) {
      throw new HttpError(429, { message: "1분 후 다시 시도해주세요." });
    }
    if (eh.length >= 5 || ih.length >= 20) throw new HttpError(429, TOO_MANY);
    tx.set(emailRef, { hits: [...eh, now] });
    tx.set(ipRef, { hits: [...ih, now] });
  });
}

export async function sendOtp(email: string, name: string, isPwFind: boolean, ip: string) {
  await checkRate(email, ip);
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
// 읽기·비교·증가/삭제를 한 트랜잭션에서 처리해 동시 요청에도 시도 제한 우회·재사용이 불가능하다.
// 실패 응답도 시도 증가/삭제가 커밋돼야 하므로, 트랜잭션 안에서는 throw 하지 않고 결과만 반환한 뒤 밖에서 던진다.
type OtpOutcome = "ok" | "missing" | "expired" | "mismatch" | "locked";
const MAX_ATTEMPTS = 5;

export async function checkOtp(email: string, otp: string) {
  const ref = db.collection("otps").doc(email);
  const outcome = await db.runTransaction(
    async (tx): Promise<OtpOutcome> => {
      const doc = await tx.get(ref);
      if (!doc.exists) return "missing";
      const { otp: stored, expiresAt, attempts = 0 } = doc.data() as {
        otp: string;
        expiresAt: InstanceType<typeof Timestamp>;
        attempts?: number;
      };
      if (Date.now() > expiresAt.toMillis()) {
        tx.delete(ref);
        return "expired";
      }
      if (stored === otp) {
        tx.delete(ref);
        return "ok";
      }
      // 5회 틀리면 OTP 폐기
      if (attempts + 1 >= MAX_ATTEMPTS) {
        tx.delete(ref);
        return "locked";
      }
      tx.update(ref, { attempts: FieldValue.increment(1) });
      return "mismatch";
    },
    { maxAttempts: 30 }, // 같은 문서에 동시 요청이 몰리면 충돌 재시도가 많아진다
  );
  if (outcome === "missing") throw new HttpError(404, { message: "OTP가 존재하지 않습니다." });
  if (outcome === "expired") throw new HttpError(400, { message: "OTP가 만료되었습니다." });
  if (outcome === "locked") {
    throw new HttpError(429, { message: "인증 시도 횟수를 초과했습니다. 인증 번호를 다시 받아주세요." });
  }
  if (outcome === "mismatch") throw new HttpError(400, { message: "OTP가 일치하지 않습니다." });
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

// 회원가입용 이메일 소유 증명 (15분, 일회용). register 가 소비한다.
export async function issueSignupToken(email: string) {
  const token = randomBytes(32).toString("hex");
  await db.collection("signupVerified").doc(email).set({
    token,
    expiresAt: Timestamp.fromMillis(Date.now() + 15 * 60 * 1000),
  });
  return token;
}

export async function consumeSignupToken(email: string, cookieToken?: string) {
  const ref = db.collection("signupVerified").doc(email);
  const d = (await ref.get()).data() as { token: string; expiresAt: InstanceType<typeof Timestamp> } | undefined;
  if (!d || !cookieToken || d.token !== cookieToken || Date.now() > d.expiresAt.toMillis()) {
    throw new HttpError(403, { message: "이메일 인증이 필요합니다." });
  }
  await ref.delete();
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
