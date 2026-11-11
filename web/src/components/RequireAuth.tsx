import { Navigate, Outlet } from "react-router";
import { useMe } from "@/lib/queries";
import { useAuthStore } from "@/store/store";

// Next 서버의 sessionCheck() 대체. 세션이 없거나 만료되면 /login 으로 보낸다. (401 시 스토어 정리는 apiFetch)
const RequireAuth = () => {
  const { isPending, isError } = useMe();
  const isLogin = useAuthStore((s) => s.isLogin);
  if (isError) return <Navigate to="/login" replace />;
  // 로그인 상태로 보이면 확인을 기다리지 않고 화면(스켈레톤)부터 그린다. 세션이 없으면 isError 로 /login 이동
  if (isPending && !isLogin) return <div className="min-h-[60vh]" />;
  return <Outlet />;
};

export default RequireAuth;
