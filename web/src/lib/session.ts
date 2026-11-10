import type { QueryClient } from "@tanstack/react-query";
import { useAuthStore, useUserStore, type Iuser } from "@/store/store";

// 로그인 성공 공통 처리: zustand 스토어 설정 + ['me'] 캐시 채우기 (RequireAuth 가 바로 통과)
export function finishLogin(qc: QueryClient, user: Iuser) {
  useAuthStore.getState().login();
  useUserStore.getState().setUser(user);
  qc.setQueryData(["me"], { uid: user.id, email: user.email, displayName: user.displayName });
}
