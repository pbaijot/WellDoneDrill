# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run lint     # ESLint
```

No test suite is configured.

## Stack

- **Next.js 16** (App Router) + **React 19** — see AGENTS.md; APIs differ from training data
- **Tailwind CSS v4** — configured via `@theme` in `app/globals.css`, not `tailwind.config.js`
- **next-intl 4** — locale routing with `localePrefix: 'always'`
- **Sanity CMS** — all page content is CMS-driven; components always have hardcoded fallbacks when CMS returns null
- **Framer Motion** — animations in client components

## Architecture

### Routing

Every URL is `/[locale]/...`. Five locales: `be-fr` (default), `be-nl`, `fr-fr`, `lu-fr`, `lu-de`.

The single catch-all route `app/[locale]/[...slug]/page.tsx` handles all content pages. It resolves the URL slug to a **route key** via `findRouteKeyBySlug()` (from `src/i18n/routes.ts`), fetches the matching CMS data, and renders the corresponding page component. Adding a new page means:
1. Adding the route key + per-locale slugs to `src/i18n/routes.ts`
2. Adding a Sanity schema in `sanity/schemaTypes/`
3. Adding a fetch function in `src/lib/`
4. Adding a branch in `app/[locale]/[...slug]/page.tsx`

The home page is a special case at `app/[locale]/page.tsx`.

### Locale helpers

`src/i18n/routes.ts` is the central routing contract. Always use:
- `getLocalizedPath(locale, routeKey)` to build internal hrefs
- Never hardcode paths — every route translates differently per locale

### Data fetching

All CMS data is fetched server-side in page components (or the catch-all route). Pattern in every `src/lib/*.ts` file:

```ts
export type XxxPageData = { _id: string; locale: string; /* ... */ }

export async function getXxxPage(locale: string): Promise<XxxPageData | null> {
  return sanity.fetch(groq`*[_type == "xxx" && locale == $locale][0]{ ... }`, { locale })
}
```

Components receive typed data as props and fall back to hardcoded French defaults when fields are null.

### Page components

All specialised page components live in `app/[locale]/components/`. They are large, self-contained, and often `'use client'` because they include interactive sub-sections (maps, FAQ accordions, calculators). Server data is fetched upstream and passed as props.

### Shared layout components

- `Header` — fixed, yellow bar, desktop dropdowns + mobile drawer
- `Footer` — `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- `DemarrerCTA` — reusable CTA block with `variant="dark"|"clay"`
- `FloatingInfoPanel` — animated stat overlay used in hero sections

### Alignment convention

All sections use the same left-margin pattern to maintain a consistent left edge:

```tsx
<section className="... px-8 md:px-16">
  <div className="max-w-screen-2xl mx-auto w-full">
```

For full-bleed sections (colored panels, image grids) where content must still align to this edge, use `pl-8 md:pl-[max(4rem,calc(50vw_-_48rem))]` — this tracks the `max-w-screen-2xl` centering on wide screens.

### Sanity environment variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=o8tuydyo
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=<secret>
```

### Theme colors

Defined in `app/globals.css` under `@theme`:

| Token | Hex |
|---|---|
| `wdd-black` | #1A1A1A |
| `wdd-yellow` | #FFD94F |
| `wdd-clay` | #E8E5DE |
| `wdd-ground` | #B0A18F |
| `wdd-mud` | #AB572E |
| `wdd-grass` | #42754F |
