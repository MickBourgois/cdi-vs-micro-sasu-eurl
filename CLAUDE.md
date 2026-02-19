# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CDI vs Freelance Simulator** — A client-side financial calculator comparing CDI (salaried employment) against 3 freelance structures: Micro-Entrepreneur (AE), SASU, and EURL. Built with Next.js 16 App Router, React 19, TypeScript strict mode, and Tailwind CSS v4. No backend or database.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build (always run before committing)
npm run lint      # ESLint
npx tsc --noEmit  # TypeScript type checking without build
```

## Architecture

### Data Flow

```
CdiForm / FreelanceForm (controlled inputs)
  → HomeContent.tsx (state + URL serialization)
    → calculations.ts (pure functions)
      → CdiResultCard / FreelanceResultCard / ComparisonPanel (display)
```

**`src/types/index.ts`** — All TypeScript interfaces. Freelance uses a discriminated union on `structure: 'micro' | 'sasu' | 'eurl'`. Result types: `CdiResults`, `MicroResults`, `SasuResults`, `EurlResults`, `ComparisonResults`.

**`src/lib/calculations.ts`** — All financial logic as pure functions: `calculateCdi()`, `calculateMicro()`, `calculateSasu()`, `calculateEurl()`, `calculateFreelance()` (dispatcher), `calculateComparison()`. Break-even TJM uses binary search (60 iterations).

**`src/components/HomeContent.tsx`** — Main client component. Owns all state, syncs to URL via `useSearchParams()` + `useRouter().replace()` on every input change. Parses URL on mount via `parseCdiInputsFromParams()` / `parseFreelanceInputsFromParams()`.

**`src/app/page.tsx`** — Server component wrapping `HomeContent` in `<Suspense>` (required for `useSearchParams()` in App Router).

### URL Query Params

| Param | Description | Default |
|-------|-------------|---------|
| `brut` | CDI annual gross salary | 0 |
| `statut` | `cadre` \| `non-cadre` \| `personnalise` | `cadre` |
| `taux` | Custom employee charge rate (only with `personnalise`) | — |
| `pas` | Prélèvement à la source rate % | 10 |
| `tjm` | Daily rate (freelance) | 0 |
| `jours` | Working days/year | 218 |
| `structure` | `micro` \| `sasu` \| `eurl` | `micro` |
| `salaire` | SASU president gross annual salary | 0 |
| `remu` | EURL annual TNS remuneration | 0 |
| `capital` | EURL share capital | 1000 |

### Key Implementation Details

- **Dark mode**: Class-based (`.dark` on `<html>`), persisted to localStorage. Toggle in `DarkModeToggle.tsx`.
- **URL sharing**: All inputs serialized as query params. Default values are omitted from the URL.
- **No external UI libraries**: All components use Tailwind CSS + custom CSS variables. Tooltips in `Tooltip.tsx`.
- **Currency formatting**: Always `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })`.
- **globals.css**: Uses Tailwind CSS v4 syntax (`@import "tailwindcss"`) with `@variant dark (&:is(.dark, .dark *))`.

### Financial Constants (do not change without verifying French tax law)

| Constant | Value | Notes |
|----------|-------|-------|
| CDI charges cadre | 25% | Employee contributions |
| CDI charges non-cadre | 22% | Employee contributions |
| CDI employer cost | ×1.42 | Brut × 1.42 = employer cost |
| AE total rate | 28.56% | Social (26.16%) + CFP (0.20%) + IR libératoire (2.20%) |
| SASU employee contributions | 22% | On president salary |
| SASU employer contributions | 45% | On president salary |
| SASU salary cap | CA / 1.45 | Prevents company deficit (employer charges) |
| Flat tax (dividends) | 30% | PFU for SASU & EURL |
| EURL deduction | 26% | Applied before TNS contributions |
| EURL TNS contributions | ~45% | On remuneration after deduction |
| EURL dividends threshold | 10% | Of (capital + net profit) — above triggers TNS |
| IS rate low | 15% | Profit ≤ 42 500 € |
| IS rate normal | 25% | Profit > 42 500 € |
| Default working days | 218/year | 52w − 5 vacation − 11 holidays |

## Development Notes

- The Ralph agent config is in `.claude/ralph/` with the PRD in `.claude/ralph/tasks/01-cdi-vs-freelance/`. The PRD tracks user stories and implementation progress.
- Components using `useSearchParams()` or other client hooks must be wrapped in `<Suspense>` in the parent server component.
