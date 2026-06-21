import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { Reveal } from "./Reveal";

/** "Have a Project in mind?" — shared by Home and Services. */
export function ProjectCTA() {
  return (
    <section className="grain relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-flame/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-navy/40 blur-[120px]" />

      <div className="container relative grid items-center gap-10 py-20 md:grid-cols-[1.3fr_1fr] md:py-28">
        <Reveal>
          <p className="eyebrow-light">Let&apos;s build</p>
          <h2 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            Have a{" "}
            <span className="serif-accent font-serif text-flame">Project</span>{" "}
            in mind?
          </h2>
          <p className="mt-6 max-w-md text-lg text-paper/70">
            We can help you with your data and analytics needs. Let&apos;s talk
            about what we can build together.
          </p>
          <Button asChild size="lg" variant="flame" className="mt-9">
            <Link to="/contact">
              Connect with us!
              <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={120} className="hidden md:block">
          {/* decorative animated stat dial */}
          <div className="relative ml-auto aspect-square w-full max-w-sm">
            <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-white/15" />
            <div className="absolute inset-8 rounded-full border border-white/10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-xs uppercase tracking-ticker text-amber">
                Data is the
              </span>
              <span className="mt-2 font-serif text-4xl italic">new oil</span>
              <span className="mt-2 font-mono text-xs uppercase tracking-ticker text-paper/50">
                — always drilling
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
