import { useState, type ReactNode } from "react";
import { ArrowUpRight, Check, Mail, Twitter, Linkedin } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero title="Contact" kicker="Say hello" index="03" />

      <section className="section">
        <div className="container grid gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
          {/* left: contact details */}
          <Reveal className="flex flex-col">
            <p className="eyebrow">Get in touch</p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              We are here to help!
            </h2>

            <a
              href="mailto:contact@thedatabeings.com"
              className="group mt-10 block border-t border-ink/10 pt-6"
            >
              <span className="flex items-center gap-2 font-mono text-[0.7rem] font-bold uppercase tracking-ticker text-flame-dark">
                <Mail className="h-4 w-4" /> Email
              </span>
              <span className="mt-2 flex items-center gap-2 font-display text-xl font-bold tracking-tight transition-colors group-hover:text-flame md:text-2xl">
                contact@thedatabeings.com
                <ArrowUpRight className="h-5 w-5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </span>
            </a>

            <div className="mt-8 border-t border-ink/10 pt-6">
              <span className="font-mono text-[0.7rem] font-bold uppercase tracking-ticker text-flame-dark">
                Social
              </span>
              <div className="mt-3 flex items-center gap-3">
                <a
                  href="https://x.com/DataBeings"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-flame hover:bg-flame hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/data-beings-76765021b/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-flame hover:bg-flame hover:text-white"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </Reveal>

          {/* right: form */}
          <Reveal delay={120}>
            <div className="rounded-2xl border border-ink/10 bg-white/60 p-7 shadow-editorial sm:p-10">
              {sent ? (
                <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-flame text-white">
                    <Check className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">
                    Thanks for reaching out!
                  </h3>
                  <p className="mt-3 max-w-xs text-ink/65">
                    We&apos;ve received your message and will get back to you
                    shortly.
                  </p>
                </div>
              ) : (
                <form
                  className="space-y-7"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                >
                  <div className="grid gap-7 sm:grid-cols-2">
                    <Field label="First Name">
                      <Input placeholder="Jane" aria-label="First Name" required />
                    </Field>
                    <Field label="Last Name">
                      <Input placeholder="Doe" aria-label="Last Name" required />
                    </Field>
                  </div>
                  <Field label="Email Address">
                    <Input
                      type="email"
                      placeholder="jane@company.com"
                      aria-label="Email Address"
                      required
                    />
                  </Field>
                  <Field label="Subject">
                    <Input placeholder="What's this about?" aria-label="Subject" />
                  </Field>
                  <Field label="Your Message">
                    <Textarea
                      placeholder="Tell us a little more…"
                      aria-label="Your Message"
                      required
                    />
                  </Field>
                  <Button type="submit" variant="flame" size="lg" className="w-full sm:w-auto">
                    Send Message
                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[0.65rem] font-bold uppercase tracking-wider text-ink/50">
        {label}
      </span>
      {children}
    </label>
  );
}
