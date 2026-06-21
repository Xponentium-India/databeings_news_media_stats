import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
  { label: "News Media Stats", to: "/news-media-stats" },
];

/** Routes that render a dark hero behind a transparent navbar. */
const HERO_ROUTES = new Set(["/", "/services", "/contact"]);

export function Navbar() {
  const { pathname } = useLocation();
  const overHero = HERO_ROUTES.has(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!overHero) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid
          ? "bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80"
          : "bg-gradient-to-b from-black/40 to-transparent"
      )}
    >
      <nav className="container flex h-16 items-center justify-between md:h-20">
        <Link to="/" aria-label="databeings home">
          <Logo light={!solid} />
        </Link>

        {/* desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm font-semibold transition-colors",
                  isActive
                    ? "text-accent-dark"
                    : solid
                      ? "text-ink/80 hover:text-navy"
                      : "text-white/90 hover:text-white"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Button asChild size="sm" className="ml-1">
            <Link to="/contact">Get a Demo</Link>
          </Button>
        </div>

        {/* mobile toggle */}
        <button
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden",
            solid ? "text-ink" : "text-white"
          )}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-border bg-white md:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-2.5 text-sm font-semibold",
                    isActive ? "bg-cream text-ink" : "text-ink/80 hover:bg-muted"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button asChild size="sm" className="mt-2 w-full">
              <Link to="/contact">Get a Demo</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
