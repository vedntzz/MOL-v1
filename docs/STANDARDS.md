# Coding standards

Every agent reads this before touching code. Gate checks every line of it.

## Code
- Tests before code. A ticket's first commit is failing tests.
- One-line comments only. No block comments, no commented-out code.
- Names explain the function without opening it: `bandForScore`, not `getBand`.
- No function over 20 lines. Split it.
- Simplest pattern that works. A new abstraction needs a reason in the PR.
- `src/domain/` is pure: no React, no SQLite, no Date.now(), no network. Time comes in as an argument.
- No rupee figure, weight, band or rate outside `src/data/rules/rules.json`.
- No hex colour outside `src/ui/theme/`. No display text outside `src/strings/en.ts`.
- No `any`. No non-null `!` without a one-line reason.

## Tests
- Colocated: `conditionScore.ts` → `conditionScore.test.ts`.
- Domain logic: 100% of acceptance criteria as named tests.
- Test names read as sentences: `walk-away never exceeds market price`.

## Git
- Agents never run git. You run every git command.
- One ticket = one branch = one PR. Branch: `mol-<nnn>-<slug>`.
- Commit messages: `MOL-<nnn>: <imperative summary>`.
- Squash-merge. `main` always passes `npx tsc --noEmit` and `npm test`.
