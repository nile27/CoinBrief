import { headers } from "next/headers";

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
