import { Link } from "react-router-dom";
import { Linkedin, Twitter } from "lucide-react";
import { Logo } from "./Logo";

const FOOTER_LINKS = [
  { label: "Home", to: "/" },
  { label: "Contact", to: "/contact" },
  { label: "News Media Stats", to: "/news-media-stats" },
  { label: "Services", to: "/services" },
  { label: "Terms & Conditions", to: "/terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container py-12">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <Link to="/" aria-label="databeings home">
            <Logo className="scale-110 origin-left" />
          </Link>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-ink/70 transition-colors hover:text-navy"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="text-navy transition-colors hover:text-accent-dark"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-navy transition-colors hover:text-accent-dark"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <p className="container text-center text-xs text-muted-foreground">
          Copyright © 2026 thedatabeings.com by Xponentium India LLP
        </p>
      </div>
    </footer>
  );
}
