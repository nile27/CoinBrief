import { NextResponse } from "next/server";
import admin from "@/firebase/firebaseAdmin";

const db = admin.firestore();

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ message: "이메일과 OTP를 입력해주세요." }),
        { status: 400 }
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
      return new Response(
        JSON.stringify({ message: "OTP가 일치하지 않습니다." }),
        { status: 400 }
      );
    }

    await db.collection("otps").doc(email).delete();
    return new Response(JSON.stringify({ message: "OTP 인증 성공!" }), {
      status: 200,
    });
  } catch (error) {
    console.error("OTP 검증 실패:", error);
    return new Response(
      JSON.stringify({ message: "서버 에러가 발생했습니다.", error }),
      { status: 500 }
    );
  }
}
