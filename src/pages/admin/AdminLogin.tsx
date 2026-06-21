import { useCallback, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/components/admin/GoogleSignInButton";
import { useAuth } from "@/auth/AuthProvider";
import { api } from "@/lib/api";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as
  | string
  | undefined;

export default function AdminLogin() {
  const { user, loading, setSession } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [devEmail, setDevEmail] = useState("");

  const handleGoogle = useCallback(
    async (credential: string) => {
      setBusy(true);
      setError(null);
      try {
        const { user, expiresAt } = await api.googleLogin(credential);
        setSession(user, expiresAt);
        navigate("/admin", { replace: true });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sign-in failed");
      } finally {
        setBusy(false);
      }
    },
    [navigate, setSession]
  );

  const handleDevLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      const { user, expiresAt } = await api.devLogin(devEmail.trim());
      setSession(user, expiresAt);
      navigate("/admin", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dev login failed");
    } finally {
      setBusy(false);
    }
  };

  if (!loading && user) return <Navigate to="/admin" replace />;

  return (
    <main className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6 text-paper">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #F2C94C 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-flame/20 blur-[120px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo light />
          <p className="mt-6 inline-flex items-center gap-2 font-mono text-[0.65rem] font-bold uppercase tracking-ticker text-amber">
            <Lock className="h-3.5 w-3.5" /> Admin access
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
            Sign in to continue
          </h1>
          <p className="mt-2 text-sm text-paper/60">
            Authorized Google accounts only. Sessions last 40 minutes.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-lift backdrop-blur-sm">
          {error && (
            <p className="mb-5 rounded-lg border border-flame/40 bg-flame/10 px-4 py-3 text-sm text-flame-soft">
              {error}
            </p>
          )}

          {GOOGLE_CLIENT_ID ? (
            <div className="flex justify-center">
              <GoogleSignInButton
                clientId={GOOGLE_CLIENT_ID}
                onCredential={handleGoogle}
              />
            </div>
          ) : (
            <p className="rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-center text-xs text-amber">
              Set <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> to
              enable Google sign-in.
            </p>
          )}

          {import.meta.env.DEV && (
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-wider text-paper/40">
                Dev login (local only)
              </p>
              <div className="flex items-center gap-2">
                <Input
                  value={devEmail}
                  onChange={(e) => setDevEmail(e.target.value)}
                  placeholder="admin email"
                  className="h-11 flex-1 border-white/20 text-paper placeholder:text-paper/30"
                />
                <Button
                  type="button"
                  variant="light"
                  size="sm"
                  disabled={busy}
                  onClick={handleDevLogin}
                >
                  Enter
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-center font-mono text-[0.65rem] uppercase tracking-wider text-paper/40">
          <ShieldCheck className="h-3.5 w-3.5" /> Protected area · databeings
        </p>
      </div>
    </main>
  );
}
