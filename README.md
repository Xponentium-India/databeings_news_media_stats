# databeings

Marketing site for **databeings** (Xponentium India LLP) — a redesign of
[thedatabeings.com](https://thedatabeings.com) rebuilt from WordPress into a
modern **Vite + React + TypeScript + Tailwind CSS** stack with shadcn-style UI
components. All original copy is preserved.

## Stack

- **Vite 6** + **React 18** + **TypeScript**
- **Tailwind CSS 3** with a custom databeings brand palette
- shadcn-style UI primitives (`Button`, `Input`, `Textarea`, `Card`, `Select`) —
  radix-free, built locally under `src/components/ui`
- **react-router-dom** for client-side routing
- **lucide-react** icons

## Pages

| Route                | Page             |
| -------------------- | ---------------- |
| `/`                  | Home             |
| `/services`          | Services         |
| `/contact`           | Contact          |
| `/news-media-stats`  | News Media Stats |
| `/terms`             | Terms & Conditions |

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
  components/      shared layout (Navbar, Footer, Logo) + sections
    ui/            shadcn-style primitives
  data/content.ts  centralized copy, imagery and stats data
  pages/           one file per route
```

Original design references are kept in `design-reference/`.

## Admin panel (`/admin`)

A separate **Node + Express + PostgreSQL** backend (in [`server/`](./server)) adds:

- **Google login** with **40-minute sessions** (httpOnly cookie, hard cap)
- **Login-count tracking** per admin
- **Image uploads** — admins upload report images shown on the public
  News Media Stats page

Routes: `/admin/login` (sign in) and `/admin` (dashboard, protected).

### Run locally (two terminals)

```bash
# 1) backend — see server/README.md for full setup
cd server && npm install && cp .env.example .env
createdb databeings && npm run db:setup
npm run dev                       # http://localhost:4000

# 2) frontend
npm run dev                       # http://localhost:5173  → open /admin
```

Copy `.env.example` → `.env.local` for the frontend (`VITE_GOOGLE_CLIENT_ID`,
`VITE_API_BASE`). Full backend + Google OAuth + deployment guide:
[`server/README.md`](./server/README.md).

## Deployment (Cloudflare Pages)

The frontend is a Vite SPA, so Cloudflare must build it — it cannot serve the
source directly. Configure the Pages project as:

| Setting                  | Value           |
| ------------------------ | --------------- |
| Build command            | `npm run build` |
| Build output directory   | `dist`          |
| Root directory           | *(blank)*       |

- **Client-side routing:** `public/_redirects` rewrites all paths to
  `index.html` (`200`) so deep links like `/news-media-stats` resolve.
- **Env vars:** set `VITE_API_BASE` (and `VITE_GOOGLE_CLIENT_ID`) as
  **build-time** variables — Vite inlines `VITE_*` at build, not runtime.

# databeings_news_media_stats
