import { Link, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthProvider";
import { SessionTimer } from "./SessionTimer";

export function AdminLayout() {
  const { user, expiresAt, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" aria-label="admin home">
              <Logo />
            </Link>
            <span className="hidden rounded-full bg-ink px-2.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-paper sm:inline">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <SessionTimer expiresAt={expiresAt} onExpire={logout} />
            {user && (
              <div className="hidden items-center gap-2.5 md:flex">
                {user.pictureUrl ? (
                  <img
                    src={user.pictureUrl}
                    alt=""
                    className="h-8 w-8 rounded-full border border-ink/10 object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-flame/15 font-display text-sm font-bold text-flame-dark">
                    {(user.name || user.email)[0]?.toUpperCase()}
                  </span>
                )}
                <span className="text-sm font-semibold text-ink">
                  {user.name || user.email}
                </span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
