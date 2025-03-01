import admin from "@/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, name, displayName } = await request.json();

    if (!email || !name || !displayName) {
      return NextResponse.json(
        { error: "이메일, 이름, 닉네임을 확인해주세요." },
        { status: 400 }
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
