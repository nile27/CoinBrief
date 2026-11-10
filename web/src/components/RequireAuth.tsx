import { Navigate, Outlet } from "react-router";
import { useMe } from "@/lib/queries";

// Next 서버의 sessionCheck() 대체. 세션이 없거나 만료되면 /login 으로 보낸다. (401 시 스토어 정리는 apiFetch)
const RequireAuth = () => {
  const { isPending, isError } = useMe();
  if (isError) return <Navigate to="/login" replace />;
  if (isPending) return <div className="min-h-[60vh]" />;
  return <Outlet />;
};

export default RequireAuth;
