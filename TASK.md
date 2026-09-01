# Task

Redesign and rebuild the personal homepage/portfolio of Alex Petrachuk.

Domains:

- petrachuk.com (primary/canonical)
- petrachuk.ru (RU-facing; see domain routing note below)

---

## Context

The previous site (`en/index.html`, `ru/index.html`, `css/site.css`) was a
hand-built Bootstrap 5 dark-theme page the owner made himself without a web
design background. It worked and its information architecture was sound, but
it looked dated and was never SEO/perf-tuned beyond the basics. Those files
were deleted from the working tree once the rebuild replaced them; they remain
the content baseline of record in git history, last present in commit
`3dbb304` (`git show 3dbb304:en/index.html`). This task
replaces the visual design and technical implementation while keeping the
content (résumé facts, project list, social links) essentially intact.

"Essentially intact" means: migration must preserve the factual meaning of
the existing EN/RU pages. Restructuring, shortening, and improving wording is
fine; adding claims, technologies, responsibilities, achievements, dates,
employers, metrics, or any other fact not present in the source is not — see
`CLAUDE.md` Core principles for the full rule. This matters because it's the
easiest way for an AI-assisted rewrite to quietly turn "worked with Kafka"
into "designed and implemented a highly scalable distributed Kafka-based
architecture."

