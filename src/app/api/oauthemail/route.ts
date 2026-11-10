import admin from "@/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json(
        { error: "카카오 토큰이 필요합니다." },
        { status: 400 }
      );
    }

    // 클라이언트가 보낸 이메일은 믿지 않고, 카카오 서버에서 직접 확인한다.
    const kakaoRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!kakaoRes.ok) {
      return NextResponse.json(
        { error: "유효하지 않은 카카오 토큰입니다." },
        { status: 401 }
      );
    }
    const kakaoUser = await kakaoRes.json();
    const email = kakaoUser?.kakao_account?.email;
    const displayName = kakaoUser?.properties?.nickname;
    const name = displayName;

    if (
      !email ||
      !displayName ||
      kakaoUser.kakao_account.is_email_verified === false
    ) {
      return NextResponse.json(
        { error: "카카오 계정의 인증된 이메일/닉네임이 필요합니다." },
        { status: 401 }
      );
    }

    const adminAuth = admin.auth();
    const db = admin.firestore();

    try {
      const userRecord = await adminAuth.getUserByEmail(email);

      const userDoc = await db.collection("users").doc(userRecord.uid).get();
      const userData = userDoc.exists ? userDoc.data() : null;

      if (!userData) {
        return NextResponse.json(
          { error: "Firestore 데이터가 없습니다." },
          { status: 404 }
        );
      }

      const customToken = await adminAuth.createCustomToken(userRecord.uid);

      return NextResponse.json(
        { message: "User exists", customToken, user: userData },
        { status: 200 }
      );
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        const newUser = await adminAuth.createUser({
          email,
          displayName,
        });

        const newUserData = {
          name,
          email,
          displayName,
          mycoin: [],
        };

        await db.collection("users").doc(newUser.uid).set(newUserData);

        const customToken = await adminAuth.createCustomToken(newUser.uid);

        return NextResponse.json(
          {
            message: "가입 완료",
            customToken,
            user: newUserData,
          },
          { status: 201 }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error("서버 처리 중 오류:", error);
    return NextResponse.json({ error: "서버 처리 중 오류" }, { status: 500 });
  }
}
