import { cookies } from "next/headers";
import admin from "@/firebase/firebaseAdmin";

export async function sessionCheck() {
  const token = cookies().get("session");

  if (!token) {
    return null;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token.value);
    return {
      isAuthenticated: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
    };
  } catch (error) {
    console.error("Firebase 인증 에러:", error);
    return null;
  }
}
