import { NextResponse } from "next/server";
import { firestore } from "@/firebase/firebase";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { uid, coin } = await request.json();

    if (!uid || !coin) {
      return NextResponse.json({ error: "데이터 누락" }, { status: 400 });
    }

    const userDoc = doc(firestore, "users", uid);

    await updateDoc(userDoc, {
      mycoin: arrayRemove(coin),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("코인 삭제 실패:", error);
    return NextResponse.json({ error: "코인 삭제 실패" }, { status: 500 });
  }
}
