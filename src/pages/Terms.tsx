import { Reveal } from "@/components/Reveal";

export default function Terms() {
  return (
    <section className="bg-paper pt-32 md:pt-40">
      <div className="container pb-24">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-6xl">
            Terms &amp; Conditions
          </h1>
          <span className="mt-6 block h-px w-24 bg-flame" />
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink/75">
            <p>
              The information provided by databeings (Xponentium India LLP) on
              thedatabeings.com is for general informational purposes only. All
              information on the site is provided in good faith, however we make no
              representation or warranty of any kind regarding the accuracy or
              completeness of any information on the site.
            </p>
            <p>
              The statistics presented in our News Media Stats reports are compiled
              from publicly available sources. Figures are indicative and intended
              for analytical and benchmarking purposes.
            </p>
            <p>
              For any questions regarding these terms, please reach out to us at{" "}
              <a
                href="mailto:contact@thedatabeings.com"
                className="font-semibold text-flame-dark link-underline"
              >
                contact@thedatabeings.com
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
