import * as React from "react";
import { cn } from "@/lib/utils";

export interface BarDatum {
  label: string;
  value: number;
  meta?: string;
}

interface StatBarsProps {
  data: BarDatum[];
  /** highest value used to scale the bars (defaults to max in data) */
  max?: number;
  className?: string;
  /** dark surface (light text) vs light surface */
  tone?: "light" | "dark";
  /** value suffix, e.g. "M" */
  suffix?: string;
}

/**
 * Animated horizontal bars that grow from zero when scrolled into view.
 * Shared by the hero and the News Media Stats chart.
 */
export function StatBars({
  data,
  max,
  className,
  tone = "light",
  suffix = "",
}: StatBarsProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);
  const top = max ?? Math.max(...data.map((d) => d.value));

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const trackBg = tone === "dark" ? "bg-white/10" : "bg-ink/[0.07]";
  const labelColor = tone === "dark" ? "text-paper/80" : "text-ink/80";
  const valueColor = tone === "dark" ? "text-amber" : "text-flame-dark";

  return (
    <div ref={ref} className={cn("space-y-3", className)}>
      {data.map((d, i) => (
        <div key={d.label} className="group/bar">
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span
              className={cn(
                "truncate text-sm font-semibold tracking-tight",
                labelColor
              )}
            >
              {d.label}
            </span>
            <span
              className={cn("tabular font-mono text-xs font-bold", valueColor)}
            >
              {d.value.toFixed(1)}
              {suffix}
            </span>
          </div>
          <div className={cn("h-2.5 w-full overflow-hidden rounded-full", trackBg)}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-flame to-amber transition-[width] duration-1000 ease-out group-hover/bar:from-flame-dark"
              style={{
                width: shown ? `${(d.value / top) * 100}%` : "0%",
                transitionDelay: `${i * 90}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
