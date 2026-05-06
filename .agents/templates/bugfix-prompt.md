# Bugfix — Prompt Template

> A fillable prompt for investigating and fixing a defect.
> Use [`new-feature-prompt.md`](./new-feature-prompt.md) for new
> functionality, [`refactor-prompt.md`](./refactor-prompt.md) for
> behavior-preserving restructuring, or
> [`new-project-prompt.md`](./new-project-prompt.md) for project
> bootstrap.
>
> **How to use:**
>
> 1. Copy everything between `--- BEGIN PROMPT ---` and `--- END PROMPT ---`.
> 2. Replace every `{{PLACEHOLDER}}`. Delete sections that don't apply.
> 3. Paste into your agent of choice.
>
> The shape is biased toward **root-cause-first** debugging:
> reproduce → diagnose → fix → regression-test → verify. The single
> most common failure mode in agent-driven debugging is patching the
> symptom; this template forces the agent to surface a hypothesis
> before writing code.

---

--- BEGIN PROMPT ---

## 1. Working Agreement

You are my engineering partner on a bug investigation. Default
behaviors:

- **Reproduce before changing anything.** If you cannot reproduce, say
  so and propose how to capture more evidence — do not start guessing.
- **State a hypothesis before patching.** What's the root cause? Cite
  the specific `file:line` you suspect. Wait for my agreement on the
  hypothesis before writing the fix.
- **Fix the cause, not the symptom.** No try/catch swallowing, no
  defensive `if` checks that paper over an upstream invariant
  violation, no `any` / `// @ts-ignore` / `eslint-disable` to silence
  the compiler or linter.
- **Add a failing test first when feasible** — one that captures the
  bug. Make it pass with the fix. The test is the proof we shipped a
  real fix.
- **Read first.** Inspect `CLAUDE.md`, `AGENTS.md`,
  `.agents/rules/*`, and the affected files before writing code.
- **Match conventions already in the repo.**
- **One logical commit per change.** Conventional Commits (`fix:` for
  the fix, `test:` for the regression test if separated). Never
  `--no-verify`.
- **Ask one focused question on real ambiguity.** Don't invent
  requirements.

## 2. Bug Identity

- **Title:** {{BUG_TITLE}}
- **Tracking link:** {{ISSUE_OR_TICKET_URL_OR_NA}}
- **Reported by:** {{NAME_OR_HANDLE}}
- **Severity:** {{blocker | major | minor | trivial}}
- **First seen:** {{DATE_OR_VERSION_OR_COMMIT_SHA}}
- **Reproducibility:** {{always | intermittent — frequency | once}}

## 3. Environment

- **Affected workspace(s):** {{e.g. apps/web, packages/ui}}
- **Branch / commit:** {{BRANCH_OR_SHA}}
- **Runtime:** {{Node version, browser + version, OS, device}}
- **Data state:** {{empty DB | seeded | production-like | NA}}
- **Feature flags / env vars in play:** {{LIST | NA}}

## 4. Reproduction Steps

<!-- Be exact. The agent will follow these literally. -->

1. {{STEP_1}}
2. {{STEP_2}}
3. {{STEP_3}}

## 5. Expected vs. Actual

- **Expected:** {{WHAT_SHOULD_HAPPEN}}
- **Actual:** {{WHAT_HAPPENS_INSTEAD}}

## 6. Evidence Already Gathered

<!-- Paste relevant excerpts. Quote errors verbatim. -->

- **Error message / stack trace:**

  ```
  {{PASTE_VERBATIM_OR_NA}}
  ```

- **Screenshots / videos:** {{LINK_OR_NA}}
- **Recent commits suspected:** {{SHA — WHY_SUSPECTED | NA}}
- **`git bisect` result:** {{FIRST_BAD_COMMIT | NOT_RUN}}
- **Related logs / network calls:** {{PASTE_OR_LINK_OR_NA}}

## 7. What I've Already Ruled Out

<!--
Saves the agent from re-walking dead-end paths. Be honest — if you
haven't ruled anything out, write "nothing yet".
-->

