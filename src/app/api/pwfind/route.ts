import { NextResponse } from "next/server";
import admin from "@/firebase/firebaseAdmin";

const db = admin.firestore();

export async function POST(req: Request) {
  if (req.method === "POST") {
    const body = await req.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { message: "이메일, 비밀번호, 닉네임을 입력해주세요." },
        { status: 400 }
      );
    }

    try {
      const user = await admin.auth().getUserByEmail(email);
      // await db.collection("users").doc(user.uid).set({
      //   email,
      //   displayName,
      //   mycoin: [],
      // });

      //return NextResponse.json({ message: "회원가입 성공!" }, { status: 200 });
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
