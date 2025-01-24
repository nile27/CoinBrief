import { NextRequest, NextResponse } from "next/server";
import admin from "@/firebase/firebaseAdmin";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { error: "유저 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const adminAuth = admin.auth();
    const user = await adminAuth.getUser(uid);
    if (!user) {
      return NextResponse.json(
        { error: "유저를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    await adminAuth.deleteUser(uid);

    const adminFirestore = admin.firestore();
    const userDoc = adminFirestore.collection("users").doc(uid);
    await userDoc.delete();

    return NextResponse.json(
      { message: "회원 탈퇴가 완료되었습니다." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("user Error:", error);
    return NextResponse.json({ error: "user delete error" }, { status: 500 });
  }
}
