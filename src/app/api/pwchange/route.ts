import admin from "@/firebase/firebaseAdmin";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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
    const token = (await cookies()).get("pwreset")?.value;
    const ref = admin.firestore().collection("pwreset").doc(email);
    const snap = token ? await ref.get() : null;
    const data = snap?.data() as
      | { token: string; expiresAt: FirebaseFirestore.Timestamp }
      | undefined;

    if (!data || data.token !== token || Date.now() > data.expiresAt.toMillis()) {
      return NextResponse.json(
        { message: "본인 인증이 필요합니다." },
        { status: 403 }
      );
    }
    await ref.delete();

    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().updateUser(user.uid, { password: password });

    const response = NextResponse.json({ message: "비밀번호 변경 성공!" });
    response.cookies.set("pwreset", "", { path: "/api", maxAge: 0 });
    return response;
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
