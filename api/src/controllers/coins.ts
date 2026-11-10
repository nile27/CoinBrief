import type { Request, Response } from "express";
import { HttpError, fail } from "../lib/http.js";
import * as svc from "../services/coins.js";

// 세션 uid와 요청 uid가 다르면 남의 데이터이므로 403
function assertOwner(uid: string, res: Response) {
  if (uid !== res.locals.uid) throw new HttpError(403, { error: "권한 없음" });
}

export async function addCoin(req: Request, res: Response) {
  try {
    const { uid, coin } = req.body ?? {};
    if (!uid || !coin?.id) throw new HttpError(400, { error: "데이터 누락" });
    assertOwner(uid, res);
    await svc.addCoin(uid, coin);
    res.status(200).json({ success: true });
  } catch (e) {
    throw fail(e, () => ({ error: "코인 추가 실패" }), "코인 추가 실패:");
  }
}

export async function deleteCoin(req: Request, res: Response) {
  try {
    const { uid, coin } = req.body ?? {};
    if (!uid || !coin) throw new HttpError(400, { error: "데이터 누락" });
    assertOwner(uid, res);
    await svc.deleteCoin(uid, coin);
    res.status(200).json({ success: true });
  } catch (e) {
    throw fail(e, () => ({ error: "코인 삭제 실패" }), "코인 삭제 실패:");
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const uid = req.query.uid as string | undefined;
    if (!uid) throw new HttpError(400, { error: "유저 정보가 누락되었습니다." });
    assertOwner(uid, res);
    await svc.deleteUser(uid);
    res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (e) {
    throw fail(e, () => ({ error: "user delete error" }), "user Error:");
  }
}
