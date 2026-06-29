import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCTA } from "@/components/ProjectCTA";
import { SubscribeBar } from "@/components/SubscribeBar";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { IMAGES, SERVICE_COLUMNS } from "@/data/content";
import { LiveViewsPanel } from "@/components/LiveViewsPanel";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-ink text-paper">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #F2C94C 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute -right-32 top-0 h-[34rem] w-[34rem] rounded-full bg-flame/20 blur-[130px]" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-navy/50 blur-[120px]" />

        <div className="container relative grid items-center gap-14 pt-36 pb-20 md:grid-cols-[1.15fr_0.85fr] md:pt-44 md:pb-28">
          {/* copy */}
          <div>
            <Reveal className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-flame" />
              <span className="eyebrow-light">
                Social listening · Analytics · Research
              </span>
            </Reveal>

            <Reveal
              as="h1"
              delay={80}
              className="mt-6 font-display text-[2.1rem] font-bold leading-[1.02] tracking-tight text-balance sm:text-6xl sm:leading-[0.98] md:text-[4.6rem]"
            >
              Social Media Listening &amp;{" "}
              <span className="serif-accent font-serif text-flame">
                Analytics
              </span>{" "}
              with a Difference
            </Reveal>

            <Reveal
              as="p"
              delay={160}
              className="mt-7 max-w-xl text-base leading-relaxed text-paper/75 md:text-lg"
            >
              databeings helps digital media publishers and B2C brands to
              understand market trends and drive customer insights. We deploy
              advanced analytical tools to combine social media chatter with
              market research to predict upcoming trends.
            </Reveal>

            <Reveal delay={240} className="mt-9 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" variant="flame">
                <Link to="/services">
                  Find out how!
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </Link>
              </Button>
              <a
                href="#hire-us"
                className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-paper/60 transition-colors hover:text-paper"
              >
                <ArrowDown className="h-4 w-4" />
                Explore
              </a>
            </Reveal>
          </div>

          {/* live data panel */}
          <Reveal delay={200} className="relative flex justify-center md:justify-end">
            <LiveViewsPanel />
          </Reveal>
        </div>

        {/* stat strip */}
        <div className="relative border-t border-white/10">
          <div className="container grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
            {[
              { v: 509.2, d: 1, s: "M", l: "Monthly views tracked" },
              { v: 76.4, d: 1, s: "M", l: "Channel subscribers" },
              { v: 12, d: 0, s: "", l: "News channels ranked" },
              { v: 3, d: 0, s: "", l: "Core service lines" },
            ].map((stat, i) => (
              <Reveal
                key={stat.l}
                delay={i * 80}
                className="px-2 py-7 text-center md:py-9"
              >
                <p className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  <Counter value={stat.v} decimals={stat.d} suffix={stat.s} />
                </p>
                <p className="mt-1.5 font-mono text-[0.62rem] uppercase tracking-wider text-paper/50">
                  {stat.l}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hire Us For */}
      <section id="hire-us" className="section">
        <div className="container">
          <Reveal className="flex flex-col gap-4 border-b border-ink/10 pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">What we do</p>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Hire Us For
              </h2>
            </div>
            <span className="font-mono text-xs uppercase tracking-ticker text-ink/40">
              [ 03 practice areas ]
            </span>
          </Reveal>

          <div className="mt-4 divide-y divide-ink/10">
            {SERVICE_COLUMNS.map((col, i) => (
              <Reveal
                key={col.title}
                delay={i * 70}
                className="group grid gap-5 py-10 transition-colors md:grid-cols-[5rem_1fr_2fr] md:gap-10"
              >
                <span className="font-mono text-2xl font-bold text-ink/25 transition-colors group-hover:text-flame">
                  0{i + 1}
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-flame md:text-3xl">
                  {col.title}
                </h3>
                <ul className="space-y-3.5">
                  {col.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-ink/70"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="grain relative overflow-hidden bg-ink text-paper">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-navy/40 blur-[130px]" />
        <div className="container relative grid items-center gap-12 py-20 md:grid-cols-2 md:gap-16 md:py-28">
          <Reveal>
            <p className="eyebrow-light">Who we are</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              About Us
            </h2>
            <div className="mt-7 space-y-5 text-paper/75">
              <p>
                We are a team of analytics and technology experts having
                experience of working with leading consulting firms and
                delivering solutions for Indian and global clients.
              </p>
              <p>
                Our goal is to empower business leaders and marketing teams with
                data driven insights at the right time. We have the ability to
                link data from multiple publicly available sources to drive
                insights for both digital media publishers and B2C brands (e.g.,
                social media influencer ranking and applicability for your brand,
                twitter sentiment analysis benchmarking with your competitor,
                retail expansion strategy using district &amp; PIN code level
                analysis.)
              </p>
              <p>
                We are constantly on the lookout for newer sources of publicly
                available data and triangulate data across sources to get a sense
                of India&apos;s social and economic zeitgeist.
              </p>
            </div>
            <p className="mt-8 border-l-2 border-flame pl-5 font-serif text-2xl italic leading-snug text-amber md:text-3xl">
              If data is the new oil, we are always drilling!
            </p>
          </Reveal>

          <Reveal delay={140} className="relative">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10">
              <img
                src={IMAGES.about}
                alt="Analyst reviewing data on screen"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:animate-shake"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/60 via-transparent to-flame/20 mix-blend-multiply" />
            </div>
            <div className="absolute -right-4 -top-4 hidden rotate-3 rounded-xl bg-flame px-5 py-3 text-white shadow-lift sm:block">
              <p className="font-mono text-[0.6rem] uppercase tracking-wider">
                Always
              </p>
              <p className="font-display text-xl font-bold leading-none">
                drilling
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <ProjectCTA />
      <SubscribeBar />
    </>
  );
}
