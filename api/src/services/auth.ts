import { auth, db, env } from "../lib/firebase.js";
import { FIVE_DAYS, HttpError } from "../lib/http.js";

export const createSessionCookie = (idToken: string) => auth.createSessionCookie(idToken, { expiresIn: FIVE_DAYS });

export const revokeSession = (uid: string) => auth.revokeRefreshTokens(uid).catch(() => {});

// 클라이언트 SDK 대신 REST (상태 공유 없음)
export async function loginWithPassword(email: string, password: string) {
  const key = env("FIREBASE_API_KEY");
  const signIn = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );
  const result = await signIn.json();
  if (!signIn.ok) {
    throw new HttpError(401, {
      message: "서버 에러 발생",
      error: `Firebase: ${result?.error?.message ?? "auth error"}`,
    });
  }
  const uid: string = result.localId;
  const docSnap = await db.collection("users").doc(uid).get();
  if (!docSnap.exists) throw new HttpError(404, { message: "사용자 데이터가 존재하지 않습니다." });
  const userData = docSnap.data()!;
  return {
    idToken: result.idToken as string,
    body: {
      message: "로그인 성공!",
      data: {
        id: uid,
        name: userData.name,
        email: result.email,
        nickname: userData.displayName,
        mycoin: userData.mycoin,
      },
    },
  };
}

export async function register(email: string, password: string, displayName: string, name: string) {
  const user = await auth.createUser({ email, password, displayName });
  await db.collection("users").doc(user.uid).set({ email, displayName, name, mycoin: [] });
}

// Kakao: 클라이언트가 보낸 이메일을 믿지 않고 액세스 토큰으로 서버가 직접 프로필 조회
export async function kakaoLogin(accessToken: string) {
  const kakao = await fetch(process.env.KAKAO_KAPI_URL ?? "https://kapi.kakao.com/v2/user/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!kakao.ok) throw new HttpError(401, { error: "카카오 인증 실패" });
  const profile = await kakao.json();
  const account = profile.kakao_account ?? {};
  const email: string | undefined = account.email;
  const displayName: string | undefined = profile.properties?.nickname;
  if (!email || !displayName || account.is_email_verified === false) {
    throw new HttpError(401, { error: "카카오 계정의 인증된 이메일/닉네임이 필요합니다." });
  }
  try {
    const userRecord = await auth.getUserByEmail(email);
    const userDoc = await db.collection("users").doc(userRecord.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;
    if (!userData) throw new HttpError(404, { error: "Firestore 데이터가 없습니다." });
    const customToken = await auth.createCustomToken(userRecord.uid);
    return { status: 200, body: { message: "User exists", customToken, user: userData } };
  } catch (error: any) {
    if (error.code !== "auth/user-not-found") throw error;
    const newUser = await auth.createUser({ email, displayName });
    const newUserData = { name: displayName, email, displayName, mycoin: [] };
    await db.collection("users").doc(newUser.uid).set(newUserData);
    const customToken = await auth.createCustomToken(newUser.uid);
    return { status: 201, body: { message: "가입 완료", customToken, user: newUserData } };
  }
}
