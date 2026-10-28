import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.js";
import { statsRouter } from "./routes/stats.js";
import { UPLOAD_DIR } from "./storage.js";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", config.trustProxy);

app.use((_req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  next();
});

app.use(
  cors({
    origin: config.clientOrigins,
    credentials: true,
  })
);

// CSRF guard: the session cookie is SameSite=None in prod, and multipart POSTs skip
// the CORS preflight, so reject state-changing requests sent from any other site.
// Browsers always send Origin on cross-site POST/DELETE; non-browser clients send none.
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
app.use((req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();
  const origin = req.headers.origin;
  if (!origin || config.clientOrigins.includes(origin)) return next();
  res.status(403).json({ error: "Cross-site request blocked" });
});

app.use(express.json());
app.use(cookieParser());

// uploaded images — never let the browser treat one as a page or script
app.use(
  "/uploads",
  express.static(UPLOAD_DIR, {
    setHeaders: (res) =>
      res.set("Content-Security-Policy", "default-src 'none'; sandbox"),
  })
);

// health check (no DB)
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, sessionMinutes: config.sessionMinutes })
);

app.use("/api/auth", authRouter);
app.use("/api/stats", statsRouter); // GET public; POST/DELETE guarded inside
app.use("/api/admin/stats", statsRouter); // alias for admin-namespaced calls

// multer / generic error handler — client errors keep their message, anything
// unexpected (e.g. a DB error) is logged and returned as a plain 500
app.use((err, _req, res, _next) => {
  let status = err.status || err.statusCode;
  if (err.name === "MulterError") status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
  if (!status || status >= 500) {
    console.error("[error]", err);
    return res.status(500).json({ error: "Internal server error" });
  }
  res.status(status).json({ error: err.message || "Request failed" });
});

const server = app.listen(config.port, () => {
  console.log(
    `[databeings api] http://localhost:${config.port}  ` +
      `(session ${config.sessionMinutes}m, dev-login ${config.allowDevLogin ? "ON" : "off"})`
  );
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `\n[databeings api] Port ${config.port} is already in use.\n` +
        `  Another server is probably still running. Free it with:\n` +
        `    lsof -nP -iTCP:${config.port} -sTCP:LISTEN     # find the PID\n` +
        `    kill <PID>                                    # stop it\n` +
        `  …or set a different PORT in server/.env\n`
    );
  } else {
    console.error("[databeings api] failed to start:", err.message);
  }
  process.exit(1);
});
