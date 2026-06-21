import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCTA } from "@/components/ProjectCTA";
import { SubscribeBar } from "@/components/SubscribeBar";
import { IMAGES, SERVICE_COLUMNS } from "@/data/content";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <img
          src={IMAGES.hero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/65 to-black/35" />
        <div className="container relative pt-24">
          <div className="max-w-3xl animate-fade-up">
            <h1 className="display-heading text-4xl leading-[1.1] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Social Media Listening &amp; Analytics with a Difference
            </h1>
            <p className="mt-6 max-w-2xl text-base text-white/85 md:text-lg">
              databeings helps digital media publishers and B2C brands to
              understand market trends and drive customer insights. We deploy
              advanced analytical tools to combine social media chatter with
              market research to predict upcoming trends.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/services">
                Find out how! <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Hire Us For */}
      <section className="section">
        <div className="container">
          <h2 className="display-heading text-3xl sm:text-4xl">Hire Us For</h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {SERVICE_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-lg font-bold text-navy">{col.title}</h3>
                <span className="mt-2 block h-1 w-12 rounded-full bg-accent" />
                <ul className="mt-5 space-y-4">
                  {col.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm text-ink/70">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-dark" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="bg-cream">
        <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          <div>
            <h2 className="display-heading text-3xl sm:text-4xl">About Us</h2>
            <div className="mt-6 space-y-4 text-ink/75">
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
                of India&apos;s social and economic zeitgeist. If data is the new
                oil, we are always drilling!
              </p>
            </div>
          </div>
          <div>
            <img
              src={IMAGES.about}
              alt="Analyst reviewing data on screen"
              className="aspect-[4/3] w-full rounded-lg object-cover shadow-md"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <ProjectCTA />
      <SubscribeBar />
    </>
  );
}
