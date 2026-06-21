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

# databeings_news_media_stats
