import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { IMAGES } from "@/data/content";

/** "Have a Project in mind?" — shared by Home and Services. */
export function ProjectCTA() {
  return (
    <section className="section">
      <div className="container grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="order-2 md:order-1">
          <h2 className="display-heading text-3xl sm:text-4xl">
            Have a Project in mind?
          </h2>
          <p className="mt-4 max-w-md text-ink/70">
            We can help you with your data and analytics needs. Let&apos;s talk
            about what we can build together.
          </p>
          <Button asChild variant="outlineGold" className="mt-6">
            <Link to="/contact">Connect with us!</Link>
          </Button>
        </div>
        <div className="order-1 md:order-2">
          <img
            src={IMAGES.project}
            alt="Team collaborating at a desk"
            className="aspect-[4/3] w-full rounded-lg object-cover shadow-md"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
