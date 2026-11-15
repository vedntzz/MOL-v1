# Workflow — one Claude Code session per ticket

One ticket, one branch, one session, one PR. No CI: the CHECK phase is the CI. You run every git command and you merge.

## Phases — the agent stops after each

| Phase | Agent does | Stops with |
| --- | --- | --- |
| SPEC | Restates the ticket, lists files and open questions | Questions, or "none" |
| RED | Writes failing tests from the acceptance list | Test list, all failing for the right reason |
| GREEN | Makes them pass one at a time | All green, files changed |
| REFACTOR | Applies docs/STANDARDS.md without changing behaviour | Anything still breaking a rule |
| REVIEW | Reads `git status` and `git diff main`, and opens every untracked file, as a stranger would | Numbered findings: block / fix / note |
| CHECK | Runs tsc and tests, ticks every acceptance line and standard | PASS or BLOCK, and the filled PR description |

REVIEW is where the old Hunt agent went, CHECK is where Gate went. Same session, so it is a weaker check than a fresh one — REVIEW must name what it looked at, not just say "looks fine".

## A ticket, start to finish

```
git switch main && git pull
git switch -c mol-002-rules
claude
```

```
Read CLAUDE.md, docs/STANDARDS.md and docs/TICKETS.md.
Ticket MOL-002. Phase SPEC.
```

Then, one message each: `Phase RED.` · `Phase GREEN.` · `Phase REFACTOR.` · `Phase REVIEW.` · `Fix the block and fix findings, tests first.` · `Phase CHECK.`

On PASS:

```
git add -A
git commit -m "MOL-002: rules weights and bands, typed loader"
git push -u origin mol-002-rules
gh pr create --fill
gh pr merge --squash --delete-branch
```

Set the ticket to `merged` in docs/TICKETS.md. `/clear` before the next ticket.

On BLOCK twice for the same ticket: stop and split it.