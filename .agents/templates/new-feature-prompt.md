# New Feature — Prompt Template

> A fillable prompt for adding a feature to an **existing** project.
> Use [`new-project-prompt.md`](./new-project-prompt.md) instead if
> you're starting from scratch, [`bugfix-prompt.md`](./bugfix-prompt.md)
> for defect work, or [`refactor-prompt.md`](./refactor-prompt.md) for
> behavior-preserving restructuring.
>
> **How to use:**
>
> 1. Copy everything between `--- BEGIN PROMPT ---` and `--- END PROMPT ---`.
> 2. Replace every `{{PLACEHOLDER}}`. Delete sections that don't apply.
> 3. Paste into your agent of choice.
>
> The shape mirrors the project-bootstrap template but scoped down:
> identity → why → outcomes → non-goals → acceptance → constraints →
> working agreement → first task. Outcome-based framing and an explicit
> non-goals list keep the agent inside the box you intend.

---

--- BEGIN PROMPT ---

## 1. Working Agreement

You are my engineering partner. For this feature:

- **Read first.** Inspect `CLAUDE.md`, `AGENTS.md`, `.agents/rules/*`,
  and the directory you'll be touching, before writing code.
- **Match conventions already in the repo** — naming, file layout,
  error handling, test style. Do not introduce new patterns unless
  this prompt asks for them.
- **Plan before writing code that touches more than ~3 files.** Surface
  trade-offs and the option you'd pick. Wait for approval.
- **One logical commit per change.** Conventional Commits. Never
  `--no-verify`.
- **Stop on failing tests, type errors, or lint errors.** Fix the cause;
  don't suppress with `any`, `// @ts-ignore`, `eslint-disable`, or
  skipped tests.
- **Ask one focused question on real ambiguity.** Don't invent
  requirements.

## 2. Feature Identity

- **Name:** {{FEATURE_NAME}}
- **One-liner:** {{ONE_LINER}}
  <!-- One sentence: what the feature does + for whom + the value. -->
- **Tracking link:** {{ISSUE_OR_TICKET_URL_OR_NA}}
- **Owner:** {{NAME_OR_HANDLE}}
- **Target workspace(s):** {{e.g. apps/web, packages/ui}}

## 3. Why This, Why Now

- **User / business problem:** {{PROBLEM}}
- **Evidence it matters:** {{DATA / FEEDBACK / SUPPORT_TICKETS / NA}}
- **Trigger:** {{DEADLINE / BLOCKER / CUSTOMER_COMMITMENT / NA}}

## 4. Users & Use Cases

- **Primary user:** {{ROLE / PERSONA}}
- **Top 1–3 use cases:**
  1. {{USE_CASE_1}}
  2. {{USE_CASE_2}}
  3. {{USE_CASE_3}}

## 5. Goals (Outcomes)

<!-- Outcome-based, ordered by priority. 2–5 goals is healthy. -->

1. {{OUTCOME_1}}
2. {{OUTCOME_2}}
3. {{OUTCOME_3}}

## 6. Non-Goals

<!-- The single sharpest tool for keeping scope honest. -->

- {{NON_GOAL_1}}
- {{NON_GOAL_2}}

## 7. Acceptance Criteria

<!--
Concrete, testable. The agent will use these as the verification target.
Prefer Given/When/Then or numbered checkboxes.
-->

- [ ] {{CRITERION_1}}
- [ ] {{CRITERION_2}}
- [ ] {{CRITERION_3}}

## 8. Design & UX

- **Mockups / specs:** {{LINK_OR_NA}}
- **Existing components to reuse:** {{e.g. Button, Card from packages/ui}}
- **New components needed:** {{NAME — PURPOSE | NA}}
- **States to cover:** {{loading, empty, error, success, disabled, ...}}
- **A11y requirements:** {{WCAG 2.2 AA | keyboard | screen reader | NA}}

## 9. Data & APIs

