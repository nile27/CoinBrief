import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useAuthStore, useUserStore, type Iuser } from "@/store/store";

// 로그인 성공 공통 처리: zustand 스토어 설정 + ['me'] 캐시 채우기 (RequireAuth 가 바로 통과)
export function finishLogin(qc: ReturnType<typeof useQueryClient>, user: Iuser) {
  useAuthStore.getState().login();
  useUserStore.getState().setUser(user);
  qc.setQueryData(["me"], { uid: user.id, email: user.email, displayName: user.displayName });
}

export function useLogout() {
  const qc = useQueryClient();
  const navi = useNavigate();
  return async () => {
    await apiFetch("/api/logout", { method: "POST" }).catch(() => {}); // 서버 실패여도 클라이언트는 로그아웃
    useAuthStore.getState().logout();
    useUserStore.getState().deleteUser();
    qc.clear();
    navi("/");
    // Firebase 는 로그아웃 시점에만 불러온다
    Promise.all([import("firebase/auth"), import("@/firebase/firebase")]).then(([{ signOut }, { auth }]) => signOut(auth));
  };
}
