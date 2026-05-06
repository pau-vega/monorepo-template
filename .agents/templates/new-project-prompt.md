# New Project Briefing — Prompt Template

> A fillable prompt you paste into any AI coding agent (Claude Code, Cursor,
> Aider, Cline, Codex, etc.) when you start a new project from this monorepo
> template. Replace every `{{PLACEHOLDER}}` with concrete content. Delete
> sections that don't apply. Keep the structure — agents perform best when
> context is layered in a predictable order.
>
> **How to use:**
>
> 1. Fork this template repo into a new repository.
> 2. Open the new repo in your agent of choice.
> 3. Copy the prompt below (everything between the `--- BEGIN PROMPT ---`
>    and `--- END PROMPT ---` markers), fill it in, and submit.
> 4. The agent will read this prompt, the existing `CLAUDE.md` /
>    `AGENTS.md`, and `.agents/rules/*` and start scaffolding.
>
> **Why this shape?** It mirrors Anthropic's 10-module prompt pattern
> (task context → tone → background → rules → examples → history →
> request → thinking → format → prefill) compressed into the order an
> agent actually needs when bootstrapping a project: identity first,
> intent second, constraints third, working agreement last. Outcome-based
> framing (what "done" looks like) beats step-by-step instructions for
> autonomous work.

---

--- BEGIN PROMPT ---

## 1. Role & Working Agreement

You are my engineering partner on this project. Default behaviors:

- **Plan before large changes.** Surface assumptions and trade-offs before
  writing code that touches more than ~3 files.
- **Read before writing.** Inspect `CLAUDE.md`, `AGENTS.md`,
  `.agents/rules/*`, `package.json`, `turbo.json`, and any `.planning/`
  directory before proposing structure.
- **Match existing conventions.** Naming, formatting, error handling,
  module layout — copy the patterns already in the repo unless I ask
  otherwise.
- **Ask, don't guess, on ambiguity.** If a requirement below is unclear
  or two interpretations are equally valid, ask one focused question
  rather than picking silently.
- **Show work in small commits.** One logical change per commit.
  Conventional Commits format. Never `--no-verify`.
- **Stop on failing tests, type errors, or lint errors.** Don't paper
  over them with `any`, `// @ts-ignore`, `eslint-disable`, or skipped
  tests.

Communicate concisely. Skip filler. Use `file_path:line_number` when
referencing code.

## 2. Project Identity

- **Name:** {{PROJECT_NAME}}
- **One-liner:** {{ONE_LINER}}
  <!-- One sentence: what it is + for whom + the value it delivers. -->
- **Project type:** {{web-app | mobile-app | CLI | library | service | monorepo | other}}
- **Stage:** {{greenfield | rewrite | extension-of-existing}}
- **Repo URL:** {{REPO_URL}}
- **Primary maintainer:** {{NAME / EMAIL / HANDLE}}

## 3. Background & Problem

<!--
Why does this project exist? What is the user pain or business need?
What was tried before, and why wasn't it enough? Keep it to a paragraph
or two — agents do not need a wiki.
-->

- **Problem:** {{PROBLEM_STATEMENT}}
- **Current state / status quo:** {{HOW_IT_WORKS_TODAY_OR_NA}}
- **Why now:** {{TRIGGER_OR_DEADLINE}}

## 4. Target Users & Stakeholders

- **Primary users:** {{ROLE / PERSONA}} — {{WHAT_THEY_DO_WITH_IT}}
- **Secondary users:** {{ROLE / PERSONA}} — {{WHAT_THEY_DO_WITH_IT}}
- **Stakeholders / approvers:** {{TEAMS_OR_PEOPLE_WHOSE_SIGNOFF_MATTERS}}
- **Estimated scale:** {{users / requests-per-day / data-volume / NA}}

## 5. Goals (Outcomes)

<!--
Outcome-based, not task-based. "Users can X in under Y seconds" beats
"Build a search bar". Order by priority. 3–7 goals is healthy.
-->

1. {{OUTCOME_1}}
2. {{OUTCOME_2}}
3. {{OUTCOME_3}}

## 6. Non-Goals

