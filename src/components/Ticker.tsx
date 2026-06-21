import { NEWS_STATS } from "@/data/content";
import { cn } from "@/lib/utils";

interface TickerProps {
  className?: string;
  /** "rev" scrolls the opposite direction */
  direction?: "default" | "rev";
  speed?: "normal" | "slow";
}

/**
 * Newsroom-style ticker tape built from the real YouTube channel stats.
 * The track is duplicated so the CSS marquee can loop seamlessly.
 */
export function Ticker({
  className,
  direction = "default",
  speed = "normal",
}: TickerProps) {
  const items = NEWS_STATS;
  const anim =
    direction === "rev"
      ? "animate-marquee-rev"
      : speed === "slow"
        ? "animate-marquee-slow"
        : "animate-marquee";

  return (
    <div className={cn("mask-x overflow-hidden", className)}>
      <div className={cn("flex w-max pause-on-hover", anim)}>
        {[0, 1].map((dup) => (
          <ul
            key={dup}
            aria-hidden={dup === 1}
            className="flex shrink-0 items-center"
          >
            {items.map((s) => (
              <li
                key={`${dup}-${s.channel}`}
                className="flex items-center gap-2.5 px-5 font-mono text-xs"
              >
                <span className="font-bold uppercase tracking-wider">
                  {s.channel}
                </span>
                <span className="tabular text-flame">{s.views.toFixed(1)}M</span>
                <span className="opacity-40">views</span>
                <span className="tabular opacity-60">{s.share}</span>
                <span className="ml-3 text-flame/50">/</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
