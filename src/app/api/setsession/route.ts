import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import admin from "@/firebase/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { message: "토큰이 제공되지 않았습니다." },
        { status: 400 }
      );
    }

    await admin.auth().verifyIdToken(token);

    const response = NextResponse.json({ message: "세션 저장 완료" });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "세션 저장 실패", error: (error as Error).message },
      { status: 500 }
    );
  }
}
