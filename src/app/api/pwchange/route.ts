import admin from "@/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { message: "이메일과 이름을 입력해주세요." },
      { status: 400 }
    );
  }

  try {
    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().updateUser(user.uid, { password: password });

    return NextResponse.json({ message: "비밀번호 변경 성공!" });
  } catch (error: unknown) {
    console.error("비밀번호 변경 에러:", error);
    return NextResponse.json(
      {
        message: "비밀번호 변경에 실패했습니다.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
