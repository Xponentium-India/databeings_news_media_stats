import { Link } from "react-router-dom";
import { ArrowUpRight, Linkedin, Mail, Twitter } from "lucide-react";
import { Logo } from "./Logo";
import { Ticker } from "./Ticker";

const FOOTER_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "News Media Stats", to: "/news-media-stats" },
  { label: "Contact", to: "/contact" },
  { label: "Terms & Conditions", to: "/terms" },
];

export function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-ink text-paper">
      <div className="border-b border-white/10 py-3">
        <Ticker className="text-paper/60" direction="rev" />
      </div>

      <div className="container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" aria-label="databeings home">
              <Logo light className="scale-110 origin-left" />
            </Link>
            <p className="mt-6 max-w-xs font-serif text-base italic leading-relaxed text-paper/60">
              Social Media Listening &amp; Analytics with a Difference
            </p>
            <a
              href="mailto:contact@thedatabeings.com"
              className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-amber link-underline"
            >
              <Mail className="h-4 w-4" />
              contact@thedatabeings.com
            </a>
          </div>

          <div>
            <p className="eyebrow-light">Navigate</p>
            <nav className="mt-5 flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group inline-flex w-fit items-center gap-1.5 text-sm text-paper/75 transition-colors hover:text-white"
                >
                  {link.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="eyebrow-light">Follow</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://x.com/DataBeings"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-paper/80 transition-colors hover:border-flame hover:bg-flame hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/data-beings-76765021b/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-paper/80 transition-colors hover:border-flame hover:bg-flame hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-6 font-mono text-xs text-paper/45">@DataBeings</p>
          </div>
        </div>

        {/* oversized wordmark */}
        <div className="mt-16 select-none overflow-hidden">
          <p className="font-display text-[18vw] font-bold leading-[0.8] tracking-tighter text-white/[0.04] md:text-[14rem]">
            databeings
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="container text-center font-mono text-[0.7rem] uppercase tracking-wider text-paper/45">
          Copyright © 2026 thedatabeings.com by Xponentium India LLP
        </p>
      </div>
    </footer>
  );
}