<!--
The single highest-leverage section for keeping an agent on rails.
Be aggressive: list things that look in-scope but aren't.
-->

- {{NON_GOAL_1}}
- {{NON_GOAL_2}}

## 7. Scope

- **In scope:** {{FEATURES_OR_AREAS_INCLUDED}}
- **Out of scope:** {{FEATURES_OR_AREAS_EXCLUDED}}
- **Future / maybe-later:** {{IDEAS_PARKED_FOR_NEXT_MILESTONE}}

## 8. Success Criteria / Definition of Done

<!--
How will we know this project shipped successfully? Mix qualitative and
quantitative. The agent will use these as the verification target.
-->

- [ ] {{MEASURABLE_CRITERION_1}}
- [ ] {{MEASURABLE_CRITERION_2}}
- [ ] {{MEASURABLE_CRITERION_3}}

## 9. Tech Stack

This project starts from the `base-monorepo-template`. The baseline
stack is already wired up — do not replace pieces unless this section
explicitly says so.

**Inherited (do not change without asking):**

- TypeScript (strict, `noUncheckedIndexedAccess`)
- Node.js 24+, pnpm 10
- Turborepo for task orchestration
- React 19, Vite 8, Tailwind CSS 4, Base UI React, shadcn
- ESLint 10 (flat config) + Prettier (no semicolons, 120 cols)
- Vitest (unit) + Playwright (E2E)
- lefthook + commitlint (Conventional Commits)

**Project-specific additions:**

- {{LIBRARY}} — {{WHY_NEEDED}}
- {{LIBRARY}} — {{WHY_NEEDED}}

**Project-specific replacements (require justification):**

- {{REPLACED_PIECE}} → {{NEW_CHOICE}} — {{REASON}}

## 10. Architecture Direction

<!--
Just enough for the agent to make consistent choices. If you don't have
opinions yet, write "TBD — propose options first".
-->

- **Workspaces planned:** {{e.g. apps/web, apps/api, packages/ui, packages/db}}
- **Data flow:** {{client-only | client+API | event-driven | other}}
- **Persistence:** {{none | localStorage | Postgres+Drizzle | Supabase | other}}
- **Auth:** {{none | Clerk | Auth.js | custom | other}}
- **Deployment target:** {{Vercel | Cloudflare | self-hosted | static | other}}
- **Diagram / ADRs:** {{LINK_OR_NA}}

## 11. Domain Model & Key Concepts

<!--
Glossary. Names matter — agents will pick them up and use them
everywhere. Define the 5–10 nouns/verbs the codebase will live around.
-->

- **{{TERM}}** — {{DEFINITION}}
- **{{TERM}}** — {{DEFINITION}}

## 12. Constraints

- **Performance:** {{e.g. LCP < 2s on 4G, p95 API latency < 200ms, NA}}
- **Compatibility:** {{browsers, devices, Node versions, accessibility levels}}
- **Compliance / privacy:** {{GDPR | HIPAA | SOC2 | none}}
- **Security:** {{auth model, secret handling, threat surface notes}}
- **Budget:** {{infra cost ceiling, paid-API ceiling, NA}}
- **Timeline:** {{milestones / deadlines / "no deadline"}}
- **Team / capacity:** {{solo | N engineers | + designer | + PM}}

## 13. Quality Bars

- **Test coverage:** {{target %, or "all critical paths"}}
- **Test types required:** {{unit | integration | E2E | visual | a11y}}
- **Accessibility:** {{WCAG 2.2 AA | other | NA}}
- **Observability:** {{logging | tracing | error reporting (e.g. Sentry) | NA}}
- **Documentation:** {{README only | full docs site | Storybook | NA}}
- **Performance budget enforced in CI:** {{yes/no — what tool}}

## 14. Conventions (Inherited)

The agent must already follow:

- `CLAUDE.md` (and `AGENTS.md` symlink) at repo root — project-wide
  guidance.
- `.agents/rules/typescript.md` — TS conventions (interface extends over
  `&`, discriminated unions, no enums, `import type`, no default
  exports, etc.).
