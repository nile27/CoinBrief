import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth, firestore } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "이메일, 비밀번호을 입력해주세요." },
        { status: 400 }
      );
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const token = await user.getIdToken();

        const response = NextResponse.json(
          {
            message: "로그인 성공!",
            data: {
              id: user.uid,
              name: userData.name,
              email: user.email,
              nickname: userData.displayName,
              mycoin: userData.mycoin,
            },
          },
          { status: 200 }
        );
        response.cookies.set("session", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 3600,
          path: "/",
        });

        return response;
      } else {
        return NextResponse.json(
          { message: "사용자 데이터가 존재하지 않습니다." },
          { status: 404 }
        );
      }
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
