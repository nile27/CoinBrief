import { headers } from "next/headers";
import { NextResponse } from "next/server";

import admin from "@/firebase/firebaseAdmin";

export async function sessionCheck() {
  const cookieHeader = (await headers()).get("cookie");

  if (!cookieHeader) {
    console.log("세션 없음");
    return null;
  }

  const sessionCookie = cookieHeader
    .split("; ")
    .find((c: string) => c.startsWith("session="));

  if (!sessionCookie) {
    console.log("세션 쿠키 없음");
    return null;
  }

  const token = sessionCookie.split("=")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    return {
      isAuthenticated: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name || "",
    };
  } catch (error) {
    console.error("🔥 Firebase 인증 에러:", error);
    return null;
  }
}

// 세션 필수 + 요청 uid가 세션 uid와 같아야 함. 통과하면 null, 실패하면 에러 응답.
export async function guardUid(uid: string | null | undefined) {
  const session = await sessionCheck();
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  if (session.uid !== uid) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  return null;
}
