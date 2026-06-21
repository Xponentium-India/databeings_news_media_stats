import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** force the wordmark to render white (e.g. over a photo) */
  light?: boolean;
}

export function Logo({ className, light = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-serif", className)}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden="true">
        <path
          d="M16 3a9 9 0 0 0-5 16.5V23a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3.5A9 9 0 0 0 16 3Z"
          fill="#F2C94C"
        />
        <rect x="12" y="25" width="8" height="2.4" rx="1.2" fill="#5A5A5A" />
        <rect x="13" y="28" width="6" height="2" rx="1" fill="#5A5A5A" />
        <path
          d="M16 1v2M27 8l-1.7 1M5 8l1.7 1M29 16h-2M5 16H3"
          stroke="#F2C94C"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-2xl font-bold leading-none tracking-tight">
        <span className="text-brandorange">data</span>
        <span className={light ? "text-white" : "text-navy"}>beings</span>
      </span>
    </span>
  );
}
