import { useEffect, useRef, useState } from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { cn } from "@/lib/utils";

/** Ask the site-wide LoginGateModal to open immediately. */
export function openLoginGate() {
  window.dispatchEvent(new Event("databeings:open-login"));
}

/**
 * Navbar account control. Logged out → a profile icon that opens the login popup.
 * Logged in → the Google profile picture with a dropdown to sign out.
 * `solid` matches the navbar state (over a dark hero vs. light background).
 */
export function ProfileMenu({ solid }: { solid: boolean }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close the dropdown on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) {
    return (
      <button
        type="button"
        onClick={openLoginGate}
        aria-label="Sign in"
        title="Sign in"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
          solid
            ? "border-ink/15 text-ink/70 hover:border-ink/30 hover:text-ink"
            : "border-white/25 text-white/80 hover:text-white"
        )}
      >
        <UserIcon className="h-5 w-5" />
      </button>
    );
  }

  const initial = (user.name || user.email || "?").trim().charAt(0).toUpperCase();
  const Avatar = ({ size }: { size: string }) =>
    user.pictureUrl ? (
      <img
        src={user.pictureUrl}
        alt=""
        referrerPolicy="no-referrer"
        className={cn("rounded-full object-cover", size)}
      />
    ) : (
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-flame/15 text-sm font-bold text-flame",
          size
        )}
      >
        {initial}
      </span>
    );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className={cn(
          "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border transition",
          solid ? "border-ink/15" : "border-white/30",
          open && "ring-2 ring-flame/50"
        )}
      >
        <Avatar size="h-full w-full" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-ink/10 bg-paper shadow-lift">
          <div className="flex items-center gap-3 border-b border-ink/10 px-4 py-3">
            <Avatar size="h-9 w-9" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {user.name || "Signed in"}
              </p>
              <p className="truncate text-xs text-ink/55">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-ink/80 transition-colors hover:bg-ink/5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
