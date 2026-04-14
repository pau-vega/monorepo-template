# Phase 2: Build & Verification - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Confirm the full monorepo build, typecheck, and test run pass cleanly under TypeScript 6 — zero errors, zero deprecation warnings, working DTS output. Fix any breakage found during verification. This is the final validation that the TS6 migration (Phase 1) is complete and correct.

</domain>

<decisions>
## Implementation Decisions

### Fix scope boundaries
- **D-01:** Fix everything found during verification — TS6-related or not. The template should be a clean slate with zero errors and zero warnings.
- **D-02:** Investigate root cause of any test failure before applying a fix. Do not mask real issues by updating assertions blindly.

### tsup workaround lifecycle
- **D-03:** Add a code comment in each tsup.config.ts (ui and eslint-config) explaining why `ignoreDeprecations: "6.0"` is in `dts.compilerOptions`, with a link to tsup#1388. This makes the workaround grep-able for future cleanup.

### Verification approach
- **D-04:** Use turbo orchestration for all verification commands (`turbo typecheck`, `turbo build`, `turbo test`). Standard monorepo approach — respects task graph and caching.
- **D-05:** Pass/fail verification only. No output quality audit, DTS spot-checking, or bundle size comparison. If all commands exit cleanly, the phase is done.
- **D-06:** Explicitly grep for TS5101 deprecation warnings in command output — do not rely solely on exit code. A zero exit code with deprecation warnings in stderr/stdout is still a failure.

### Claude's Discretion
- Order of verification commands (typecheck → build → test, or different sequence)
- How to isolate failures if turbo reports errors (may need per-package runs)
- Exact wording of tsup workaround comments

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Build configuration
- `packages/ui/tsup.config.ts` — UI package tsup config with scoped `ignoreDeprecations: "6.0"` in DTS compilerOptions
- `packages/eslint-config/tsup.config.ts` — ESLint config tsup with same scoped workaround
- `turbo.json` — Task graph defining typecheck, build, test dependencies and caching

### TypeScript configuration
- `packages/tsconfig/base.json` — Base tsconfig extending @tsconfig/node24
- `packages/tsconfig/react-app.json` — React app preset with explicit `types` field (set in Phase 1)
- `packages/tsconfig/react-library.json` — React library preset with explicit `types` field (set in Phase 1)

### Requirements
- `.planning/REQUIREMENTS.md` — BLD-01 through BLD-04 (typecheck, build, DTS, tests)

### Known issues
- tsup#1388 — DTS generation bug requiring `ignoreDeprecations: "6.0"` in tsup's internal tsc invocation

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Turbo task graph already defines `typecheck`, `build`, `test` tasks with proper dependency ordering
- tsup configs already have the scoped DTS workaround from Phase 1

### Established Patterns
- pnpm catalog protocol controls TypeScript version — single source of truth
- Turbo caching means repeated runs are fast after first verification pass
- tsup handles DTS generation separately from tsc — two different compilation paths to verify

### Integration Points
- `turbo typecheck` runs `tsc --noEmit` across all packages
- `turbo build` triggers tsup in ui and eslint-config packages, plus Vite in showcase
- `turbo test` runs Vitest across packages with test suites

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-build-verification*
*Context gathered: 2026-04-14*
