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
6. **Build (CI) + hand off for deploy** — done, in
   `.github/workflows/build.yml`. GitHub Actions runs install,
   typecheck, and build, producing a `dist/` artifact. That's the boundary of
   this milestone. How `dist/` reaches the nginx host on the owner's home
   Ubuntu server is a separate infrastructure decision — see
   `../DESIGN-SYSTEM.md` §7 "Hosting" — and is not designed as part of this
   task.

---

## Open questions for the owner

All six milestones are built. Nothing below is a milestone or blocked on
further build work — each is a decision only the owner can make. This list is
the carry-forward record for later sessions: do not silently close an item,
and do not "fix" a deferred one without being asked.

### Blocks go-live

- **Deploy mechanics — docroot known, delivery still manual.** The site went
  live 2026-09-03 at `/var/www/HomePage` on the home server (confirmed via
  the live nginx config: `root /var/www/HomePage;` under the `petrachuk.com`
  server block, `sites-enabled/petrachuk.com`). First deploy was a manual
  copy of `dist/`'s contents; hit one snag — the top-level copied directory
  landed as `drw-r--r--` (no `x` anywhere, not even for the owning
  `www-data`), which blocks directory traversal and produced `stat() ...
  Permission denied` in `petrachuk.error.log` on every `/ru/`/`/en/`
  request. Fixed with `chmod 755 /var/www/HomePage`; not an nginx config
  problem — the `location /ru/`/`location /en/` blocks were already correct.
  Owner has said this will be automated later — CI still stops at the
  `dist/` artifact by design (see `../DESIGN-SYSTEM.md` §7 "Hosting"), and
  `.github/workflows/build.yml` must not acquire a delivery step until that
  automation decision is made.

### Content and presentation

- **OG image quality.** `public/images/alex16x9.jpg` is **667x375** — above
  the Open Graph minimum of 600x315 but well below the ideal 1200x630, so
  link previews upscale it. Recorded in `src/data/seo.ts` as an accepted
  trade-off shipped by owner decision; it has never been resolved as a
  quality question. Fixing it means a higher-resolution source image, which
  only the owner can supply. Note the other two crops are small for the same
  reason: `alex1x1.jpg` is 500x500 and `alex4x3.jpg` is 577x433. Do not
  regenerate or upscale any of them without being asked.
- **Profile photos in the layout.** Whether `public/images/alex*.jpg` should
  appear anywhere visually (the current design uses them only in JSON-LD and
  the OG tags) or stay metadata-only. Related to the item above — a decision
  to show a photo raises the resolution problem from "affects link previews"
  to "affects the page itself".
- **Yandex Metrika.** Whether to keep it on the redesigned site at all. Not
  architecturally required; it is currently not present in the rebuild.

### Known defects, deferred by decision

- **D3 — dead CSS utilities generated from prose.** Tailwind v4 scans the
  whole repository, so words in non-source files become real utilities in the
  shipped bundle. Two are present: `.truncate` (47 bytes, from the word in
  `CLAUDE.md`) and `.contents` (27 bytes, from `permissions: contents: read`
  in `.github/workflows/build.yml`, added in M6). Neither is referenced by
  anything in `src/`. The only fix is an `@source` directive in the CSS —
  i.e. a build-config change — which the owner deferred. Measured, not
  estimated: removing the workflow file takes the bundle from 17 739 to
  17 712 bytes.

  Practical consequence for anyone editing this repo: the wording of these
  very documents can change the shipped CSS. Writing this section originally
  added a third utility, from an ordinary English verb in the deploy bullet
  above, and the sentence was rephrased to remove it. Rebuild and compare
  `dist/` after editing any tracked Markdown file.

### Not a defect (recorded so it is not re-investigated)

- **Line endings.** The repo has no `.gitattributes` and `core.autocrlf=true`
  is set system-wide on the owner's Windows machine, so a fresh Windows clone
  checks out `robots.txt` and the font `OFL.txt` files as CRLF while the git
  blobs are LF. A Linux runner checks out LF and produces the byte-identical
  artifact this project verified in M6. Harmless; a one-line
  `* text=auto eol=lf` would pin it if the divergence ever becomes annoying.
- **`[WARN] [astro-icon] Failed to load icons from "src/icons"`.** Emitted by
  every build, locally and in CI. `src/icons/` does not exist on purpose —
  all icons come from the `@iconify-json` packages. Does not affect output.
- **`README.md` does not pass `prettier --check`.** Pre-existing, from the
  unaligned Commands table; `npm run format` fixes it whenever someone wants
  the diff noise.

### Resolved during M5

- JSON-LD `dateModified` — the decision to set it by hand rather than from a
  build timestamp still stands; the value itself is still unset and has moved
  to "Blocks go-live" above.

### Resolved 2026-09-03

- **Custom-cursor easter egg.** Kept, and reimplemented. The "battle royale
  games" (EN) / "королевской битве" (RU) phrase is wrapped in
  `<span class="cursor-easter-egg">` in `about/en.md` and `about/ru.md`,
  styled in `src/styles/global.css`: `cursor: url('/images/fortnite.png') 64
  64, auto` (hotspot centered on the badge — the legacy rule left it unset,
  defaulting to the image's 0,0 corner) plus `color:
  var(--color-text-primary)` to brighten the phrase against the muted About
  paragraph, replacing the legacy hardcoded `color: #fff`.
  `public/images/fortnite.png` is referenced again; CSS bundle went from
  17 739 to 17 834 bytes (+95 bytes, the new rule). Verified in a real
  browser (CDP) on both locales: computed `cursor` resolves to the image
  with the 64 64 hotspot, and the RU phrase (which wraps to two lines at
  narrower widths) keeps the effect on both line fragments.

  Two sub-decisions the owner confirmed explicitly: keep the asset at
  128×128/35.4 KB as shipped (a GDI+ re-encode measured 64×64 ≈ 10.7 KB and
  32×32 ≈ 3.1 KB as the cost of shrinking it, for the record, but the owner
  chose not to); and add no visual hint beyond the existing brighter text —
  the color contrast against the muted paragraph is the only affordance,
  same as the legacy site.
- **JSON-LD `dateModified`.** `profileDates.modified` in `src/data/seo.ts`
  set to `2026-09-03T14:30:00+03:00` — the actual go-live time (see "Blocks
  go-live" above). Stays a manually maintained constant from here on, per
  the standing rule; only the value itself was unresolved.