Design direction: uses [brittanychiang.com](https://brittanychiang.com/) /
[v4.brittanychiang.com](https://v4.brittanychiang.com/) only as a reference
for structural/interaction patterns — not as a template to reskin — executed
with this ecosystem's own palette and type. Full detail in
`../DESIGN-SYSTEM.md` §2 and `CLAUDE.md` in this repo — this document is the
project-management-shaped task breakdown; those two are the design/technical
spec. Read all three before starting implementation.

---

## Before implementation

Before writing any code, read `TASK.md` (this file), `CLAUDE.md`, and
`../DESIGN-SYSTEM.md` end-to-end and do an architecture review pass: look
for contradictions, gaps, or ambiguities across the three documents, and
propose resolutions. Do not edit files or write code during this pass — it's
a review, not a start on implementation. Once the open questions below are
resolved and this spec is confirmed as v1, begin implementation, and fold
any resolved decisions back into these docs so they don't drift from what
actually got built.

---

## Primary goals

1. Modern, credible-looking personal site that reflects a senior
   backend/infra engineer's standards.
2. Full EN/RU bilingual parity, SEO-optimized for both languages.
3. Fast, accessible, static — no framework runtime cost.
4. Content stays data-driven and easy for the owner (non-frontend-expert) to
   update later via Claude Code without touching layout code.
5. Clean handoff point to `petrachuk.dev` for the fuller project catalog.

---

## Content migration map

Source of truth for content: the legacy `en/index.html` and `ru/index.html`,
now in git history (see Context above).
Do not invent new career facts — extract and restructure what's already
written.

| Current section | New structure |
|---|---|
| `#leftBlock` (name, title, pitch, nav, social icons) | Sidebar/intro component, scroll-spy nav |
| `#about` | About copy, plain localized Markdown/MDX per locale — **not** a content collection (see `CLAUDE.md` Content architecture) |
| `#experience` (6 role entries) | Experience content collection, 1 entry per role with a stable ID shared by its EN and RU version (schema detail in `CLAUDE.md` Content architecture) |
| `#projects` (AuthCore, NetBridge) | Projects content collection, same stable-ID-per-entry pattern as Experience — **only 2–3 curated entries here**; full catalog moves conceptually to `petrachuk.dev` |
| Footer colophon | Update to reflect new stack; keep "built by hand, not a template" spirit |
| JSON-LD `ProfilePage`/`Person` | Carry forward, validate, update dates |
| Yandex Metrika snippet | Conditional — confirm with owner whether to keep it at all; if kept, load in the least render-blocking way possible (see `CLAUDE.md` SEO requirements) |

---

## Scope

### In scope

- Full visual redesign of the single-page layout (both locales).
- Astro rebuild replacing Bootstrap/vanilla-JS implementation.
- Content collections for Experience and Projects (see `CLAUDE.md`).
- New language-switcher component (fixes current mobile overlap issue).
- SEO metadata overhaul: hreflang, per-locale OG/Twitter tags, sitemap,
  robots.txt update, JSON-LD validation.
- Accessibility fixes to the current "whole-card-is-a-link" pattern (see
  `CLAUDE.md` Accessibility requirements).
- Self-hosted font subsetting (EN+RU) replacing the Google Fonts CDN call.
- GitHub Actions build pipeline.

### Out of scope (flagged, not blocking this task)

- Redesigning `SiporaWebsite` — untouched, referenced only for style
  continuity in `../DESIGN-SYSTEM.md`.
- Actual DNS/nginx redirect configuration for `petrachuk.ru` → `petrachuk.com`
  — this task assumes that routing (see below) but implementing the redirect
  itself is an infrastructure change outside this repo; confirm with the
  owner and hand off to whoever manages DNS/nginx before flipping it live.
- A CMS, contact form backend, or any server-side feature.
- Light theme.

---

## Domain routing (confirmed)

- `petrachuk.com/en/` → English
- `petrachuk.com/ru/` → Russian
- `petrachuk.com/` → neither: a `noindex` language-selection stub that
  redirects to `/en/` or `/ru/`. English was moved off the bare root once
  automatic language selection became a requirement — `/` cannot be both the
  canonical English URL and a visitor-dependent entry point. `hreflang`
  alternates run between `/en/` and `/ru/`, with `x-default` → `/en/`; `/` is
  never an hreflang or canonical target.
- `petrachuk.ru/*` → already 301-redirects to `petrachuk.com` via nginx
  (existing setup, confirmed by owner). Whether to later make it
  locale-aware (`petrachuk.ru/*` → `petrachuk.com/ru/*`) is an open
  SEO/UX question, not a requirement of this task — see
  `../DESIGN-SYSTEM.md` §7. **Domain redirects are an infrastructure
  concern and must not be modified as part of this task.**

---

## Milestones

1. **Design system pass** — apply `../DESIGN-SYSTEM.md` tokens as Tailwind v4
   `@theme` CSS tokens in this repo (colors, type scale, spacing) — no
   legacy `tailwind.config.js/ts`; build the shared primitives (section
   heading w/ numbering, nav link, tag pill, button variants) in isolation
   before wiring up real content.
2. **Content collections** — migrate Experience and Projects data into typed
   Astro content collections (stable ID per entity, both locales linked to
   it — see `CLAUDE.md` Content architecture); migrate About copy as plain
   localized Markdown/MDX, not a collection.
3. **Layout build** — sidebar/intro, scroll-spy nav, language switcher,
   Experience timeline, Projects section, footer. Both locales rendering from
   the same components/content collections.
4. **SEO pass** — hreflang, per-locale metadata, JSON-LD, sitemap, robots.txt,
   one static OG image (no dynamic per-page OG generation).
5. **QA** — Lighthouse (mobile) on both locales, keyboard-only pass,
   `prefers-reduced-motion` check, RU string-length layout check, structured
   data validator.
6. **Build (CI) + hand off for deploy** — GitHub Actions runs install,
   typecheck, and build, producing a `dist/` artifact. That's the boundary of
   this milestone. How `dist/` reaches the nginx host on the owner's home
   Ubuntu server is a separate infrastructure decision — see
   `../DESIGN-SYSTEM.md` §7 "Hosting" — and is not designed as part of this
   task.

---

## Open questions for the owner (not blocking design/build start, but needed before ship)

- Deploy mechanics: how should the built `dist/` artifact actually reach the
  nginx docroot on the home server (self-hosted Actions runner, exposed
  SSH/rsync, tunnel, manual copy)? Plus: the docroot path for this site, and
  how the current site gets deployed today. This is an infrastructure
  decision, not something to default into during the site build (see
  `../DESIGN-SYSTEM.md` §7 "Hosting").
- Whether to keep Yandex Metrika on the redesigned site at all.
- Whether to keep the "battle royale games" custom-cursor easter egg from the
  About copy, or drop it in the new visual system. Its cursor asset was kept
  and moved to `public/images/fortnite.png`; nothing references it yet.
- Whether profile photos (`public/images/alex*.jpg`) should appear anywhere in the
  new layout (current design uses them only in JSON-LD, not visually) or stay
  metadata-only.

### Resolved during M5

- JSON-LD `dateModified` (`profileDates.modified` in `src/data/seo.ts`): the
  legacy value stays untouched through M5 and is set **in M6, by hand, to the
  date the redesigned site actually goes live**. It remains a manually
  maintained constant after that — never a build or deploy timestamp.
