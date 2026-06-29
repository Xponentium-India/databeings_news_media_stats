import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Search, Trash2, SlidersHorizontal, X, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { api, assetUrl, type StatImage } from "@/lib/api";

const PRESET_LANGUAGES = ["English", "Hindi"];
const PRESET_REPORT_TYPES = ["youtube_report", "instagram_report", "x_reprt", "news_re"];
const PERIODS = ["Monthly", "Weekly"];

export default function AdminReports() {
  const [items, setItems] = useState<StatImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("All");
  const [periodFilter, setPeriodFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [reportTypeFilter, setReportTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "oldest"

  const loadList = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { items } = await api.listStats();
      setItems(items);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) return;
    try {
      await api.deleteStat(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  // Get unique languages dynamically from data, merged with presets
  const languages = useMemo(() => {
    const list = new Set([...PRESET_LANGUAGES, ...items.map((it) => it.language)]);
    return Array.from(list).filter(Boolean).sort();
  }, [items]);

  // Get unique report types dynamically from data, merged with presets
  const reportTypes = useMemo(() => {
    const list = new Set([...PRESET_REPORT_TYPES, ...items.map((it) => it.reportType || "news_re")]);
    return Array.from(list).filter(Boolean).sort();
  }, [items]);

  // Get unique years dynamically from data
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(items.map((it) => it.year)));
    return uniqueYears.sort((a, b) => b - a);
  }, [items]);

  // Client-side filtering & searching logic
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Language Filter
    if (langFilter !== "All") {
      result = result.filter((it) => it.language.toLowerCase() === langFilter.toLowerCase());
    }

    // Period Filter
    if (periodFilter !== "All") {
      result = result.filter((it) => it.period.toLowerCase() === periodFilter.toLowerCase());
    }

    // Year Filter
    if (yearFilter !== "All") {
      result = result.filter((it) => String(it.year) === yearFilter);
    }

    // Report Type Filter
    if (reportTypeFilter !== "All") {
      result = result.filter((it) => (it.reportType || "news_re").toLowerCase() === reportTypeFilter.toLowerCase());
    }

    // Text Search
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (it) =>
          it.language.toLowerCase().includes(query) ||
          it.period.toLowerCase().includes(query) ||
          it.monthOrWeek.toLowerCase().includes(query) ||
          String(it.year).includes(query) ||
          (it.reportType && it.reportType.toLowerCase().includes(query))
      );
    }

    // Sorting
    result.sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return sortBy === "newest" ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [items, langFilter, periodFilter, yearFilter, reportTypeFilter, search, sortBy]);

  const hasActiveFilters =
    search !== "" ||
    langFilter !== "All" ||
    periodFilter !== "All" ||
    yearFilter !== "All" ||
    reportTypeFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setLangFilter("All");
    setPeriodFilter("All");
    setYearFilter("All");
    setReportTypeFilter("All");
  };

  return (
    <div className="container py-10 md:py-14">
      {/* Header section with back navigation */}
      <div className="flex flex-col gap-4 border-b border-ink/10 pb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            to="/admin"
            className="group inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-ink/65 hover:text-flame transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Manage reports
          </h1>
          <p className="mt-1.5 text-sm text-ink/60">
            Search, filter, and delete uploaded media stats reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-ink/10 bg-white/60 px-5 py-3 text-center shadow-editorial">
            <span className="flex items-center justify-center gap-1.5 text-flame-dark">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="font-display text-2xl font-bold tabular">{filteredItems.length}</span>
            </span>
            <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-ink/50">
              Reports Found
            </p>
          </div>
        </div>
      </div>

      {/* Filters and search panel */}
      <div className="mt-8 rounded-2xl border border-ink/10 bg-white/60 p-5 shadow-editorial">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <Input
              type="text"
              placeholder="Search by language, period, type, month..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 w-full border-b border-ink/15 focus-visible:border-flame font-sans"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filtering dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-ink/45" />
              <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-ink/55">
                Filters:
              </span>
            </div>

            {/* Language Filter */}
            <Select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Select>

            {/* Report Type Filter */}
            <Select
              value={reportTypeFilter}
              onChange={(e) => setReportTypeFilter(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Types</option>
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>

            {/* Period Filter */}
            <Select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Periods</option>
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>

            {/* Year Filter */}
            <Select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="All">All Years</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </Select>

            {/* Sort Order */}
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 text-xs"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </Select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="h-9 rounded-full border border-flame/30 text-flame hover:bg-flame/10"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-flame" />
            <p className="mt-3 text-sm text-ink/65">Loading reports...</p>
          </div>
        ) : errorMsg ? (
          <div className="rounded-xl border border-flame/20 bg-flame/5 p-6 text-center">
            <p className="text-sm font-semibold text-flame-dark">{errorMsg}</p>
            <Button onClick={loadList} className="mt-4">
              Retry
            </Button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink/20 bg-white/40 py-16 text-center shadow-editorial">
            <p className="text-sm text-ink/55">
              {hasActiveFilters
                ? "No reports match your filters and search criteria."
                : "No reports uploaded yet. Head back to the dashboard to upload."}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="mt-4 rounded-full border border-ink/25">
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((it) => (
              <div
                key={it.id}
                className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-white/60 p-4 shadow-editorial transition-all hover:-translate-y-1 hover:shadow-editorial-hover"
              >
                {/* Image Section */}
                <a
                  href={assetUrl(it.imagePath)}
                  target="_blank"
                  rel="noreferrer"
                  className="block aspect-[4/3] overflow-hidden rounded-xl border border-ink/10 bg-paper"
                >
                  <img
                    src={assetUrl(it.imagePath)}
                    alt={`${it.language} ${it.monthOrWeek}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </a>

                {/* Info Section */}
                <div className="mt-4 flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-block rounded-full bg-flame/10 px-2.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-flame-dark">
                        {it.language}
                      </span>
                      {it.reportType && (
                        <span className="inline-block rounded-full bg-ink/5 px-2.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider text-ink/65">
                          {it.reportType}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1.5 font-display text-sm font-bold tracking-tight text-ink">
                      {it.period}
                    </h3>
                    <p className="font-mono text-xs text-ink/55">
                      {it.monthOrWeek} {it.year}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(it.id)}
                    aria-label="Delete Report"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink/55 transition-colors hover:border-flame hover:bg-flame hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
