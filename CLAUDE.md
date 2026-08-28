# CLAUDE.md

## Project

petrachuk.com / petrachuk.ru

Personal homepage and portfolio of Alex Petrachuk, a backend/infrastructure
engineer. This is a from-scratch visual and technical redesign of the
existing site (Bootstrap-based, see current `en/index.html` / `ru/index.html`
for the content baseline) — content and information architecture largely
carry over, execution does not.

**Read `../DESIGN-SYSTEM.md` first.** It defines the shared visual language,
type, color, motion, and component conventions across the whole Petrachuk web
ecosystem. This file only covers what's specific to this site.

---

## Design inspiration

[brittanychiang.com](https://brittanychiang.com/) /
[v4.brittanychiang.com](https://v4.brittanychiang.com/) — used **only as a
reference** for the split fixed-sidebar-plus-scrolling-content layout,
scroll-spy nav, restrained single accent color, and monospace section
numbering. Do not reproduce their visual design, CSS, components, copy,
assets, or distinctive branding — see `../DESIGN-SYSTEM.md` §2 for the exact
boundary between "borrow the pattern" and "don't clone the site."

---

## Who this site is for

- Recruiters and hiring managers evaluating Alex as a candidate.
- Peers/collaborators looking him up (GitHub, conference contact, etc.).
- Russian-speaking network who may land on `petrachuk.ru`.

Primary jobs the site must do:

1. Establish credibility fast (role, seniority, domain: backend/infra,
   banking/fintech systems at scale).
2. Make the career history scannable (Experience timeline).
3. Show a couple of side projects with enough detail to prove hands-on skill.
4. Make it trivially easy to reach out or move to a profile (GitHub,
   LinkedIn, Telegram, Stack Overflow, résumé/CV, email).
5. Route deeper technical browsing to `petrachuk.dev`.

---

## Core principles

1. Content-first — the design must not bury the résumé-relevant facts (dates,
   titles, org names) behind decoration.
2. One accent color, used sparingly (see `../DESIGN-SYSTEM.md` §3.1).
3. Both locales are first-class. Never ship a feature/layout that only works
   for English string lengths.
4. No component or animation that a keyboard-only or reduced-motion user
   can't fully use.
5. Static output only — no server runtime, no client-side data fetching for
   content that's known at build time.
6. Content fidelity is non-negotiable: migration may restructure, shorten,
   or improve the wording of existing copy, but must never add claims,
   technologies, responsibilities, achievements, dates, employers, metrics,
   or any other fact that isn't already present in the current
   `en/index.html` / `ru/index.html`. If something reads as underwhelming,
   flag it for the owner to rewrite — don't embellish it.
7. Dark theme only — no theme switcher, no reading of `prefers-color-scheme`.
   This is a deliberate, settled decision (see `../DESIGN-SYSTEM.md` §3.1),
   not something to reconsider mid-build.

---

## Technical constraints

### Stack

- Astro, static output (`output: 'static'`)
- TypeScript, strict mode
- Tailwind CSS v4, configured CSS-first via `@theme` in CSS — do not create
  a legacy `tailwind.config.js/ts` unless something genuinely requires it
- Astro Content Collections for Experience and Projects, per locale (see
  Content architecture below — About is intentionally *not* a collection)
- Astro built-in i18n (`astro:i18n`): `locales: ['en', 'ru']`,
  `defaultLocale: 'en'`, `prefixDefaultLocale: false`
- Prettier + `prettier-plugin-astro`
- `astro-icon` for all icons (GitHub, Stack Overflow, LinkedIn, Telegram,
  external-link glyph) — replace the current inline `<symbol>` sprite
- `@astrojs/sitemap`
- GitHub Actions for build (see Deployment below for what's in vs. out of
  scope)

Do NOT introduce:

- Bootstrap or any other CSS framework
- React/Vue/Svelte or any other UI framework/island. If a genuine need for
  client-side interactivity comes up that vanilla JS/Astro can't cover,
  raise it with the owner as a scope change — don't default into adding one.
- A CMS or backend of any kind

### Deployment

This repo's CI is only responsible for producing a static build artifact
(`npm ci && npm run check && npm run build` → `dist/`). How `dist/` actually
reaches the nginx host (self-hosted runner, SSH/rsync, manual copy, etc.) is
an infrastructure decision that is **not** part of this build — see
`../DESIGN-SYSTEM.md` §7 "Hosting". Don't design or assume a delivery
mechanism; stop at the build artifact unless the owner specifies otherwise.

Domain routing between `petrachuk.com` and `petrachuk.ru` is a DNS/nginx-level
concern — see `../DESIGN-SYSTEM.md` §7 "Domain routing". It must not be
modified as part of this codebase.

### Performance

- Lighthouse (mobile) ≥ 90 across Performance/Accessibility/Best
  Practices/SEO.
- Self-hosted, subsetted fonts (EN+RU charset), `font-display: swap`.
- No layout shift from images — always set explicit dimensions via
  `astro:assets`.

---

## Pages / routes

### `/` (EN) and `/ru/` (RU)

Single long-scroll page per locale (matches the current site — no need to
split into multi-page routes). Sections, in nav order:

#### Intro / sidebar (fixed on desktop, top block on mobile)

- Name, role line ("Backend Developer" / equivalent RU), one-sentence pitch
  (reuse/tighten the existing meta description copy).
- In-page nav: About, Experience, Projects — scroll-spy active state.
- Social icon row: GitHub, Stack Overflow, LinkedIn, Telegram (URLs already
  in current `en/index.html` — carry over).
- Language switcher: pill toggle, not the current floating box that overlaps
  content on mobile. Preserve current section on switch where feasible.

---

#### About

- Plain localized Markdown/MDX per locale (`en.md`/`ru.md` or equivalent) —
  **not** a content collection. About is one-off page copy, not a repeating
  entity; collections are reserved for Experience and Projects (see Content
  architecture).
- 3–4 short paragraphs, migrated from current content: backend focus
  (high-load server systems), current role (Head of IT in Risk Management at
  Russian Standard Bank), breadth of teams worked with, one personal-touch
  closing line.
- Keep the personal-touch detail (the current "battle royale games" aside
  with its custom cursor easter egg) as an optional small personality
  moment — nice-to-have, not required if it doesn't fit the new visual
  system cleanly.

---

#### Experience

Data-driven timeline (content collection entry per role), each with:

- Date range
- Title · Organization (linked, external)
- Description (1–3 sentences is the typical case, not a hard cap — a role
  with more to say, e.g. SberTech's two distinct achievements, keeps its
  full original text rather than being trimmed to fit; content fidelity
  wins over brevity)
- Tech/tool tag pills

Migrate all existing roles as-is (Russian Standard Bank, SberTech,
TRANSKAPITALBANK, Russian Standard Credit Bureau, Direct Group, iMoneyBank —
see current `en/index.html` for full text/dates/tags per role). Keep the
"View full résumé" outbound link (currently hh.ru) at the end of the section.

---

#### Projects

Curated highlights only — **2–3 entries max**, not a full catalog (the full
catalog lives on `petrachuk.dev`, see `../DESIGN-SYSTEM.md` §6). Migrate
AuthCore and NetBridge from the current content. End the section with a
"See all projects → petrachuk.dev" link.

Each entry: title, description, tag pills, link icon to the GitHub repo.

---

#### Footer

- Colophon line (tools/fonts used — update to reflect the new stack once
  built; don't leave stale "Built with Bootstrap" copy).
- Keep social links reachable here too (or rely on the sidebar row — avoid
  duplicating the exact same block twice on one page).

---

## SEO requirements

- `hreflang` (`en`, `ru`, `x-default`) between `/` and `/ru/`.
- Per-locale meta title/description — written for that language's search
  intent, not translated 1:1 from the other locale's English SEO copy.
- Open Graph + Twitter Card tags per locale, using **one static image**
  (existing `images/alex1x1.jpg`/`alex4x3.jpg`/`alex16x9.jpg` or a refreshed
  equivalent) — no dynamic/per-page OG image generation for v1.
- JSON-LD: carry forward and validate the existing `ProfilePage`/`Person`
  schema (see current `en/index.html` bottom `<script type="application/ld+json">`)
  — update `sameAs`, `image`, and dates as needed; validate with a
  structured-data testing tool before shipping.
- `sitemap.xml` via `@astrojs/sitemap`, `robots.txt` updated to match the new
  route structure (drop the old `Disallow` entries that only made sense for
  the JS-redirect root — `/` will be directly crawlable EN content now).
- Yandex Metrika: confirm with the owner whether to keep it at all on the
  redesigned site (not architecturally required). If kept, carry forward the
  existing counter ID and load it in the least render-blocking way possible
  — it must never be allowed to delay first paint.

---

## Accessibility requirements

See `../DESIGN-SYSTEM.md` §9. In addition for this site specifically: the
Experience and Projects sections currently render as `<a>`-wrapped `<div>`
rows (whole-card-is-a-link via `btn btn-dark` wrapping a `row`) — in the
redesign, keep the "whole card is clickable" affordance but implement it with
a proper accessible pattern (e.g. a stretched-link technique on a semantic
`<article>`/`<li>`, not a giant anchor wrapping heading + paragraph + badges,
which currently produces redundant/confusing link text for screen readers).

---

## Content architecture

**Collections are for repeating entities only** — Experience and Projects.
About and the hero pitch are one-off page copy: plain localized Markdown/MDX
per locale, no schema, no collection.

- **Experience entries** — one collection, one stable ID per role, both
  locales linked to it. Recommended shape:

  ```text
  src/content/experience/
      head-of-it-risk-management/
          en.md
          ru.md
      team-lead-sbertech/
          en.md
          ru.md
      ...
  ```

  The folder name (or an explicit `id`/`slug` frontmatter field, if flat
  files are used instead) is the stable identifier that ties the EN and RU
  versions of the *same* role together. The language switcher, hreflang
  generation, and any cross-linking must resolve through that ID — never by
  assuming a filename convention like `role-en.md` / `role-ru.md` without an
  explicit link between them.

- **Project entries** — same pattern, one collection:

  ```text
  src/content/projects/
      authcore/
          en.md
          ru.md
      netbridge/
          en.md
          ru.md
  ```

- **Social links** — single source of truth (e.g. one config/data file), not
  duplicated between sidebar and footer markup.

---

## Decision rules for implementation

When uncertain:

1. Check `../DESIGN-SYSTEM.md` first — most cross-cutting questions (color,
   type, motion, component shape) are answered there.
2. Prefer the simplest Astro-native solution over adding a dependency.
3. Prefer content-collection data over hardcoded JSX/markup for anything that
   repeats (experience rows, project cards, tag pills).
4. When a Russian string is meaningfully longer than its English
   counterpart, fix the layout — never truncate or shrink RU text to fit an
   EN-sized box.
5. Preserve existing outbound URLs (GitHub, LinkedIn, Stack Overflow,
   Telegram, hh.ru résumé) exactly unless explicitly told they've changed.

---

## Output expectations

Production-ready static site, deployable as-is, maintainable without
architectural changes, bilingual parity enforced end-to-end (no
locale-specific placeholder content, no partially-translated sections).