- **New data shapes:** {{TYPES_OR_SCHEMAS | NA}}
- **APIs touched:** {{INTERNAL / EXTERNAL — endpoint + docs URL}}
- **Auth / permissions:** {{WHO_CAN_DO_THIS | NA}}
- **Migrations needed:** {{YES + WHAT | NO}}

## 10. Constraints

- **Performance:** {{e.g. interaction < 100ms, bundle delta < 10kb, NA}}
- **Compatibility:** {{browsers, viewports, locales, devices}}
- **Security / privacy:** {{PII handling, secrets, threat surface | NA}}
- **Feature flags:** {{flag name + default | not behind a flag}}
- **Rollout plan:** {{dark launch | gradual | full | NA}}

## 11. Test Strategy

- **Unit (Vitest):** {{what to cover}}
- **Integration:** {{what to cover | NA}}
- **E2E (Playwright):** {{user journeys to script | NA}}
- **Visual / a11y:** {{tools and scope | NA}}
- **Manual QA checklist:** {{steps the agent should hand back}}

## 12. Out-of-Repo Touchpoints

- **Docs to update:** {{README, CHANGELOG, design system docs, NA}}
- **Other teams to notify:** {{NAMES / CHANNELS | NA}}
- **Analytics events to add:** {{EVENT_NAME — PROPS | NA}}

## 13. Risks & Open Questions

- **Risks:**
  - {{RISK_AND_MITIGATION}}
- **Open questions (please surface answers or propose options):**
  - {{QUESTION}}

## 14. References

- {{LINK_OR_PATH}} — {{WHAT_FOR}}
- {{LINK_OR_PATH}} — {{WHAT_FOR}}

## 15. GSD Workflow (Optional — skip if not using GSD)

If this repo uses the GSD planning skill set, route as follows:

- **Standard feature (≥ 1 hour, multi-file):**
  `/gsd-spec-phase` → `/gsd-discuss-phase` → `/gsd-plan-phase` →
  `/gsd-execute-phase` → `/gsd-verify-work` → `/gsd-ship`.
- **Quick task (≤ 1 hour, low-risk, ≤ 2 files):** `/gsd-quick`.
- **Trivial change (typo, copy fix, single-line tweak):** `/gsd-fast`.
- **UI-heavy work:** start with `/gsd-ui-phase` to lock the design
  contract before planning.
- **AI / LLM integration:** start with `/gsd-ai-integration-phase`.

Planning artifacts go under `.planning/<phase-name>/`. Do not edit
`.planning/codebase/*.md` by hand — those come from
`/gsd-map-codebase`.

## 16. First Task

<!--
The single concrete thing to do RIGHT NOW after reading the prompt.
Without this, agents either freeze or sprint in the wrong direction.
-->

Start by:

{{FIRST_TASK_DESCRIPTION}}

<!--
Examples:
  • "Read the prompt + relevant existing files, then propose 2 design
     options as a numbered list with trade-offs. Wait for approval."
  • "Run /gsd-spec-phase using the content above as input."
  • "Scaffold a stub component at packages/ui/src/components/{{X}}.tsx
     and a passing test, then stop."
-->

## 17. Output Format Expectations

- **For plans / proposals:** numbered list, no fluff, surface trade-offs
  and the option you'd pick.
- **For code changes:** show the diff or full file content; cite
  `file:line` for reference points.
- **For questions:** ask the smallest number that unblocks you (ideally
  one).
- **For status updates:** what changed, what's next, what's blocked —
  three lines max.

--- END PROMPT ---

---

## Appendix: Tips for filling this in

- **Outcomes > tasks in §5.** "User can drag-reorder a list and the
  order persists across reload" beats "Add drag-and-drop".
- **Non-goals are cheap and load-bearing.** One sharp non-goal saves
  more agent tokens than three extra goals.
- **§7 Acceptance criteria are the verification target.** If you
  wouldn't accept the PR without it, write it down.
- **§16 First Task is the most-skipped, highest-leverage section.**
  Without it, agents freeze or sprint sideways.
- **Delete sections that don't apply.** Empty sections still cost
  context tokens.
