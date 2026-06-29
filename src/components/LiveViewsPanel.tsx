import { useState, useEffect, useMemo } from "react";

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
function generateHistory(base: number, points = 20): number[] {
  let v = base;
  return Array.from({ length: points }, () => {
    v *= 1 + (Math.random() - 0.5) * 0.025; // ±2.5% step each point
    return Math.max(base * 0.88, Math.min(base * 1.12, v));
  });
}

// ─── 3. SPARKLINE COMPONENT ──────────────────────────────────────────────────
interface SparklineProps {
  history: number[];
  width?: number;
  height?: number;
}

function Sparkline({ history, width = 150, height = 50 }: SparklineProps) {
  if (!history || history.length < 2) return null;

  const lo  = Math.min(...history);
  const hi  = Math.max(...history);
  const rng = hi - lo || 1;

  const pts = history.map((v, i) => [
    (i / (history.length - 1)) * width,
    height - ((v - lo) / rng) * (height - 8) - 4
  ]);

  const d = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const isUp  = history[history.length - 1] >= history[history.length - 2];
  const color = isUp ? "#4ade80" : "#f87171"; // green : red

  const [tipX, tipY] = pts[pts.length - 1];

  return (
    <svg width={width} height={height} style={{ overflow: "visible", display: "block" }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={tipX.toFixed(1)} cy={tipY.toFixed(1)} r="4" fill={color} />
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
            Math.min(
              ch.base * 1.10,
              ch.val + drift
            )
          );
          return {
            ...ch,
            val:  newVal,
            hist: [...ch.hist.slice(1), newVal],
          };
        })
      );
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  const maxVal = useMemo(() => Math.max(...channels.map(c => c.val)), [channels]);
  const total  = useMemo(() => channels.reduce((sum, c) => sum + c.val, 0), [channels]);

  return (
    <div style={{
      background:    "#17110a",
      borderRadius:  16,
      padding:       "20px 24px",
      width:         "100%",
      maxWidth:      540,
      fontFamily:    "sans-serif",
      color:         "#fff",
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
          <span style={{ fontSize: 11, letterSpacing: 2, color: "#777", fontWeight: 600 }}>
            LIVE · YOUTUBE VIEWS
          </span>
        </div>
        <span style={{ fontSize: 11, color: "#444" }}>Million / mo</span>
      </div>

      {/* Channel rows */}
      {channels.map(ch => {
        const pct  = (ch.val / maxVal) * 100;
        const isUp = ch.val >= ch.hist[ch.hist.length - 2];

        return (
          <div key={ch.name} style={{ marginBottom: 20 }}>
            <div style={{
              display:     "flex",
              alignItems:  "center",
              marginBottom: 8,
            }}>
              <span className="font-display font-bold text-lg" style={{ flex: 1, color: "#fff" }}>
                {ch.name}
              </span>

              <Sparkline history={ch.hist} width={200} height={50} />

              <span style={{
                fontSize:  16,
                color:     isUp ? "#4ade80" : "#f87171",
                margin:    "0 10px",
              }}>
                {isUp ? "▲" : "▼"}
              </span>

              <span style={{
                fontSize:          20,
                fontWeight:        700,
                color:             "#e8a020",
                minWidth:          70,
                textAlign:         "right",
                fontVariantNumeric: "tabular-nums",
              }}>
                {ch.val.toFixed(1)}M
              </span>
            </div>

            <div style={{
              height:       6,
              background:   "#1e1409",
              borderRadius: 3,
            }}>
              <div style={{
                height:     "100%",
                width:      `${pct}%`,
                background: "linear-gradient(to right, #e8621a, #f5b840)",
                borderRadius: 3,
                transition: "width 0.8s ease",
              }} />
            </div>
          </div>
        );
      })}

      {/* Total box */}
      <div style={{
        background:    "#e8621a",
        borderRadius:  10,
        padding:       "12px 18px",
        display:       "flex",
        alignItems:    "center",
        gap:           14,
        marginTop:     4,
      }}>
        <span style={{
          fontSize:           32,
          fontWeight:         800,
          fontVariantNumeric: "tabular-nums",
          color:              "#fff"
        }}>
          {total.toFixed(1)}M
        </span>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#fff" }}>
            VIEWS TRACKED / MO
          </div>
          <div style={{ fontSize: 10, opacity: 0.7, color: "#fff" }}>
            live sample · updates every 2s
          </div>
        </div>
      </div>
    </div>
  );
}
