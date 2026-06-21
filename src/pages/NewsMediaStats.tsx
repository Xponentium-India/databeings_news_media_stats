import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Select } from "@/components/ui/select";
import {
  NEWS_STATS,
  NEWS_STATS_TOTAL,
} from "@/data/content";

const LANGS = ["English", "Hindi"];
const PERIODS = ["Monthly", "Weekly"];
const MONTHS = ["Sep", "Aug", "Jul", "Jun"];

export default function NewsMediaStats() {
  const [lang, setLang] = useState("English");
  const [period, setPeriod] = useState("Monthly");
  const [month, setMonth] = useState("Sep");

  const monthLong: Record<string, string> = {
    Sep: "September",
    Aug: "August",
    Jul: "July",
    Jun: "June",
  };

  const tableTitle = `${lang} News YouTube ${period} Stats — ${monthLong[month]}, 2024`;

  return (
    <section className="bg-white pt-28 md:pt-32">
      <div className="container pb-20">
        <header className="max-w-3xl">
          <h1 className="display-heading text-3xl sm:text-4xl">
            News Media Stats
          </h1>
          <p className="mt-3 text-ink/65">
            YouTube Viewership stats for major English &amp; Hindi News Channels
          </p>
        </header>

        {/* framed stats panel */}
        <div className="mt-10 overflow-hidden rounded-xl bg-cream p-4 sm:p-6">
          {/* filters */}
          <div className="flex flex-wrap items-center gap-4 px-1 pb-5">
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              Lang:
              <Select value={lang} onChange={(e) => setLang(e.target.value)}>
                {LANGS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              Period:
              <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
                {PERIODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
            </label>
            <Select value={month} onChange={(e) => setMonth(e.target.value)}>
              {MONTHS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Select>
          </div>

          {/* table card */}
          <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-base font-bold text-ink sm:text-lg">
                {tableTitle}
              </h2>
              <Logo className="hidden shrink-0 scale-90 sm:inline-flex" />
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#6FA94B] text-left text-white">
                    <th className="px-4 py-2.5 font-semibold">Channel</th>
                    <th className="px-4 py-2.5 font-semibold">
                      Subscribers (Million)
                    </th>
                    <th className="px-4 py-2.5 font-semibold">#Views (Million)</th>
                    <th className="px-4 py-2.5 font-semibold">#Views Share</th>
                  </tr>
                </thead>
                <tbody>
                  {NEWS_STATS.map((row, i) => (
                    <tr
                      key={row.channel}
                      className={i % 2 === 0 ? "bg-white" : "bg-muted/60"}
                    >
                      <td className="border-b border-border px-4 py-2 text-ink">
                        {row.channel}
                      </td>
                      <td className="border-b border-border px-4 py-2 text-ink/80">
                        {row.subscribers.toFixed(1)}
                      </td>
                      <td className="border-b border-border px-4 py-2 text-ink/80">
                        {row.views.toFixed(1)}
                      </td>
                      <td className="border-b border-border px-4 py-2 text-ink/80">
                        {row.share}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-cream font-bold text-ink">
                    <td className="px-4 py-2.5">Grand Total</td>
                    <td className="px-4 py-2.5">
                      {NEWS_STATS_TOTAL.subscribers.toFixed(1)}
                    </td>
                    <td className="px-4 py-2.5">
                      {NEWS_STATS_TOTAL.views.toFixed(1)}
                    </td>
                    <td className="px-4 py-2.5">{NEWS_STATS_TOTAL.share}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md">
                Note: Stats as of Oct 5 for all videos uploaded in September, 2024
                including incremental views on long running streams. Share
                computed among channels listed above.
              </p>
              <div className="space-y-0.5 text-right">
                <p>thedatabeings.com · @DataBeings</p>
                <p>contact@thedatabeings.com</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-ink/70">
            Note: Monthly stats available from May 2021 and Weekly from 21 Aug,
            2021 (Wk 34, 2021) onwards
          </p>
          <p className="mt-2 text-center text-sm font-semibold text-ink">
            Please switch to landscape mode if you are viewing this on mobile.
          </p>
        </div>
      </div>
    </section>
  );
}
