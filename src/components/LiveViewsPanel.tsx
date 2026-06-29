import { useState, useEffect, useMemo } from "react";

// Theme tokens (mirrors tailwind.config.js)
const T = {
  ink:       "#16130D",
  ink2:      "#241F16",
  ink3:      "#3A3326",
  paper:     "#F4EFE3",
  flame:     "#E8772E",
  flameDark: "#CC5F1B",
  flameSoft: "#F2A668",
  gold:      "#F2C94C",
};

// ─── 1. DATA ─────────────────────────────────────────────────────────────────
const CHANNELS = [
  { name: "Firstpost",   base: 91.0 },
  { name: "CNN-News18",  base: 73.8 },
  { name: "NDTV 24x7",  base: 66.2 },
  { name: "ANI news",   base: 60.2 },
  { name: "WION",       base: 52.2 },
  { name: "Times Now",  base: 49.1 },
];

// ─── 2. HISTORY GENERATOR ────────────────────────────────────────────────────
function generateHistory(base: number, points = 24): number[] {
  let v = base;
  return Array.from({ length: points }, () => {
    v += (Math.random() - 0.48) * base * 0.012;
    v = Math.max(base * 0.90, Math.min(base * 1.10, v));
    return v;
  });
}

// ─── 3. SPARKLINE COMPONENT ──────────────────────────────────────────────────
interface SparklineProps {
  history: number[];
  width?: number;
  height?: number;
  id: string;
}

function smoothPath(pts: number[][]): string {
  if (pts.length < 2) return "";
  const d: string[] = [`M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 5;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 5;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 5;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 5;
    d.push(`C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`);
  }
  return d.join(" ");
}

function Sparkline({ history, width = 150, height = 50, id }: SparklineProps) {
  if (!history || history.length < 2) return null;

  const pad = 4;
  const lo  = Math.min(...history);
  const hi  = Math.max(...history);
  const rng = hi - lo || 1;

  const pts = history.map((v, i) => [
    (i / (history.length - 1)) * width,
    height - pad - ((v - lo) / rng) * (height - pad * 2),
  ]);

  const linePath = smoothPath(pts);
  const [lastX, lastY] = pts[pts.length - 1];
  const areaPath = `${linePath} L${lastX.toFixed(2)},${height.toFixed(2)} L0,${height.toFixed(2)} Z`;

  const isUp   = history[history.length - 1] >= history[history.length - 2];
  const color  = isUp ? "#22c55e" : "#ef4444";
  const gradId = `spark-grad-${id}`;

  return (
    <svg width={width} height={height} style={{ overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX.toFixed(2)} cy={lastY.toFixed(2)} r="5" fill={color} opacity="0.25" />
      <circle cx={lastX.toFixed(2)} cy={lastY.toFixed(2)} r="3" fill={color} />
    </svg>
  );
}

// ─── 4. MAIN PANEL COMPONENT ─────────────────────────────────────────────────
interface LiveChannel {
  name: string;
  base: number;
  val: number;
  hist: number[];
}

export function LiveViewsPanel() {
  const [channels, setChannels] = useState<LiveChannel[]>(() =>
    CHANNELS.map(ch => ({
      ...ch,
      val:  ch.base,
      hist: generateHistory(ch.base),
    }))
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setChannels(prev =>
        prev.map(ch => {
          const drift  = (Math.random() - 0.49) * ch.base * 0.015;
          const newVal = Math.max(
            ch.base * 0.90,
            Math.min(ch.base * 1.10, ch.val + drift)
          );
          return { ...ch, val: newVal, hist: [...ch.hist.slice(1), newVal] };
        })
      );
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const maxVal = useMemo(() => Math.max(...channels.map(c => c.val)), [channels]);
  const total  = useMemo(() => channels.reduce((sum, c) => sum + c.val, 0), [channels]);

  return (
    <div style={{
      background:   T.ink2,
      borderRadius: 16,
      padding:      "20px 24px",
      width:        "100%",
      maxWidth:     540,
      fontFamily:   "sans-serif",
      color:        T.paper,
      border:       `1px solid ${T.ink3}`,
    }}>
      {/* Header */}
      <div style={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        marginBottom:   20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="h-2 w-2 rounded-full bg-flame animate-pulse" />
          <span style={{ fontSize: 11, letterSpacing: 2, color: T.flameSoft, fontWeight: 600 }}>
            LIVE · YOUTUBE VIEWS
          </span>
        </div>
        <span style={{ fontSize: 11, color: T.ink3, opacity: 0.8 }}>Million / mo</span>
      </div>

      {/* Channel rows */}
      {channels.map(ch => {
        const pct  = (ch.val / maxVal) * 100;
        const isUp = ch.val >= ch.hist[ch.hist.length - 2];

        return (
          <div key={ch.name} style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
              <span className="font-display font-bold text-lg" style={{ flex: 1, color: T.paper }}>
                {ch.name}
              </span>

              <Sparkline history={ch.hist} width={200} height={48} id={ch.name} />

              <span style={{
                fontSize: 14,
                color:    isUp ? "#22c55e" : "#ef4444",
                margin:   "0 10px",
              }}>
                {isUp ? "▲" : "▼"}
              </span>

              <span style={{
                fontSize:           20,
                fontWeight:         700,
                color:              T.gold,
                minWidth:           70,
                textAlign:          "right",
                fontVariantNumeric: "tabular-nums",
              }}>
                {ch.val.toFixed(1)}M
              </span>
            </div>

            {/* Progress bar */}
            <div style={{ height: 5, background: T.ink, borderRadius: 3 }}>
              <div style={{
                height:       "100%",
                width:        `${pct}%`,
                background:   `linear-gradient(to right, ${T.flameDark}, ${T.gold})`,
                borderRadius: 3,
                transition:   "width 0.8s ease",
              }} />
            </div>
          </div>
        );
      })}

      {/* Total box */}
      <div style={{
        background:   `linear-gradient(135deg, ${T.flameDark}, ${T.flame})`,
        borderRadius: 10,
        padding:      "12px 18px",
        display:      "flex",
        alignItems:   "center",
        gap:          14,
        marginTop:    6,
      }}>
        <span style={{
          fontSize:           32,
          fontWeight:         800,
          fontVariantNumeric: "tabular-nums",
          color:              T.paper,
        }}>
          {total.toFixed(1)}M
        </span>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: T.paper }}>
            VIEWS TRACKED / MO
          </div>
          <div style={{ fontSize: 10, color: T.paper, opacity: 0.65 }}>
            live sample · updates every 2s
          </div>
        </div>
      </div>
    </div>
  );
}
