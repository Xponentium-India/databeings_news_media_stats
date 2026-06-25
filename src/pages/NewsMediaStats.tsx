import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ImageOff, Loader2 } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Logo } from "@/components/Logo";
import { Select } from "@/components/ui/select";
import { api, assetUrl, type StatImage } from "@/lib/api";

const MONTH_RANK: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};
const MONTH_LONG: Record<string, string> = {
  Jan: "January", Feb: "February", Mar: "March", Apr: "April",
  May: "May", Jun: "June", Jul: "July", Aug: "August",
  Sep: "September", Oct: "October", Nov: "November", Dec: "December",
};

const uniq = <T,>(xs: T[]) => Array.from(new Set(xs));

/** Sort key so months fall in calendar order and weeks in numeric order (latest first). */
function slotRank(s: string) {
  if (MONTH_RANK[s]) return MONTH_RANK[s];
  const n = s.match(/\d+/);
  return n ? 100 + Number(n[0]) : 999;
}
const slotLabel = (s: string) => MONTH_LONG[s] ?? s;

export default function NewsMediaStats() {
  const [items, setItems] = useState<StatImage[]>([]);
  const [loading, setLoading] = useState(true);

  // load every published report once; the whole UI is derived from this list
  useEffect(() => {
    let active = true;
    api
      .listStats()
      .then(({ items }) => {
        if (active) setItems(items);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // raw selections; resolved against what actually exists on every render so the
  // dropdowns can only ever point at a real, uploaded report.
  const [langSel, setLangSel] = useState("");
  const [periodSel, setPeriodSel] = useState("");
  const [yearSel, setYearSel] = useState<number | null>(null);
  const [slotSel, setSlotSel] = useState("");

  const languages = useMemo(() => uniq(items.map((i) => i.language)), [items]);
  const lang = languages.includes(langSel) ? langSel : languages[0] ?? "";

  const periods = useMemo(
    () => uniq(items.filter((i) => i.language === lang).map((i) => i.period)),
    [items, lang]
  );
  const period = (periods as string[]).includes(periodSel)
    ? periodSel
    : periods[0] ?? "";

  const years = useMemo(
    () =>
      uniq(
        items
          .filter((i) => i.language === lang && i.period === period)
          .map((i) => i.year)
      ).sort((a, b) => b - a),
    [items, lang, period]
  );
  const year = yearSel != null && years.includes(yearSel) ? yearSel : years[0] ?? null;

  const slots = useMemo(
    () =>
      uniq(
        items
          .filter(
            (i) => i.language === lang && i.period === period && i.year === year
          )
          .map((i) => i.monthOrWeek)
      ).sort((a, b) => slotRank(b) - slotRank(a)),
    [items, lang, period, year]
  );
  const slot = slots.includes(slotSel) ? slotSel : slots[0] ?? "";

  const current = useMemo(
    () =>
      items.find(
        (i) =>
          i.language === lang &&
          i.period === period &&
          i.year === year &&
          i.monthOrWeek === slot
      ) ?? null,
    [items, lang, period, year, slot]
  );

  const title = current
    ? `${lang} News YouTube ${period} Stats — ${slotLabel(slot)} ${year}`
    : "";

  return (
    <>
      {/* masthead */}
      <section className="grain relative overflow-hidden bg-ink pt-32 text-paper md:pt-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #F2C94C 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-flame/20 blur-[120px]" />
        <div className="container relative pb-12">
          <Reveal className="flex items-center gap-4">
            <span className="font-mono text-sm font-bold text-flame">[ 04 ]</span>
            <span className="eyebrow-light">Data report</span>
            <span className="h-px flex-1 bg-white/15" />
          </Reveal>
          <Reveal
            as="h1"
            delay={80}
            className="mt-6 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl"
          >
            News Media Stats
          </Reveal>
          <Reveal
            as="p"
            delay={140}
            className="mt-5 max-w-xl font-serif text-lg italic text-paper/70"
          >
            YouTube Viewership stats for major English &amp; Hindi News Channels
          </Reveal>
        </div>
      </section>

      {/* report */}
      <section className="bg-paper">
        <div className="container py-12 md:py-16">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-7 w-7 animate-spin text-ink/40" />
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title="No reports published yet"
              body="Once an admin uploads report images, they'll appear here. Check back soon."
            />
          ) : (
            <>
              {/* control bar — options come straight from the uploaded reports */}
              <Reveal className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink/10 bg-white/60 p-5 shadow-editorial">
                <FilterField label="Lang">
                  <Select
                    value={lang}
                    onChange={(e) => setLangSel(e.target.value)}
                  >
                    {languages.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </Select>
                </FilterField>
                <FilterField label="Period">
                  <Select
                    value={period}
                    onChange={(e) => setPeriodSel(e.target.value)}
                  >
                    {periods.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </Select>
                </FilterField>
                <FilterField label="Year">
                  <Select
                    value={year ?? ""}
                    onChange={(e) => setYearSel(Number(e.target.value))}
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Select>
                </FilterField>
                <FilterField label={period === "Weekly" ? "Week" : "Month"}>
                  <Select
                    value={slot}
                    onChange={(e) => setSlotSel(e.target.value)}
                  >
                    {slots.map((s) => (
                      <option key={s} value={s}>
                        {slotLabel(s)}
                      </option>
                    ))}
                  </Select>
                </FilterField>
              </Reveal>

              {/* matching report image */}
              {current ? (
                <Reveal
                  delay={60}
                  className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-editorial"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-paper-2/60 px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-flame" />
                      <p className="eyebrow">{title}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <a
                        href={assetUrl(current.imagePath)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-flame-dark link-underline"
                      >
                        Open full size
                      </a>
                      <Logo className="hidden scale-90 sm:inline-flex" />
                    </div>
                  </div>
                  <div className="bg-paper-2/30 p-4 sm:p-6">
                    <img
                      key={current.id}
                      src={assetUrl(current.imagePath)}
                      alt={`${current.language} ${current.period} report — ${current.monthOrWeek} ${current.year}`}
                      className="mx-auto max-h-[720px] w-auto rounded-lg border border-ink/10 bg-white object-contain shadow-sm"
                      loading="lazy"
                    />
                  </div>
                </Reveal>
              ) : (
                <EmptyState
                  className="mt-6"
                  title="No report for this selection"
                  body="Try a different language, period, year or month."
                />
              )}

              <p className="mt-6 text-center font-mono text-xs font-bold uppercase tracking-wider text-ink/60 md:hidden">
                Please switch to landscape mode if you are viewing this on mobile.
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-ink/55">
      {label}
      {children}
    </label>
  );
}

function EmptyState({
  title,
  body,
  className = "",
}: {
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-ink/20 bg-white/50 px-6 py-16 text-center ${className}`}
    >
      <ImageOff className="mx-auto h-8 w-8 text-ink/30" />
      <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-ink/80">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink/55">{body}</p>
    </div>
  );
}
