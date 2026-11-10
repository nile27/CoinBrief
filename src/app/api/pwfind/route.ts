import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { otpMismatch } from "@/lib/otpFail";
import admin from "@/firebase/firebaseAdmin";

const db = admin.firestore();

export async function POST(req: Request) {
  if (req.method === "POST") {
    const body = await req.json();
    const { email, name, otp } = body;

    if (!email || !name || !otp) {
      return NextResponse.json(
        { message: "이메일, 비밀번호, 본인 인증을 입력해주세요." },
        { status: 400 }
      );
    }

    try {
      const user = await db
        .collection("users")
        .where("email", "==", email)
        .where("name", "==", name)
        .get();

      if (user.empty) {
        return NextResponse.json(
          { message: "등록되지 않는 회원입니다." },
          { status: 401 }
        );
      }

      const otpDoc = await db.collection("otps").doc(email).get();

      if (!otpDoc.exists) {
        return new Response(
          JSON.stringify({ message: "OTP가 존재하지 않습니다." }),
          { status: 404 }
        );
      }

      const { otp: storedOtp, expiresAt } = otpDoc.data() as {
        otp: string;
        expiresAt: FirebaseFirestore.Timestamp;
      };

      if (Date.now() > expiresAt.toMillis()) {
        await db.collection("otps").doc(email).delete();
        return new Response(
          JSON.stringify({ message: "OTP가 만료되었습니다." }),
          { status: 400 }
        );
      }

      if (storedOtp !== otp) {
        return otpMismatch(email);
      }

      await db.collection("otps").doc(email).delete();

      const token = randomUUID();
      await db
        .collection("pwreset")
        .doc(email)
        .set({
          token,
          expiresAt: admin.firestore.Timestamp.fromMillis(
            Date.now() + 10 * 60 * 1000
          ),
        });

      const response = NextResponse.json({ message: "OTP 인증 성공!" });
      response.cookies.set("pwreset", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 600,
        path: "/api",
      });
      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return NextResponse.json(
          { message: "서버 에러 발생", error: error.message },
          { status: 500 }
        );
      }
    }
  }
}
