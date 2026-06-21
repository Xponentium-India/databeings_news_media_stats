import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ProjectCTA } from "@/components/ProjectCTA";
import { Button } from "@/components/ui/button";
import { IMAGES, SERVICE_COLUMNS } from "@/data/content";

export default function Services() {
  return (
    <>
      <PageHero title="Services" image={IMAGES.servicesHero} />

      {/* How can we help you? */}
      <section className="bg-cream">
        <div className="container py-16 md:py-24">
          <h2 className="display-heading text-3xl sm:text-4xl">
            How can we help you?
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {SERVICE_COLUMNS.map((col) => (
              <div
                key={col.title}
                className="flex flex-col rounded-lg bg-white/60 p-6 ring-1 ring-black/5"
              >
                <h3 className="text-lg font-bold text-navy">{col.title}</h3>
                <span className="mt-2 block h-1 w-12 rounded-full bg-accent" />
                <ul className="mt-5 flex-1 space-y-4">
                  {col.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm text-ink/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="sm" className="mt-6 self-start">
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectCTA />
    </>
  );
}
