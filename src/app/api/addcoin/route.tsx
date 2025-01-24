import { NextResponse } from "next/server";
import { firestore } from "@/firebase/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const { uid, coin } = await request.json();

    if (!uid || !coin) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const userDoc = doc(firestore, "users", uid);

    await updateDoc(userDoc, {
      mycoin: arrayUnion(coin),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error adding coin:", error);
    return NextResponse.json({ error: "Failed to add coin" }, { status: 500 });
  }
}
