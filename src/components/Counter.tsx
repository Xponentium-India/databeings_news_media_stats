import * as React from "react";

interface CounterProps {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Counts up from 0 to `value` the first time it scrolls into view. */
export function Counter({
  value,
  decimals = 0,
  duration = 1400,
  prefix = "",
  suffix = "",
  className,
}: CounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const run = (startTs: number) => {
      const step = (now: number) => {
        const t = Math.min((now - startTs) / duration, 1);
        setDisplay(value * ease(t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            raf = requestAnimationFrame((now) => run(now));
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
