import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

/** Live mm:ss countdown to the 40-minute session expiry. */
export function SessionTimer({
  expiresAt,
  onExpire,
}: {
  expiresAt: number | null;
  onExpire?: () => void;
}) {
  const [remaining, setRemaining] = useState(() =>
    expiresAt ? expiresAt - Date.now() : 0
  );

  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      const ms = expiresAt - Date.now();
      setRemaining(ms);
      if (ms <= 0) onExpire?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt, onExpire]);

  if (!expiresAt) return null;

  const totalSec = Math.max(0, Math.floor(remaining / 1000));
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  const low = totalSec <= 120;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-bold tabular",
        low
          ? "border-flame/50 bg-flame/10 text-flame-dark"
          : "border-ink/15 text-ink/70"
      )}
      title="Time left in this session"
    >
      <Clock className="h-3.5 w-3.5" />
      {mm}:{ss}
    </span>
  );
}
