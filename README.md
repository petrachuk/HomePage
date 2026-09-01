# petrachuk.com

Personal homepage and portfolio of Alexei Petrachuk — a bilingual (EN/RU),
statically generated single-page site.

- `/en/` and `/ru/` are the two indexable content routes.
- `/` is a `noindex` stub that picks a language client-side and redirects.

## Stack

Astro (static output), TypeScript in strict mode, Tailwind CSS v4 configured
CSS-first via `@theme`. Experience and Projects live in Astro content
collections, one entry per role/project with an EN and a RU file. Fonts are
self-hosted and subset to Latin + Cyrillic.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run check` | `astro check` plus a content-collection validator |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built `dist/` |
| `npm run format` | Prettier |

Node 22.12 or newer (see `.nvmrc`).

## Where things are

- `src/i18n/routes.ts` — the single source of locale URLs. Canonical,
  hreflang, `og:url`, the sitemap and the language switcher all resolve
  through it.
- `src/data/links.ts` — the single source of social/outbound URLs.
- `src/components/Seo.astro` — the entire `<head>` for both content routes.
- `src/content/` — Experience and Projects entries.
- `src/content-pages/about/` — About copy per locale.

`CLAUDE.md` is the authoritative spec for this repo; `TASK.md` tracks the
rebuild milestones.
