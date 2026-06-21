import { useState } from "react";
import { Mail, Twitter } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IMAGES } from "@/data/content";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero title="Contact" image={IMAGES.contactHero} />

      <section className="bg-cream">
        <div className="container grid gap-12 py-16 md:grid-cols-2 md:gap-16 md:py-24">
          {/* left: contact details */}
          <div className="flex flex-col justify-center">
            <h2 className="display-heading text-3xl sm:text-4xl">
              We are here to help!
            </h2>
            <p className="mt-6 flex items-center gap-2 text-ink">
              <Mail className="h-5 w-5 text-accent-dark" />
              <span className="font-semibold">Email:</span>
              <a
                href="mailto:contact@thedatabeings.com"
                className="text-navy hover:underline"
              >
                contact@thedatabeings.com
              </a>
            </p>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="mt-4 inline-flex h-9 w-9 items-center justify-center text-navy transition-colors hover:text-accent-dark"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>

          {/* right: form */}
          <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
            {sent ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <h3 className="text-xl font-semibold text-navy">
                  Thanks for reaching out!
                </h3>
                <p className="mt-2 text-ink/70">
                  We&apos;ve received your message and will get back to you
                  shortly.
                </p>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="First Name" aria-label="First Name" required />
                  <Input placeholder="Last Name" aria-label="Last Name" required />
                </div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  aria-label="Email Address"
                  required
                />
                <Input placeholder="Subject" aria-label="Subject" />
                <Textarea placeholder="Your Message" aria-label="Your Message" required />
                <Button type="submit">Send Message</Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
