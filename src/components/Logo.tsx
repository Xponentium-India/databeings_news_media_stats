import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** force the wordmark to render light (e.g. over a dark hero) */
  light?: boolean;
}

export function Logo({ className, light = false }: LogoProps) {
  return (
    <span
      className={cn(
        "group inline-flex items-center gap-2.5 font-display",
        className
      )}
    >
      <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center">
        <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
          {/* idea bulb formed from rising data bars */}
          <path
            d="M16 2.5a10 10 0 0 0-6 18v2.2A1.8 1.8 0 0 0 11.8 24.5h8.4A1.8 1.8 0 0 0 22 22.7v-2.2a10 10 0 0 0-6-18Z"
            className="fill-flame transition-colors duration-300 group-hover:fill-flame-dark"
          />
          <g className="stroke-white" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12.5" y1="18" x2="12.5" y2="14.5" />
            <line x1="16" y1="18" x2="16" y2="11" />
            <line x1="19.5" y1="18" x2="19.5" y2="13" />
          </g>
          <rect x="12.2" y="26" width="7.6" height="2.1" rx="1.05" className="fill-ink" />
          <rect x="13.4" y="29" width="5.2" height="1.8" rx="0.9" className="fill-ink/70" />
        </svg>
      </span>
      <span className="text-[1.55rem] font-bold leading-none tracking-tight">
        <span className="text-flame">data</span>
        <span className={light ? "text-white" : "text-ink"}>beings</span>
      </span>
    </span>
  );
}
