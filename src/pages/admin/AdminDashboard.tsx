import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ImagePlus, Loader2, LogIn, Trash2, UploadCloud, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/auth/AuthProvider";
import { api, assetUrl, type StatImage } from "@/lib/api";
import { Link } from "react-router-dom";

const LANGUAGES = ["English", "Hindi"];
const REPORT_TYPES = ["youtube_report", "instagram_report", "x_report", "news_report"];
const PERIODS = ["Monthly", "Weekly"] as const;
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const CURRENT_YEAR = 2025;
const YEARS = [CURRENT_YEAR + 1, CURRENT_YEAR, CURRENT_YEAR - 1, CURRENT_YEAR - 2];

export default function AdminDashboard() {
  const { user } = useAuth();

  const [language, setLanguage] = useState("English");
  const [customLanguage, setCustomLanguage] = useState("");
  const [reportType, setReportType] = useState("news_report");
  const [customReportType, setCustomReportType] = useState("");
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Monthly");
  const [year, setYear] = useState(String(CURRENT_YEAR));
  const [monthOrWeek, setMonthOrWeek] = useState("Jan");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [items, setItems] = useState<StatImage[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // when the period flips, reset the month/week to a sensible default
  useEffect(() => {
    setMonthOrWeek(period === "Monthly" ? "Jan" : "Week1");
  }, [period]);

  const loadList = async () => {
    setLoadingList(true);
    try {
      const { items } = await api.listStats();
      setItems(items);
    } catch {
      /* ignore */
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMsg({ kind: "err", text: "Please choose an image to upload." });
      return;
    }
    const finalLanguage = language === "Other" ? customLanguage : language;
    const finalReportType = reportType === "Other" ? customReportType : reportType;
    if (!finalLanguage.trim()) {
      setMsg({ kind: "err", text: "Please specify a language." });
      return;
    }
    if (!finalReportType.trim()) {
      setMsg({ kind: "err", text: "Please specify a report type." });
      return;
    }

    setBusy(true);
    setMsg(null);
    try {
      const form = new FormData();
      form.append("language", finalLanguage);
      form.append("period", period);
      form.append("year", year);
      form.append("month_or_week", monthOrWeek);
      form.append("report_type", finalReportType);
      form.append("image", file);
      await api.uploadStat(form);
      setMsg({
        kind: "ok",
        text: `Saved ${finalLanguage} · ${period} · ${monthOrWeek} ${year} · ${finalReportType}.`,
      });
      setFile(null);
      if (language === "Other") setCustomLanguage("");
      if (reportType === "Other") setCustomReportType("");
      await loadList();
    } catch (err) {
      setMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Upload failed",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this report image?")) return;
    try {
      await api.deleteStat(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setMsg({
        kind: "err",
        text: err instanceof Error ? err.message : "Delete failed",
      });
    }
  };

  return (
    <div className="container py-10 md:py-14">
      {/* header + login-count stat */}
      <div className="flex flex-col gap-6 border-b border-ink/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {user?.name || "admin"}
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Upload the report images shown on the public News Media Stats page.
          </p>
        </div>
        <div className="flex gap-4">
          <Stat label="Times logged in" value={user?.loginCount ?? 0} icon={<LogIn className="h-4 w-4" />} />
          <Stat label="Reports stored" value={items.length} icon={<ImagePlus className="h-4 w-4" />} />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        {/* upload form */}
        <form
          onSubmit={handleSubmit}
          className="h-fit rounded-2xl border border-ink/10 bg-white/60 p-6 shadow-editorial sm:p-7"
        >
          <h2 className="font-display text-xl font-bold tracking-tight">
            Manage report
          </h2>

          {msg && (
            <p
              className={`mt-4 rounded-lg px-4 py-2.5 text-sm ${
                msg.kind === "ok"
                  ? "border border-green-600/30 bg-green-600/10 text-green-700"
                  : "border border-flame/40 bg-flame/10 text-flame-dark"
              }`}
            >
              {msg.text}
            </p>
          )}

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Labeled label="Language">
              <Select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full">
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
                <option value="Other">Other...</option>
              </Select>
            </Labeled>

            <Labeled label="Report Type">
              <Select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full">
                {REPORT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
                <option value="Other">Other...</option>
              </Select>
            </Labeled>

            {language === "Other" && (
              <Labeled label="Custom Language">
                <Input
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  placeholder="e.g. Bangla, Marathi"
                  required
                  className="font-sans"
                />
              </Labeled>
            )}

            {reportType === "Other" && (
              <Labeled label="Custom Report Type">
                <Input
                  value={customReportType}
                  onChange={(e) => setCustomReportType(e.target.value)}
                  placeholder="e.g. facebook_report"
                  required
                  className="font-sans"
                />
              </Labeled>
            )}

            <Labeled label="Weekly or Monthly">
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value as (typeof PERIODS)[number])}
                className="w-full"
              >
                {PERIODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
            </Labeled>
            <Labeled label="Year">
              <Select value={year} onChange={(e) => setYear(e.target.value)} className="w-full">
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </Select>
            </Labeled>
            <Labeled label={period === "Monthly" ? "Month" : "Week"}>
              {period === "Monthly" ? (
                <Select
                  value={monthOrWeek}
                  onChange={(e) => setMonthOrWeek(e.target.value)}
                  className="w-full"
                >
                  {MONTHS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </Select>
              ) : (
                <Input
                  value={monthOrWeek}
                  onChange={(e) => setMonthOrWeek(e.target.value)}
                  placeholder="Week1"
                  required
                />
              )}
            </Labeled>
          </div>

          {/* file picker */}
          <div className="mt-5">
            <span className="mb-1 block font-mono text-[0.65rem] font-bold uppercase tracking-wider text-ink/55">
              Image
            </span>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/20 bg-paper/60 px-4 py-8 text-center transition-colors hover:border-flame">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="max-h-40 rounded-lg object-contain"
                />
              ) : (
                <>
                  <UploadCloud className="h-7 w-7 text-ink/40" />
                  <span className="text-sm text-ink/65">
                    Click to choose an image (PNG, JPG, WEBP · ≤ 8 MB)
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {file && (
              <p className="mt-2 font-mono text-xs text-ink/55">{file.name}</p>
            )}
          </div>

          <Button type="submit" variant="flame" className="mt-6 w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {busy ? "Uploading…" : "Upload report"}
          </Button>
          <p className="mt-3 text-center font-mono text-[0.65rem] text-ink/45">
            Re-uploading the same slot replaces the previous image.
          </p>
        </form>

        {/* uploaded list */}
        <div>
          <div className="flex items-center justify-between">
            <Link
              to="/admin/reports"
              className="group flex items-center gap-1.5 font-display text-xl font-bold tracking-tight text-ink hover:text-flame transition-colors"
            >
              Uploaded reports
              <ArrowRight className="h-4 w-4 text-ink/35 transition-transform group-hover:translate-x-1 group-hover:text-flame" />
            </Link>
            <span className="font-mono text-xs text-ink/45">
              {items.length} total
            </span>
          </div>

          {loadingList ? (
            <div className="mt-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-ink/40" />
            </div>
          ) : items.length === 0 ? (
            <p className="mt-10 rounded-xl border border-dashed border-ink/20 bg-white/50 px-6 py-12 text-center text-sm text-ink/55">
              No reports uploaded yet. Add your first one on the left.
            </p>
          ) : (
            <ul className="mt-5 space-y-3">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-4 rounded-xl border border-ink/10 bg-white/60 p-3 shadow-editorial"
                >
                  <a
                    href={assetUrl(it.imagePath)}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0"
                  >
                    <img
                      src={assetUrl(it.imagePath)}
                      alt={`${it.language} ${it.monthOrWeek}`}
                      className="h-14 w-20 rounded-lg border border-ink/10 bg-paper object-cover"
                    />
                  </a>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-1.5 font-display text-sm font-bold tracking-tight">
                      <span>{it.language}</span>
                      <span className="text-ink/30">·</span>
                      <span>{it.period}</span>
                      {it.reportType && (
                        <>
                          <span className="text-ink/30">·</span>
                          <span className="rounded bg-flame/10 px-1.5 py-0.5 font-mono text-[0.6rem] font-bold text-flame-dark uppercase tracking-wide">
                            {it.reportType}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="font-mono text-xs text-ink/55 mt-0.5">
                      {it.monthOrWeek} {it.year}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(it.id)}
                    aria-label="Delete"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink/55 transition-colors hover:border-flame hover:bg-flame hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white/60 px-5 py-3 text-center shadow-editorial">
      <span className="flex items-center justify-center gap-1.5 text-flame-dark">
        {icon}
        <span className="font-display text-2xl font-bold tabular">{value}</span>
      </span>
      <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-ink/50">
        {label}
      </p>
    </div>
  );
}

function Labeled({
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
