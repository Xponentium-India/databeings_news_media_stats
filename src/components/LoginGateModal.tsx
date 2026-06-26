import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/components/admin/GoogleSignInButton";
import { useAuth } from "@/auth/AuthProvider";
import { api } from "@/lib/api";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as
  | string
  | undefined;

/** Public pages that require a login the moment a logged-out visitor opens them. */
const GATED_PREFIXES = ["/news-media-stats"];

/**
 * Site-wide login gate. For a logged-out visitor it pops a modal that CANNOT be
 * dismissed (no close button, no backdrop click, no ESC) until they sign in:
 *   • 5 seconds after landing on any public page, and
 *   • immediately when they open a gated page (e.g. News & Stats).
 * Session length (30 min for visitors) is tracked entirely in the backend — there
 * is no countdown shown here. When the session expires the gate simply returns.
 */
export function LoginGateModal() {
  const { user, loading, setSession } = useAuth();
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [devEmail, setDevEmail] = useState("");

  const gated = GATED_PREFIXES.some((p) => pathname.startsWith(p));

  // Decide when to open the gate. Closed while loading or already signed in.
  useEffect(() => {
    if (loading || user) {
      setShow(false);
      return;
    }
    if (gated) {
      setShow(true); // no grace period on gated pages
      return;
    }
    const t = setTimeout(() => setShow(true), 5000);
    return () => clearTimeout(t);
  }, [loading, user, gated]);

  // While open: lock body scroll and swallow ESC so the modal can't be closed.
  useEffect(() => {
    if (!show) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const blockEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", blockEsc, true);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", blockEsc, true);
    };
  }, [show]);

  const handleGoogle = useCallback(
    async (credential: string) => {
      setBusy(true);
      setError(null);
      try {
        const { user, expiresAt } = await api.googleLogin(credential);
        setSession(user, expiresAt); // closes the gate via the effect above
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sign-in failed");
      } finally {
        setBusy(false);
      }
    },
    [setSession]
  );

  const handleDevLogin = async () => {
    setBusy(true);
    setError(null);
    try {
      const { user, expiresAt } = await api.devLogin(devEmail.trim());
      setSession(user, expiresAt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Dev login failed");
    } finally {
      setBusy(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-gate-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-ink p-8 text-paper shadow-lift">
        <div className="mb-7 flex flex-col items-center text-center">
          <Logo light />
          <p className="mt-6 inline-flex items-center gap-2 font-mono text-[0.65rem] font-bold uppercase tracking-ticker text-amber">
            <Lock className="h-3.5 w-3.5" /> Members only
          </p>
          <h2
            id="login-gate-title"
            className="mt-3 font-display text-2xl font-bold tracking-tight"
          >
            Sign in to continue
          </h2>
          <p className="mt-2 text-sm text-paper/60">
            Please sign in with your Google account to access databeings.
          </p>
        </div>

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
            Set <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> to enable
            Google sign-in.
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
                placeholder="your email"
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
    </div>
  );
}
