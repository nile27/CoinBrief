import { NextResponse } from "next/server";
import nodeMailer from "nodemailer";
import admin from "@/firebase/firebaseAdmin";

const db = admin.firestore();

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name } = body;

  const querySnapShot = await db
    .collection("users")
    .where("email", "==", email)
    .where("name", "==", name)
    .get();

  if (querySnapShot.empty) {
    return NextResponse.json(
      { message: "등록되지 않은 회원입니다." },
      { status: 401 }
    );
  }

  if (!email || !name) {
    return NextResponse.json(
      { message: "이메일과 이름을 입력해주세요." },
      { status: 400 }
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = admin.firestore.Timestamp.fromMillis(
    Date.now() + 5 * 60 * 1000
  );

  await db.collection("otps").doc(email).set({
    otp,
    expiresAt,
  });

  const transporter = nodeMailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_APP_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_APP_EMAIL,
      to: email,
      subject: "회원가입 OTP 인증 번호",
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h1 style="color: #4CAF50;">OTP 인증 번호</h1>
        <p>인증 번호는 <strong>${otp}</strong>입니다.</p>
        <p>5분 내로 입력해주세요.</p>
        <footer style="margin-top: 20px; font-size: 0.9em; color: #888;">
          <p>CoinBrief 팀</p>
        </footer>
      </div>`,
    });

    return NextResponse.json(
      { message: "OTP가 전송되었습니다." },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("OTP 전송 실패:", error);
    return NextResponse.json(
      { message: "OTP 전송에 실패했습니다.", error },
      { status: 500 }
    );
  }
}
