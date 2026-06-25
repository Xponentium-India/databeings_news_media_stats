import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** use the light wordmark (cream "beings") over dark backgrounds */
  light?: boolean;
}

export function Logo({ className, light = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <img
        src={light ? "/databeings-logo-light.png" : "/databeings-logo.png"}
        alt="databeings"
        className="h-8 w-auto select-none"
        draggable={false}
      />
    </span>
  );
}
