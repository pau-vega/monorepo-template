# Refactor — Prompt Template

> A fillable prompt for behavior-preserving code changes — restructuring,
> renaming, extracting, deduplicating, modernizing, or migrating. Use
> [`new-feature-prompt.md`](./new-feature-prompt.md) for new
> functionality, [`bugfix-prompt.md`](./bugfix-prompt.md) for defects,
> or [`new-project-prompt.md`](./new-project-prompt.md) for project
> bootstrap.
>
> **How to use:**
>
> 1. Copy everything between `--- BEGIN PROMPT ---` and `--- END PROMPT ---`.
> 2. Replace every `{{PLACEHOLDER}}`. Delete sections that don't apply.
> 3. Paste into your agent of choice.
>
> The shape is biased toward **behavior preservation + scope discipline**:
> characterize current behavior → propose strategy options → execute in
> small reversible steps → prove parity. The two failure modes this
> template guards against: (a) silent behavior drift, (b) scope creep
> ("while I was in here…").

---

--- BEGIN PROMPT ---

## 1. Working Agreement

You are my engineering partner on a refactor. Default behaviors:

- **Behavior preservation is the prime directive.** Unless §8 explicitly
  authorizes a change, observable behavior — public API surface, return
  types, error semantics, performance characteristics, side effects —
  must be identical before and after.
- **Characterize before you change.** Inspect existing tests. If
  coverage on the target is thin, propose characterization tests
  capturing current behavior *before* refactoring. Wait for approval.
- **Propose strategy options before code.** For non-trivial refactors,
  surface 2–3 approaches with trade-offs and the option you'd pick.
  Wait for my agreement on the strategy before implementing.
- **Small, reversible steps.** Each commit must leave the codebase in
  a green state (tests + types + lint). Never bundle "phase 1" and
  "phase 2" into one diff.
- **No scope creep.** Out-of-scope cleanups go on a list at the end of
  your response, not into the diff. Even if the cleanup is "right
  next to" your change.
- **Read first.** Inspect `CLAUDE.md`, `AGENTS.md`,
  `.agents/rules/*`, and the affected files before writing code.
- **Match conventions already in the repo** — naming, file layout,
  error handling, test style. Refactors should *increase* convention
  conformance, never decrease it.
- **Conventional Commits.** `refactor:` for structure, `chore:` for
  rename/move-only, `perf:` if behavior change is a deliberate
  performance improvement (and only if §8 allows it). Never
  `--no-verify`.
- **Stop on failing tests, type errors, or lint errors.** Don't
  suppress with `any`, `// @ts-ignore`, `eslint-disable`, or skipped
  tests.
- **Ask one focused question on real ambiguity.** Don't invent
  requirements.

## 2. Refactor Identity

- **Title:** {{REFACTOR_TITLE}}
- **One-liner:** {{ONE_LINER}}
  <!-- One sentence: what changes structurally + what stays the same. -->
- **Tracking link:** {{ISSUE_OR_TICKET_OR_NA}}
- **Owner:** {{NAME_OR_HANDLE}}
- **Refactor type:** {{rename | extract | inline | dedup | restructure | modernize | migrate | split | merge | other}}

## 3. Target

- **Files / directories in scope:** {{LIST}}
- **Workspaces affected:** {{e.g. packages/ui, apps/showcase}}
- **Public API surfaces touched:** {{NONE | LIST_OF_EXPORTS}}
- **Approximate LOC affected:** {{ROUGH_COUNT}}

## 4. Why Now (Cost Evidence)

<!--
Refactors without evidence of cost are vanity work. State the concrete
pain. If you can't, reconsider whether to refactor at all.
-->

