import { auth, db, FieldValue } from "../lib/firebase.js";
import { HttpError } from "../lib/http.js";

const MAX_COINS = 4;

export async function addCoin(uid: string, coin: { id: string }) {
  const ref = db.collection("users").doc(uid);
  const added = await db.runTransaction(async (tx) => {
    const mycoin: { id: string }[] = (await tx.get(ref)).data()?.mycoin ?? [];
    if (mycoin.some((c) => c.id === coin.id) || mycoin.length >= MAX_COINS) return false;
    tx.update(ref, { mycoin: FieldValue.arrayUnion(coin) });
    return true;
  });
  if (!added) throw new HttpError(409, { error: "이미 등록되었거나 최대 4개를 초과했습니다." });
}

export const deleteCoin = (uid: string, coin: unknown) =>
  db.collection("users").doc(uid).update({ mycoin: FieldValue.arrayRemove(coin) });

export async function deleteUser(uid: string) {
  await auth.deleteUser(uid);
  await db.collection("users").doc(uid).delete();
}
