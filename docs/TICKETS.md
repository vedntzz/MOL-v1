# Tickets

One ticket = one branch = one PR. Each is half a day or less. Do them in order; a ticket may depend only on tickets above it.

Status: `todo` · `building` · `in review` · `merged`

| ID | Story | Title | Size | Status |
| --- | --- | --- | --- | --- |
| MOL-001 | — | Scaffold: folders, expo-router, Jest, TypeScript strict | S | todo |
| MOL-002 | S2 | Rules: weights and score bands into rules.json, typed loader | S | todo |
| MOL-003 | S2 | conditionScore() with every test vector | S | todo |
| MOL-004 | S2 | bandForScore() with band-edge tests | S | todo |
| MOL-005 | S2 | Inspection type: 17 scores, psi and method | S | todo |
| MOL-006 | S2 | SQLite migration v2: score columns, legacy rows kept | M | todo |
| MOL-007 | S3a | Theme tokens and Chivo fonts | S | todo |
| MOL-008 | S3a | AppBar, BottomAction, LedgerRow | M | todo |
| MOL-009 | S3a | ScoreRow and scoreMeaning() | M | todo |
| MOL-010 | S3a | PhotoGrid, ChoiceTiles, Chips, Fab | M | todo |
| MOL-011 | S3 | RC and Use screens, red-flag rules | M | todo |
| MOL-012 | S3 | Photos and body screen | M | todo |
| MOL-013 | S3 | Engine, Drive, Control screens | M | todo |
| MOL-014 | S4 | priceTractor(): open, walk-away, age cut | S | todo |
| MOL-015 | S5 | Result screen (owner, dial) with repairs entry | M | todo |
| MOL-016 | S5 | Slip HTML and share; never prints market, margin, walk-away | M | todo |
| MOL-017 | S6 | Real model prices, thin flag, "Not priced" state | M | todo |
| MOL-018 | S7 | Purchase record and override reason | M | todo |
| MOL-019 | S7 | Settle, day-book flags, Settings screen | M | todo |
| MOL-020 | S8 | Backtest script on the 15 sold deals | S | todo |
| MOL-021 | S9 | Release prep: app.json, icon, privacy policy link | S | todo |

---

### MOL-001 · Scaffold
Fresh repo. Set up the structure in CLAUDE.md, empty folders kept with a one-line README each.
- expo-router with the routes in CLAUDE.md, each rendering its screen name only.
- Jest runs TypeScript; one passing smoke test. `tsc --noEmit` clean with `strict: true`.
- A test fails if anything in `src/domain/` imports react, expo or src/data.
- Logic from the old MOL repo is copied in later, ticket by ticket, never in bulk.

### MOL-002 · Rules: weights and bands
- rules.json holds the 17 weights and 6 bands from INSPECTION_STANDARD.md.
- `loadRules()` throws on a missing weight, a weight below 1, or bands that don't cover 0–100.

### MOL-003 · conditionScore()
- Returns every test vector in INSPECTION_STANDARD.md to one decimal.
- Throws on a score outside 1–5 or a missing check.

### MOL-004 · bandForScore()
- Correct band at 49.9, 50, 69.9, 70, 89.9, 90, 0 and 100.

### MOL-005 · Inspection type
- 17 checks, each `score: 1–5`. backCompressor and liftCondition add `psi: number | null`, `method: 'ear' | 'instrument'`.
- A fresh draft has no scores set; "complete" means all 17 scored.

### MOL-006 · SQLite migration v2
- New score columns. Old rows load with `legacy: true`. No row deleted.
- Migration runs once; running twice changes nothing.

### MOL-007 · Theme and fonts
- Every token in DESIGN.md exists in `src/ui/theme/`. Type sizes scale with the system font setting.
- A test fails if any `.tsx` file contains a hex literal.

### MOL-008 · AppBar, BottomAction, LedgerRow
- BottomAction disabled state shows what's missing ("2 checks left").
- System Back works; content clears status and navigation bars.

### MOL-009 · ScoreRow
- Five 64 dp targets, 5 to 1. 1 and 2 render vermilion.
- `scoreMeaning(check, score)` returns the definition for 5, 3, 1 and the "between" text for 4 and 2.

### MOL-010 · PhotoGrid, ChoiceTiles, Chips, Fab
- PhotoGrid: 8 fixed angles in fixed order; reports count taken.

### MOL-011 · RC and Use screens
- Match docs/screens. "No" on chassis match or loan cleared raises the red flag.
- Blank RC blocks Next (kept from P0).

### MOL-012 · Photos and body
- Next blocked until 8 photos and 5 scores.

### MOL-013 · Engine, Drive, Control
- Next blocked until every check on the screen is scored. Step shows n / 6.

### MOL-014 · priceTractor()
- Formula and vectors A and B in SPRINT.md S4.
- Open ≤ walk-away; neither below 0. Stores ruleVersion, valuationDate, inputs.

### MOL-015 · Result screen
- Matches docs/screens. Repairs entry recalculates both prices.
- Red flag → "Owner decides" instead of prices.

### MOL-016 · Slip
- Generated HTML never contains market price, margin or walk-away (test against the HTML).
- Offer defaults to open; cannot exceed walk-away.

### MOL-017 · Model prices
- Every model family in SPRINT.md S6 priced from baseline.csv; <3 listings → `thin: true`.
- Unknown model → "Not priced — ask owner".

### MOL-018 · Purchase and override
- Paid above walk-away requires a reason chip; note optional.

### MOL-019 · Settle, day book, Settings
- Settle shows cost, profit or loss, % on cost, override flag.
- Day book flags overrides and red flags. Settings blocks saving with a blank inspector.

### MOL-020 · Backtest
- Script prints per deal: paid, sold, walk-away, below-paid yes/no.
- Gate: walk-away below paid on ≥10 of 14 losing deals. Fails loudly; never tunes numbers.

### MOL-021 · Release prep
- app.json package name, icon, splash. Privacy policy URL field. No code beyond app.json.
