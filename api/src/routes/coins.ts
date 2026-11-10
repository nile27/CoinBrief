import { Router } from "express";
import { auth, db, FieldValue } from "../firebase.js";
import { requireSession } from "../session.js";

const r = Router();

const MAX_COINS = 4;

r.post("/addcoin", requireSession, async (req, res) => {
  try {
    const { uid, coin } = req.body ?? {};
    if (!uid || !coin?.id) {
      res.status(400).json({ error: "데이터 누락" });
      return;
    }
    if (uid !== res.locals.uid) {
      res.status(403).json({ error: "권한 없음" });
      return;
    }
    const ref = db.collection("users").doc(uid);
    const status = await db.runTransaction(async (tx) => {
      const mycoin: { id: string }[] = (await tx.get(ref)).data()?.mycoin ?? [];
      if (mycoin.some((c) => c.id === coin.id)) return 409;
      if (mycoin.length >= MAX_COINS) return 409;
      tx.update(ref, { mycoin: FieldValue.arrayUnion(coin) });
      return 200;
    });
    if (status === 409) {
      res.status(409).json({ error: "이미 등록되었거나 최대 4개를 초과했습니다." });
      return;
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("코인 추가 실패:", error);
    res.status(500).json({ error: "코인 추가 실패" });
  }
});

// 세션 uid와 요청 uid가 다르면 남의 데이터이므로 403
r.post("/deletecoin", requireSession, async (req, res) => {
  try {
    const { uid, coin } = req.body ?? {};
    if (!uid || !coin) {
      res.status(400).json({ error: "데이터 누락" });
      return;
    }
    if (uid !== res.locals.uid) {
      res.status(403).json({ error: "권한 없음" });
      return;
    }
    await db.collection("users").doc(uid).update({ mycoin: FieldValue.arrayRemove(coin) });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("코인 삭제 실패:", error);
    res.status(500).json({ error: "코인 삭제 실패" });
  }
});

r.delete("/deleteuser", requireSession, async (req, res) => {
  try {
    const uid = req.query.uid as string | undefined;
    if (!uid) {
      res.status(400).json({ error: "유저 정보가 누락되었습니다." });
      return;
    }
    if (uid !== res.locals.uid) {
      res.status(403).json({ error: "권한 없음" });
      return;
    }
    await auth.deleteUser(uid);
    await db.collection("users").doc(uid).delete();
    res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (error) {
    console.error("user Error:", error);
    res.status(500).json({ error: "user delete error" });
  }
});

export default r;
