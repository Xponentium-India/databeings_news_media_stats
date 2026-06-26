import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

/** Gate for /admin routes — redirects to login when there's no valid session. */
export function RequireAdmin() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-paper">
        <span className="h-8 w-8 animate-spin-slow rounded-full border-2 border-white/20 border-t-flame" />
      </div>
    );
  }

  // a normal (non-admin) visitor may have a session but must not reach the panel
  if (!user?.isAdmin) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
