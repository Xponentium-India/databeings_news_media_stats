import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

/** Lightweight, accessible select built on the native element. */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <select
          ref={ref}
          className={cn(
            "h-10 appearance-none rounded-full border border-ink/20 bg-paper pl-4 pr-9 font-mono text-xs font-bold uppercase tracking-wider text-ink shadow-sm transition-colors hover:border-ink focus-visible:border-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame/30",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-flame-dark" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
