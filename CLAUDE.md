# CLAUDE.md — MOL

MOL values a used tractor for a dealership buying desk. The mechanic scores 17 checks; the owner sees an open price and a walk-away price; the farmer gets a slip; every deal is recorded and settled later. Android only, offline, Expo + TypeScript.

## Read before any task

1. `docs/STANDARDS.md` — the rules Gate enforces. Non-negotiable.
2. `docs/TICKETS.md` — your ticket. Do only what it lists.
3. `docs/INSPECTION_STANDARD.md` — the 17 checks, weights, bands, test vectors.
4. `DESIGN.md` — the only source of colours, type and components.
5. `docs/screens/` — the approved screens. If a screen and DESIGN.md disagree, DESIGN.md wins; say so in your report.
6. `PRODUCT.md` — who it's for and why, when a decision needs context.

## Your role

You are one of three agents. Your prompt says which.

| Role | Does | Never |
| --- | --- | --- |
| Build | One ticket: SPEC → RED → GREEN → REFACTOR, stopping after each | Touches anything outside the ticket |
| Hunt | Reads `git diff main...HEAD` cold, numbers findings by severity | Edits a file |
| Gate | Runs the checks, rules on every Hunt finding, says PASS or BLOCK | Edits a file |

No agent ever runs git. The human runs every git command and merges.

## Architecture

Four layers. Dependencies point one way only.

```
app/  (routes)  ──►  state/  ──►  domain/  (pure)
   │                   │             ▲
   ▼                   ▼             │
ui/  (dumb views)    data/  ─────────┘  (types only)
```

- **domain/** — all business logic. Pure functions, no React, no SQLite, no `Date.now()`, no network. Time and rules come in as arguments. This is where the tests live thickest.
- **data/** — everything with side effects: SQLite repositories, the rules loader, slip HTML and sharing. Knows domain types; domain never imports data.
- **state/** — one React context holding the inspection draft. Calls domain to compute, calls data to persist. The only place the two meet.
- **ui/** — presentational components and theme. Props in, events out. Never imports state, data or domain.
- **app/** — expo-router screens. Thin: read from state, render ui components, wire events. No business logic in a screen file.

A rule of thumb: if it can be wrong, it belongs in domain and has a test.

## Folder structure

```
app/
  _layout.tsx              fonts, providers, safe areas
  index.tsx                day book
  settings.tsx
  inspect/
    _layout.tsx
    rc.tsx  use.tsx  photos.tsx  engine.tsx  drive.tsx  control.tsx
  result.tsx               owner view, dial black
  slip.tsx
  purchase.tsx
  settle/[id].tsx
src/
  domain/
    scoring/               conditionScore, bandForScore, scoreMeaning
    pricing/               priceTractor, ageFactor, roundToThousand
    inspection/            createFreshDraft, rcNextStep, redFlags, isStepComplete
    deals/                 purchaseNeedsReason, settleResult
    slip/                  toSlipView — strips owner-only fields
  data/
    db/                    schema, migrations, inspectionsRepo, settingsRepo
    rules/                 rules.json, loadRules
    pdf/                   slipHtml, shareSlip
  ui/
    theme/                 colors, type, spacing — the only hex values
    components/            AppBar, BottomAction, ScoreRow, LedgerRow,
                           PhotoGrid, ChoiceTiles, Chips, Fab
  state/
    InspectionContext.tsx
  strings/
    en.ts                  every word the user reads
  types/
    inspection.ts  rules.ts  slip.ts
scripts/
  backtest.ts
docs/
  STANDARDS.md  TICKETS.md  WORKFLOW.md  SPRINT.md
  INSPECTION_STANDARD.md  screens/
```

Tests sit next to the file they test: `priceTractor.ts` → `priceTractor.test.ts`.

## Invariants — break one and Gate blocks

1. **The slip never shows market price, margin or walk-away.** Enforced by type: `slipHtml()` accepts only `SlipView`, which has no such fields. `toSlipView()` is the only way to make one.
2. **Open ≤ walk-away, and neither is below 0.**
3. **Every saved valuation stores its inputs, `ruleVersion` and `valuationDate`,** so it can be re-priced later.
4. **No price without all 17 scores, an RC, and no red flag.** A red flag shows "Owner decides".
5. **Paying above walk-away requires a reason.**
6. **Engine and lift checks keep `psi: number | null` and `method`.** Never simplify to booleans.
7. **While `ruleVersion` ends in `-sample`, every screen with a figure shows "Sample figures — not yet priced".**
8. **No row is ever deleted by a migration.**

## The price, in one place

```
condition  = Σ(weight × score ÷ 5) ÷ Σ(weight) × 100
band       = bandForScore(condition)        → factorLow, factorHigh, margin
ageFactor  = yearOfMake < 2010 ? 0.75 : 1.00
resaleLow  = market × ageFactor × factorLow
resaleHigh = market × ageFactor × factorHigh
open       = resaleLow  − repairs − resaleLow  × margin
walkAway   = resaleHigh − repairs − resaleHigh × margin
both rounded to the nearest ₹1,000
```

All numbers come from `rules.json`. This lives in `src/domain/pricing/` and nowhere else.

## Commands

```
npx expo start            run on a device or emulator
npm test                  all tests
npm test -- pricing       one area
npx tsc --noEmit          type check — must be 0 errors
```

## Before you say you're done

- `npx tsc --noEmit` — 0 errors.
- `npm test` — all pass. Report the count.
- Every acceptance line in your ticket has a named, passing test.
- No function over 20 lines. No hex, rupee figure or display string outside its home.
- List every file you changed, and anything you noticed but didn't touch.
