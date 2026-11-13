# Three-agent workflow

Three separate Claude Code sessions per ticket. Each starts fresh, so no agent marks its own homework. No CI: Gate is the CI.

| Agent | Job | Writes code? | Ends with |
| --- | --- | --- | --- |
| Build | Takes one ticket through SPEC → RED → GREEN → REFACTOR | Yes | A filled PR description |
| Hunt | Reads the diff cold and hunts for what Build missed | No | Numbered findings, each with severity |
| Gate | Runs the checks, rules on every finding, says PASS or BLOCK | No | A verdict with reasons |

You run every git command and you merge.

## One ticket, start to finish

```
git switch main && git pull
git switch -c mol-003-condition-score
```

**1 · Build** (new session)
```
Read CLAUDE.md, docs/STANDARDS.md and docs/TICKETS.md.
You are Build. Ticket MOL-003.
Phase SPEC: restate the ticket in three lines, list open questions, stop.
```
Then `phase RED`, `phase GREEN`, `phase REFACTOR`, each in turn. Last:
```
Fill .github/pull_request_template.md for this ticket. Leave Hunt and Gate blank.
```
You commit:
```
git add -A
git commit -m "MOL-003: conditionScore with test vectors"
git push -u origin mol-003-condition-score
gh pr create --fill
```

**2 · Hunt** (new session)
```
Read CLAUDE.md and docs/STANDARDS.md.
You are Hunt. Review `git diff main...HEAD` against ticket MOL-003 in docs/TICKETS.md.
Do not edit any file. Find: acceptance lines not covered by a test, logic bugs,
edge cases, and every standards breach. Number each finding with severity
(block / fix / note). If you find nothing, say what you checked.
```
Paste the findings into the PR. Back to the Build session for any `block` or `fix`:
```
Fix Hunt findings 1 and 3. Tests first. Explain why you're not fixing 2.
```
Commit, push.

**3 · Gate** (new session)
```
Read CLAUDE.md, docs/STANDARDS.md, docs/TICKETS.md.
You are Gate. Ticket MOL-003. Do not edit any file.
Run npx tsc --noEmit and npm test. Check every acceptance line has a passing
test. Check every standard against `git diff main...HEAD`. Check each Hunt
finding is fixed or answered. Reply PASS or BLOCK, with one line per reason.
```
PASS:
```
gh pr merge --squash --delete-branch
```
Set the ticket to `merged` in docs/TICKETS.md.

BLOCK: back to Build with Gate's reasons, then Gate again. Two BLOCKs on the same ticket → stop and split the ticket.
