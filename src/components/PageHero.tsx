import { Reveal } from "./Reveal";

interface PageHeroProps {
  title: string;
  /** mono eyebrow above the title */
  kicker?: string;
  /** short editorial line under the title */
  lead?: string;
  /** section index, e.g. "02" */
  index?: string;
}

/** Editorial masthead used by interior pages (Services / Contact). */
export function PageHero({ title, kicker, lead, index }: PageHeroProps) {
  return (
    <section className="grain relative overflow-hidden bg-ink pt-32 text-paper md:pt-40">
      {/* animated dotted grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #F2C94C 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="pointer-events-none absolute -right-24 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-flame/20 blur-[120px]" />

      <div className="container relative pb-16 md:pb-24">
        <Reveal className="flex items-center gap-4">
          {index && (
            <span className="font-mono text-sm font-bold text-flame">
              [ {index} ]
            </span>
          )}
          <span className="eyebrow-light">{kicker ?? "databeings"}</span>
          <span className="h-px flex-1 bg-white/15" />
        </Reveal>

        <Reveal
          delay={80}
          className="mt-6 font-display text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
        >
          {title}
        </Reveal>

        {lead && (
          <Reveal
            delay={160}
            className="mt-7 max-w-xl font-serif text-lg italic text-paper/70 md:text-xl"
          >
            {lead}
          </Reveal>
        )}
      </div>
    </section>
  );
}
