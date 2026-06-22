import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import { authRouter } from "./routes/auth.js";
import { statsRouter } from "./routes/stats.js";
import { UPLOAD_DIR } from "./storage.js";

const app = express();

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// uploaded images
app.use("/uploads", express.static(UPLOAD_DIR));

// health check (no DB)
app.get("/api/health", (_req, res) =>
  res.json({ ok: true, sessionMinutes: config.sessionMinutes })
);

app.use("/api/auth", authRouter);
app.use("/api/stats", statsRouter); // GET public; POST/DELETE guarded inside
app.use("/api/admin/stats", statsRouter); // alias for admin-namespaced calls

// multer / generic error handler
app.use((err, _req, res, _next) => {
  console.error("[error]", err.message);
  res.status(err.status || 400).json({ error: err.message || "Request failed" });
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
