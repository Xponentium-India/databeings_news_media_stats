import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Ticker } from "./Ticker";
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
    <header className="fixed inset-x-0 top-0 z-50">
      {/* newsroom ticker strip — always present */}
      <div className="relative flex h-8 items-center bg-ink text-paper">
        <div className="flex shrink-0 items-center gap-2 border-r border-white/15 px-4 font-mono text-[0.62rem] font-bold uppercase tracking-ticker text-amber">
          <span className="h-1.5 w-1.5 animate-blink rounded-full bg-flame" />
          Live
        </div>
        <Ticker className="flex-1 text-paper/80" />
      </div>

      {/* main nav */}
      <div
        className={cn(
          "transition-all duration-500",
          solid
            ? "bg-paper/90 shadow-[0_1px_0_0_#16130D14] backdrop-blur supports-[backdrop-filter]:bg-paper/75"
            : "bg-transparent"
        )}
      >
        <nav className="container flex h-16 items-center justify-between md:h-[4.5rem]">
          <Link to="/" aria-label="databeings home" className="shrink-0">
            <Logo light={!solid} />
          </Link>

          {/* desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-1.5 text-sm font-semibold tracking-tight transition-colors",
                    isActive
                      ? "text-flame"
                      : solid
                        ? "text-ink/70 hover:text-ink"
                        : "text-white/80 hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="font-mono text-[0.6rem] opacity-50">
                      0{i + 1}
                    </span>
                    <span className="link-underline">{link.label}</span>
                    {isActive && (
                      <span className="h-1 w-1 rounded-full bg-flame" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
            <Button asChild size="sm" variant={solid ? "default" : "light"}>
              <Link to="/contact">
                Get a Demo
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            </Button>
          </div>

          {/* mobile toggle */}
          <button
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors md:hidden",
              solid
                ? "border-ink/15 text-ink"
                : "border-white/25 text-white"
            )}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="border-t border-ink/10 bg-paper md:hidden">
          <div className="container flex flex-col py-3">
            {NAV_LINKS.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 border-b border-ink/10 py-3.5 text-base font-semibold",
                    isActive ? "text-flame" : "text-ink/80"
                  )
                }
              >
                <span className="font-mono text-xs opacity-50">0{i + 1}</span>
                {link.label}
              </NavLink>
            ))}
            <Button asChild className="mt-4 w-full">
              <Link to="/contact">Get a Demo</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
