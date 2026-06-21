import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ProjectCTA } from "@/components/ProjectCTA";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { SERVICE_COLUMNS } from "@/data/content";
import { cn } from "@/lib/utils";

export default function Services() {
  const [open, setOpen] = useState(0);

  return (
    <>
      <PageHero title="Services" kicker="What we offer" index="01" />

      {/* How can we help you? */}
      <section className="section">
        <div className="container">
          <Reveal className="border-b border-ink/10 pb-8">
            <p className="eyebrow">Capabilities</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              How can we help you?
            </h2>
          </Reveal>

          <div className="mt-2">
            {SERVICE_COLUMNS.map((col, i) => {
              const isOpen = open === i;
              return (
                <Reveal
                  key={col.title}
                  delay={i * 70}
                  className="border-b border-ink/10"
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-5 py-7 text-left md:gap-8"
                  >
                    <span
                      className={cn(
                        "font-mono text-lg font-bold transition-colors",
                        isOpen ? "text-flame" : "text-ink/25"
                      )}
                    >
                      0{i + 1}
                    </span>
                    <h3
                      className={cn(
                        "flex-1 font-display text-2xl font-bold tracking-tight transition-colors md:text-4xl",
                        isOpen
                          ? "text-flame"
                          : "text-ink group-hover:text-flame"
                      )}
                    >
                      {col.title}
                    </h3>
                    <span
                      className={cn(
                        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                        isOpen
                          ? "rotate-45 border-flame bg-flame text-white"
                          : "border-ink/20 text-ink group-hover:border-ink"
                      )}
                    >
                      <Plus className="h-5 w-5" />
                    </span>
                  </button>

                  <div
                    className={cn(
                      "grid transition-all duration-500 ease-out",
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="grid gap-8 pb-9 md:grid-cols-[5rem_2fr_1fr] md:gap-10">
                        <span className="hidden md:block" />
                        <ul className="space-y-4">
                          {col.points.map((point) => (
                            <li
                              key={point}
                              className="flex gap-3 text-sm leading-relaxed text-ink/70 md:text-base"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="md:text-right">
                          <Button asChild variant="outlineGold" size="sm">
                            <Link to="/contact">
                              Get in Touch
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <ProjectCTA />
    </>
  );
}