- **Current pain:** {{e.g. "duplicated 4 times across packages/ui",
  "300-line component with nested conditionals", "uses deprecated
  React API", "blocks upcoming feature X"}}
- **Evidence:** {{LINK_TO_DUP / METRIC / RECENT_BUG_FROM_THIS_AREA}}
- **Trigger:** {{UPCOMING_FEATURE | DEADLINE | TS_UPGRADE | NA}}

## 5. Goals (Outcomes)

<!--
Outcome-based, ordered by priority. Examples: "single source of truth
for X", "no file in this dir > 200 LOC", "type-safe at boundaries",
"no deprecated APIs". 2–4 goals is healthy.
-->

1. {{OUTCOME_1}}
2. {{OUTCOME_2}}
3. {{OUTCOME_3}}

## 6. Non-Goals

<!--
For refactors, the highest-leverage non-goal is usually "no behavior
change". Be aggressive about parking adjacent improvements.
-->

- No behavior change beyond what §8 lists.
- {{NON_GOAL_1}}
- {{NON_GOAL_2}}

## 7. Behavior Preservation Contract

<!--
The explicit list of what must NOT change. Skim against this before
finalizing the diff.
-->

The following must remain identical:

- [ ] Public exports (names, signatures, generic params, return types).
- [ ] Runtime behavior for all current call sites.
- [ ] Error messages, error types, and conditions under which errors
      are thrown.
- [ ] Side effects (network calls, storage writes, event emissions).
- [ ] Performance characteristics (no O-class regressions).
- [ ] {{PROJECT_SPECIFIC_INVARIANT}}

## 8. Allowed Behavior Changes (if any)

<!--
Default: empty. If you genuinely intend a behavior change, list it
explicitly here so the agent treats it as authorized rather than as
a regression to flag.
-->

- {{ALLOWED_CHANGE_1 — WHY}} | NONE

## 9. Strategy (Proposed or Open)

<!--
If you already know the approach, lock it. If not, ask the agent to
propose options first.
-->

- **Proposed approach:** {{e.g. "extract shared logic into
  packages/ui/src/hooks/use-x.ts, update 4 call sites in apps/showcase"}}
- **Open for agent to propose:** {{YES | NO}}

## 10. Test Parity Plan

- **Existing test coverage on target:** {{HIGH | MEDIUM | LOW | NONE}}
- **Characterization tests needed before refactor:** {{YES + WHAT | NO}}
- **Tests to run for parity check:**
  - `pnpm test` (Vitest)
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm e2e` (if applicable)
  - {{ANY_PROJECT_SPECIFIC_GATE}}
- **Snapshot / golden files affected:** {{LIST | NONE}}
- **Manual smoke test (if any):** {{STEPS | NA}}

## 11. Constraints

- **Public API stability:** {{must preserve | breaking allowed but coordinated | NA}}
- **Deprecation policy:** {{add `@deprecated` + keep N versions | hard remove | NA}}
- **Bundle size delta budget:** {{e.g. ≤ +0kb, ≤ +5kb, NA}}
- **Performance budget:** {{no regression | tolerated regression %, NA}}
- **Backward compatibility window:** {{N versions | next major | none}}
- **Files / areas off-limits:** {{LIST | NONE}}
- **Deadline:** {{DATE | none}}

## 12. Migration / Rollout

- **Codemods needed:** {{YES + DESCRIPTION | NO}}
- **Other repos / consumers affected:** {{LIST | NONE — internal only}}
- **Communication needed:** {{CHANGELOG | release notes | team notify | NA}}
- **Rollback plan:** {{git revert is safe | requires data fix | NA}}

## 13. Definition of Done

- [ ] All goals in §5 met.
- [ ] All items in §7 verified unchanged.
- [ ] All items in §8 (if any) implemented intentionally.
- [ ] `pnpm test`, `pnpm typecheck`, `pnpm lint` green.
- [ ] `pnpm e2e` green (if applicable).
- [ ] No new ESLint disables, `any`, `// @ts-ignore`, or skipped tests.
- [ ] Bundle size and performance within §11 budgets.
- [ ] Out-of-scope improvements parked in a follow-up list, not
      smuggled into the diff.
- [ ] Commit history is reviewable: small, reversible steps.
- [ ] {{ANY_PROJECT_SPECIFIC_GATE}}

## 14. Risks & Open Questions

- **Risks:**
  - **Silent behavior drift** in {{AREA}} — mitigation: {{characterization
    tests | manual smoke | type-level proof | other}}.
  - {{RISK_AND_MITIGATION}}
- **Open questions (please surface answers or propose options):**
  - {{QUESTION}}

## 15. References

- {{LINK_OR_PATH}} — {{WHAT_FOR}}
- {{LINK_OR_PATH}} — {{WHAT_FOR}}

## 16. GSD Workflow (Optional — skip if not using GSD)

If this repo uses the GSD planning skill set:

- **Standard refactor (multi-file, needs strategy):**
  `/gsd-spec-phase` → `/gsd-discuss-phase` → `/gsd-plan-phase` →
  `/gsd-execute-phase` → `/gsd-verify-work` → `/gsd-ship`.
- **Surgical refactor (1–2 files, mechanical):** `/gsd-quick`,
  or delegate to the `cavecrew-builder` subagent for format-preserving
  edits.
- **Locating call sites first:** delegate to `cavecrew-investigator`
  before planning.
- **Code-quality-driven cleanup surfaced by audit:** `/gsd-audit-fix`.
- **Convention compliance sweep (TS rules):** the `ts-reviewer`
  subagent.

Planning artifacts go under `.planning/<phase-name>/`. Do not edit
`.planning/codebase/*.md` by hand.

## 17. First Task

<!--
For refactors, the first task is almost always:
  characterize current behavior + propose strategy options.
Letting the agent jump straight to code is the fastest path to
silent behavior drift.
-->

Start by:

{{FIRST_TASK_DESCRIPTION}}

<!--
Examples:
  • "Map every call site of {{TARGET}} (file:line table) and inspect
     existing test coverage. Then propose 2–3 refactor strategies with
     trade-offs and the one you'd pick. Wait for approval."
  • "Run /gsd-spec-phase using the content above as input."
  • "Add characterization tests covering current behavior of
     {{TARGET}}, get them green, then stop."
-->

## 18. Output Format Expectations

- **Mapping report:** `file:line` table of call sites and test
  coverage status. No fluff.
- **Strategy proposal:** numbered list of 2–3 options, each with: what
  changes, what stays, blast radius, risks, the option you'd pick and
  why.
- **For code changes:** show the diff; cite `file:line` for context.
  After each commit, restate behavior parity status (`tests green: ✅`,
  `behavior identical: ✅` or call out what diverged and why).
- **For questions:** ask the smallest number that unblocks you
  (ideally one).
- **Out-of-scope follow-ups:** dedicated list at the end of your
  response, not in the diff.

--- END PROMPT ---

---

## Appendix: Tips for filling this in

- **§4 Cost evidence is mandatory.** Refactors without it become
  vanity work. If you can't write a concrete pain, reconsider whether
  this refactor should happen.
- **§7 Behavior Preservation Contract is the strongest tool.** Reading
  this list at the end of the diff catches drift faster than any test
  suite.
- **§8 Defaults to empty.** Filling it in deliberately converts a
  refactor into a partial behavior change — that's fine, but it must
  be explicit.
- **§10 Characterization tests before refactor.** If coverage on the
  target is thin, this is non-optional. The cost of writing them is
  much smaller than the cost of a silent regression in production.
- **§17 First Task = characterize + propose, not code.** Refactor
  agents that skip straight to editing produce drift. Always.
- **Out-of-scope follow-ups are a feature, not a chore.** Park them
  visibly so they don't get lost — and don't smuggle them into the
  current diff.
