import * as React from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** stagger delay in ms */
  delay?: number;
  /** render as another tag */
  as?: React.ElementType;
}

/**
 * Scroll-triggered reveal. Adds `.is-visible` the first time the element
 * enters the viewport (see the `.reveal` utility in index.css).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  style,
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      style={{ ["--reveal-delay" as string]: `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