- `.prettierrc` — formatter config.
- `eslint.config.ts` files in each workspace.

**Project-specific conventions to add (if any):**

- {{CONVENTION_1}}
- {{CONVENTION_2}}

## 15. External Integrations

<!--
APIs, SDKs, third-party services the project must talk to. Include the
docs URL — agents browse better than they remember.
-->

| Service        | Purpose          | Docs URL          | Auth method          |
| -------------- | ---------------- | ----------------- | -------------------- |
| {{SERVICE}}    | {{WHAT_FOR}}     | {{DOCS_URL}}      | {{API_KEY / OAuth}}  |

## 16. Deliverables & Milestones

<!--
What the agent should produce, in order. Even rough phases help —
agents plan better when they see the arc, not just the next step.
-->

1. **{{MILESTONE_1}}** — {{OUTCOME}}
2. **{{MILESTONE_2}}** — {{OUTCOME}}
3. **{{MILESTONE_3}}** — {{OUTCOME}}

## 17. Risks & Open Questions

- **Risks:**
  - {{RISK_AND_MITIGATION}}
- **Open questions (please surface answers or propose options):**
  - {{QUESTION}}
  - {{QUESTION}}

## 18. References & Inspiration

<!--
Links, screenshots, design files, competitor products, prior art.
Agents use these for tone, style, and capability reference.
-->

- {{LINK_OR_PATH}} — {{WHAT_FOR}}
- {{LINK_OR_PATH}} — {{WHAT_FOR}}

## 19. GSD Workflow (Optional — skip if you're not using GSD)

This template ships with the GSD planning skill set. If you want to use
it, follow this routing:

- **Brand new project:** run `/gsd-new-project` first. It uses the
  contents of this prompt to produce `PROJECT.md`, then `ROADMAP.md`
  with phases, then per-phase `SPEC.md` / `PLAN.md`.
- **New milestone on an existing project:** run `/gsd-new-milestone`.
- **Single phase / feature:** `/gsd-spec-phase` →
  `/gsd-discuss-phase` → `/gsd-plan-phase` → `/gsd-execute-phase`
  → `/gsd-verify-work`.
- **Quick task (≤ 1 hour, low-risk):** `/gsd-quick`.
- **Bug investigation:** `/gsd-debug`.
- **Code review on a PR:** `/gsd-code-review` or `/gsd-ship`.

Planning artifacts live under `.planning/`. Do not edit
`.planning/codebase/*.md` by hand — those are produced by
`/gsd-map-codebase`.

If you are using a different agent system (vanilla Claude Code,
Cursor, Aider, etc.), ignore this section and just work the
deliverables list in §16.

## 20. First Task

<!--
The single concrete thing the agent should do RIGHT NOW after reading
the prompt. Without this, agents tend to either freeze or generate a
plan you didn't ask for.
-->

Start by:

{{FIRST_TASK_DESCRIPTION}}

<!--
Examples:
  • "Read the entire prompt + CLAUDE.md, then propose a 3–5 phase
     roadmap as a numbered list. Wait for my approval before writing
     any code or planning files."
  • "Run /gsd-new-project using the content above as input."
  • "Scaffold the apps/api workspace using Hono + Drizzle, then stop."
-->

## 21. Output Format Expectations

When you respond:

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

- **Less is more for non-goals.** A sharp non-goal list saves more agent
  tokens than any other section.
- **Outcomes > tasks in §5.** "Users can sign in with Google in under
  10 seconds" beats "Add a Google login button".
- **§9 Tech Stack:** only list *additions* and *replacements* to the
  monorepo baseline. The baseline is already documented in `CLAUDE.md`
  and `.planning/codebase/STACK.md`; restating it wastes context.
- **§19 First Task:** the most-skipped, highest-leverage section.
  Without it, agents either freeze or sprint in the wrong direction.
- **Keep it under ~600 lines once filled.** If a section keeps growing,
  promote it to its own doc (`docs/architecture.md`,
  `docs/domain-glossary.md`) and link from the prompt.
- **Iterate.** Ship a v1, run a phase, then revise this prompt with the
  surprises you learned. The prompt is a living artifact, not a spec.
