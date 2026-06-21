import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, BarChart3, Table2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { Select } from "@/components/ui/select";
import { NEWS_STATS, NEWS_STATS_TOTAL, type ChannelStat } from "@/data/content";
import { cn } from "@/lib/utils";

const LANGS = ["English", "Hindi"];
const PERIODS = ["Monthly", "Weekly"];
const MONTHS = ["Sep", "Aug", "Jul", "Jun"];

const MONTH_LONG: Record<string, string> = {
  Sep: "September",
  Aug: "August",
  Jul: "July",
  Jun: "June",
};

type SortKey = "views" | "subscribers" | "share";

const shareNum = (s: string) => parseFloat(s.replace("%", "")) || 0;

const SORTS: { key: SortKey; label: string }[] = [
  { key: "views", label: "Views" },
  { key: "subscribers", label: "Subscribers" },
  { key: "share", label: "Share" },
];

export default function NewsMediaStats() {
  const [lang, setLang] = useState("English");
  const [period, setPeriod] = useState("Monthly");
  const [month, setMonth] = useState("Sep");
  const [view, setView] = useState<"chart" | "table">("chart");
  const [sort, setSort] = useState<SortKey>("views");
  const [desc, setDesc] = useState(true);

  const tableTitle = `${lang} News YouTube ${period} Stats — ${MONTH_LONG[month]}, 2024`;

  const sorted = useMemo(() => {
    const get = (r: ChannelStat) =>
      sort === "share" ? shareNum(r.share) : r[sort];
    return [...NEWS_STATS].sort((a, b) =>
      desc ? get(b) - get(a) : get(a) - get(b)
    );
  }, [sort, desc]);

  const maxViews = Math.max(...NEWS_STATS.map((s) => s.views));

  const toggleSort = (key: SortKey) => {
    if (key === sort) setDesc((d) => !d);
    else {
      setSort(key);
      setDesc(true);
    }
  };

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

          {/* totals */}
          <Reveal delay={200} className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {[
              { v: NEWS_STATS_TOTAL.views, d: 1, s: "M", l: "Total views" },
              {
                v: NEWS_STATS_TOTAL.subscribers,
                d: 1,
                s: "M",
                l: "Subscribers",
              },
              { v: NEWS_STATS.length, d: 0, s: "", l: "Channels" },
            ].map((t) => (
              <div
                key={t.l}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <p className="font-display text-2xl font-bold text-amber md:text-3xl">
                  <Counter value={t.v} decimals={t.d} suffix={t.s} />
                </p>
                <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-wider text-paper/50">
                  {t.l}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* report */}
      <section className="bg-paper">
        <div className="container py-12 md:py-16">
          {/* control bar */}
          <Reveal className="flex flex-col gap-5 rounded-2xl border border-ink/10 bg-white/60 p-5 shadow-editorial md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <FilterField label="Lang">
                <Select value={lang} onChange={(e) => setLang(e.target.value)}>
                  {LANGS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </Select>
              </FilterField>
              <FilterField label="Period">
                <Select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  {PERIODS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </Select>
              </FilterField>
              <FilterField label="Month">
                <Select value={month} onChange={(e) => setMonth(e.target.value)}>
                  {MONTHS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </Select>
              </FilterField>
            </div>

            {/* view toggle */}
            <div className="inline-flex rounded-full border border-ink/15 bg-paper p-1">
              {(
                [
                  { k: "chart", icon: BarChart3, label: "Chart" },
                  { k: "table", icon: Table2, label: "Table" },
                ] as const
              ).map(({ k, icon: Icon, label }) => (
                <button
                  key={k}
                  onClick={() => setView(k)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors",
                    view === k
                      ? "bg-ink text-paper"
                      : "text-ink/55 hover:text-ink"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* report card */}
          <Reveal delay={80} className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-editorial">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/10 bg-paper-2/60 px-6 py-5">
              <div>
                <p className="eyebrow">Report</p>
                <h2 className="mt-1.5 font-display text-lg font-bold tracking-tight sm:text-xl">
                  {tableTitle}
                </h2>
              </div>
              <Logo className="hidden shrink-0 scale-90 sm:inline-flex" />
            </div>

            {/* sort controls */}
            <div className="flex flex-wrap items-center gap-2 px-6 pt-5">
              <span className="mr-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-ink/45">
                Sort
              </span>
              {SORTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => toggleSort(s.key)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider transition-colors",
                    sort === s.key
                      ? "border-flame bg-flame/10 text-flame-dark"
                      : "border-ink/15 text-ink/55 hover:border-ink/40"
                  )}
                >
                  {s.label}
                  {sort === s.key &&
                    (desc ? (
                      <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUp className="h-3 w-3" />
                    ))}
                </button>
              ))}
            </div>

            <div className="p-6">
              {view === "chart" ? (
                <ol className="space-y-3.5">
                  {sorted.map((row, i) => {
                    const leader = i === 0;
                    return (
                      <li key={row.channel} className="group flex items-center gap-4">
                        <span className="w-6 shrink-0 text-right font-mono text-xs font-bold text-ink/35">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="mb-1 flex items-baseline justify-between gap-3">
                            <span
                              className={cn(
                                "text-sm font-semibold tracking-tight",
                                leader ? "text-flame-dark" : "text-ink/85"
                              )}
                            >
                              {row.channel}
                            </span>
                            <span className="tabular font-mono text-xs text-ink/55">
                              {sort === "subscribers"
                                ? `${row.subscribers.toFixed(1)}M subs`
                                : sort === "share"
                                  ? row.share
                                  : `${row.views.toFixed(1)}M`}
                            </span>
                          </div>
                          <div className="h-3 w-full overflow-hidden rounded-full bg-ink/[0.07]">
                            <div
                              className={cn(
                                "h-full rounded-full transition-[width] duration-700 ease-out",
                                leader
                                  ? "bg-gradient-to-r from-flame to-amber"
                                  : "bg-gradient-to-r from-navy to-navy-light"
                              )}
                              style={{
                                width: `${
                                  ((sort === "subscribers"
                                    ? row.subscribers
                                    : sort === "share"
                                      ? shareNum(row.share)
                                      : row.views) /
                                    (sort === "subscribers"
                                      ? Math.max(
                                          ...NEWS_STATS.map((s) => s.subscribers)
                                        )
                                      : sort === "share"
                                        ? Math.max(
                                            ...NEWS_STATS.map((s) =>
                                              shareNum(s.share)
                                            )
                                          )
                                        : maxViews)) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b-2 border-ink text-left">
                        <th className="px-4 py-3 font-mono text-[0.7rem] font-bold uppercase tracking-wider text-ink/55">
                          Channel
                        </th>
                        <SortableTh
                          active={sort === "subscribers"}
                          desc={desc}
                          onClick={() => toggleSort("subscribers")}
                        >
                          Subscribers (Million)
                        </SortableTh>
                        <SortableTh
                          active={sort === "views"}
                          desc={desc}
                          onClick={() => toggleSort("views")}
                        >
                          #Views (Million)
                        </SortableTh>
                        <SortableTh
                          active={sort === "share"}
                          desc={desc}
                          onClick={() => toggleSort("share")}
                        >
                          #Views Share
                        </SortableTh>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((row, i) => (
                        <tr
                          key={row.channel}
                          className={cn(
                            "border-b border-ink/10 transition-colors hover:bg-flame/5",
                            i === 0 && desc && sort === "views" && "bg-amber/10"
                          )}
                        >
                          <td className="px-4 py-2.5 font-semibold text-ink">
                            {row.channel}
                          </td>
                          <td className="tabular px-4 py-2.5 font-mono text-ink/75">
                            {row.subscribers.toFixed(1)}
                          </td>
                          <td className="tabular px-4 py-2.5 font-mono text-ink/75">
                            {row.views.toFixed(1)}
                          </td>
                          <td className="tabular px-4 py-2.5 font-mono text-ink/75">
                            {row.share}
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-ink font-bold text-ink">
                        <td className="px-4 py-3 font-display">Grand Total</td>
                        <td className="tabular px-4 py-3 font-mono">
                          {NEWS_STATS_TOTAL.subscribers.toFixed(1)}
                        </td>
                        <td className="tabular px-4 py-3 font-mono">
                          {NEWS_STATS_TOTAL.views.toFixed(1)}
                        </td>
                        <td className="tabular px-4 py-3 font-mono">
                          {NEWS_STATS_TOTAL.share}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-5 text-xs text-ink/50 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-md">
                  Note: Stats as of Oct 5 for all videos uploaded in September,
                  2024 including incremental views on long running streams. Share
                  computed among channels listed above.
                </p>
                <div className="space-y-0.5 font-mono sm:text-right">
                  <p>thedatabeings.com · @DataBeings</p>
                  <p>contact@thedatabeings.com</p>
                </div>
              </div>
            </div>
          </Reveal>

          <p className="mt-6 text-center text-sm text-ink/60">
            Note: Monthly stats available from May 2021 and Weekly from 21 Aug,
            2021 (Wk 34, 2021) onwards
          </p>
          <p className="mt-2 text-center font-mono text-xs font-bold uppercase tracking-wider text-ink/70 md:hidden">
            Please switch to landscape mode if you are viewing this on mobile.
          </p>
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

function SortableTh({
  children,
  active,
  desc,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  desc: boolean;
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3">
      <button
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 font-mono text-[0.7rem] font-bold uppercase tracking-wider transition-colors",
          active ? "text-flame-dark" : "text-ink/55 hover:text-ink"
        )}
      >
        {children}
        {active &&
          (desc ? (
            <ArrowDown className="h-3 w-3" />
          ) : (
            <ArrowUp className="h-3 w-3" />
          ))}
      </button>
    </th>
  );
}
