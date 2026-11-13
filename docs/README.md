# MOL

**मोल — worth.** A phone app that tells a tractor dealership the most to pay for a used tractor, before the bargaining starts.

Built for Sandhu Tractors, Patiala. Its last 15 trade-ins lost ₹5.2 lakh — 14 of 15 sold for less than they cost. The loss was made on the day of purchase: a mechanic priced each tractor by eye, the farmer bargained, and nothing was written down. MOL replaces the guess with a standard check and records every deal so the prices can be held to account.

## How it works

1. **Inspect.** The mechanic scores 17 checks from 1 to 5 against written descriptions, takes eight fixed photos, and records the RC and hour meter. About five minutes.
2. **Price.** The app turns the scores into a condition score out of 100 and gives the owner two numbers: where to open, and the price to walk away above. Margin is built in and scales with risk.
3. **Slip.** The farmer gets a printed or shared slip showing why the price was cut, line by line. It never shows the market price, the margin or the walk-away.
4. **Purchase.** The price paid is recorded. Paying above walk-away needs a reason.
5. **Settle.** Weeks later, the sale price goes in and the deal shows its profit or loss.

Every settled deal is a data point. After twenty, the price bands get tuned on what actually happened.

## Status

Version 1, in build. Prices use sample figures until the owner signs off; the app says so on screen. Android only, English only, offline.

## Run it

Needs Node 20+ and the Expo Go app or an Android emulator.

```
npm install
npx expo start
```

Tests and type check:

```
npm test
npx tsc --noEmit
```

## Structure

```
app/          screens (expo-router) — thin
src/domain/   pricing, scoring, inspection rules — pure and tested
src/data/     SQLite, rules.json, slip PDF
src/state/    the inspection in progress
src/ui/       components and theme
docs/         standards, tickets, workflow, inspection standard, screens
```

Architecture, dependency rules and invariants: [CLAUDE.md](CLAUDE.md).

## Docs

| File | What it's for |
| --- | --- |
| [PRODUCT.md](PRODUCT.md) | Who uses it, why, and the constraints |
| [DESIGN.md](DESIGN.md) | The Ledger & Dial visual system |
| [docs/INSPECTION_STANDARD.md](docs/INSPECTION_STANDARD.md) | The 17 checks, weights and score bands |
| [docs/TICKETS.md](docs/TICKETS.md) | The work, one PR per ticket |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Build, Hunt, Gate — how a ticket gets merged |
| [docs/STANDARDS.md](docs/STANDARDS.md) | Coding standards |
| [docs/SPRINT.md](docs/SPRINT.md) | The stories behind the tickets |

## How work gets done

One ticket, one branch, one PR. Three agents in separate sessions: **Build** writes it test-first, **Hunt** reviews the diff cold, **Gate** runs the checks and says pass or block. No CI — Gate is the CI. A human runs every git command and merges. Details in [docs/WORKFLOW.md](docs/WORKFLOW.md).

## Not in version 1

Gauge readings for compression and hydraulics. Punjabi and Hindi. Cloud backup. More than one branch. A learned price model — the app is what collects the data for one.
