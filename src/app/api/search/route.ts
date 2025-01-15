import { NextResponse } from "next/server";
import admin from "@/firebase/firebaseAdmin";

const firestore = admin.firestore();

export async function POST(request: Request) {
  const body = await request.json();
  const { query } = body;
  console.log(body);

  if (!query) {
    return NextResponse.json(
      { message: "이메일과 이름을 입력해주세요." },
      { status: 400 }
    );
  }
  try {
    const nameSnapshot = await firestore
      .collection("coins")
      .where("name", ">=", query)
      .where("name", "<=", query + "\uf8ff")
      .limit(10)
      .get();

    const nameResults = nameSnapshot.docs.map((doc) => doc.data());

    const symbolSnapshot = await firestore
      .collection("coins")
      .where("symbol", ">=", query.toLowerCase())
      .where("symbol", "<=", query.toLowerCase() + "\uf8ff")
      .limit(10)
      .get();

    const symbolResults = symbolSnapshot.docs.map((doc) => doc.data());

    const results = Array.from(
      new Map(
        [...nameResults, ...symbolResults].map((item) => [item.id, item])
      ).values()
    );

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching search results:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
}