- {{HYPOTHESIS_RULED_OUT_AND_WHY}}
- {{HYPOTHESIS_RULED_OUT_AND_WHY}}

## 8. Scope & Constraints

- **Allowed blast radius:** {{e.g. "fix only — no refactors", "small refactor OK if it removes the cause"}}
- **Files / areas off-limits:** {{LIST | NONE}}
- **Backward compatibility:** {{must preserve API X | none required}}
- **Performance regression budget:** {{e.g. no slowdown beyond 5%, NA}}
- **Deadline:** {{DATE | none}}

## 9. Definition of Done

- [ ] Failing test added that reproduces the bug (pre-fix).
- [ ] Test passes after the fix.
- [ ] Existing test suite passes (`pnpm test`, `pnpm typecheck`,
      `pnpm lint`, `pnpm e2e` if applicable).
- [ ] Repro steps in §4 no longer trigger the bug.
- [ ] Root cause documented in the commit message body.
- [ ] {{ANY_PROJECT_SPECIFIC_GATE}}

## 10. Risks & Open Questions

- **Risks of this fix:**
  - {{RISK_AND_MITIGATION}}
- **Open questions (please surface answers or propose options):**
  - {{QUESTION}}

## 11. References

- {{LINK_OR_PATH}} — {{WHAT_FOR}}
- {{LINK_OR_PATH}} — {{WHAT_FOR}}

## 12. GSD Workflow (Optional — skip if not using GSD)

If this repo uses the GSD planning skill set:

- **Standard bug (needs investigation):** `/gsd-debug` — runs the
  scientific-method debug loop with persistent state across context
  resets.
- **Bug already diagnosed, fix is small (≤ 2 files):** `/gsd-quick`
  or `/gsd-fast`.
- **Bug surfaced during code review or audit:** `/gsd-audit-fix`
  for autonomous audit-to-fix.
- **Post-mortem on a previously failed workflow:** `/gsd-forensics`.

Planning artifacts go under `.planning/<phase-name>/`. Do not edit
`.planning/codebase/*.md` by hand.

## 13. First Task

<!--
The single concrete thing to do RIGHT NOW. For bugs this is almost
always: "reproduce, then state your root-cause hypothesis."
-->

Start by:

{{FIRST_TASK_DESCRIPTION}}

<!--
Examples:
  • "Reproduce the bug locally using §4. Then state your root-cause
     hypothesis with file:line references. Wait for my agreement
     before writing the fix."
  • "Run /gsd-debug using the content above as input."
  • "Add a failing Vitest test that captures the bug, then stop."
-->

## 14. Output Format Expectations

- **Reproduction report:** "Reproduced ✅ / Not reproduced ❌" + the
  exact command/steps you ran.
- **Hypothesis:** one paragraph, with `file:line` citations and the
  causal chain (X happens → triggers Y → which violates Z).
- **For the fix:** show the diff; explain in one or two lines why this
  fix addresses the cause, not just the symptom.
- **For questions:** ask the smallest number that unblocks you
  (ideally one).
- **For status updates:** what changed, what's next, what's blocked —
  three lines max.

--- END PROMPT ---

---

## Appendix: Tips for filling this in

- **§4 Reproduction is the highest-leverage section.** A vague repro
  ("sometimes the page breaks") wastes more agent time than any other
  gap. If you can't write exact steps, paste a screen recording link.
- **§6 Quote errors verbatim.** Paraphrased errors strip the signal
  (line numbers, stack frames, error codes) the agent needs.
- **§7 Ruled-out hypotheses save more time than they look like they
  do.** They prevent the agent from re-running the dead ends you
  already tried.
- **§8 Allowed blast radius matters.** Without it, agents either
  refactor too much or refuse to touch surrounding code that's part
  of the cause.
- **§13 First Task should almost always be "reproduce + hypothesize"**
  — not "write the fix". Letting the agent jump to a fix is the
  fastest path to a symptom-patch.
