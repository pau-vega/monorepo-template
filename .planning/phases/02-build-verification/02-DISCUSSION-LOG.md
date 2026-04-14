# Phase 2: Build & Verification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-14
**Phase:** 02-build-verification
**Areas discussed:** Fix scope boundaries, tsup workaround lifecycle, Verification depth

---

## Fix Scope Boundaries

### Unexpected error handling

| Option | Description | Selected |
|--------|-------------|----------|
| Fix everything (Recommended) | Fix all errors found during verification — TS6-related or not. Clean slate for the template. | ✓ |
| Fix TS6 only, log the rest | Only fix TS6-caused breakage. Pre-existing issues get logged as findings but not fixed. | |
| You decide per-case | Claude evaluates each error and fixes trivial ones, logs complex ones for later. | |

**User's choice:** Fix everything
**Notes:** Template should be a clean slate with zero errors

### Test failure policy

| Option | Description | Selected |
|--------|-------------|----------|
| Investigate root cause (Recommended) | Understand why the test fails under TS6 before applying a fix — prevents masking real issues. | ✓ |
| Just make it pass | Pragmatic approach: update assertions or types to get green, move on. | |
| You decide | Claude judges based on the nature of the failure. | |

**User's choice:** Investigate root cause
**Notes:** None

---

## tsup Workaround Lifecycle

### Tracking the ignoreDeprecations workaround

| Option | Description | Selected |
|--------|-------------|----------|
| Code comment + TODO (Recommended) | Add a comment in each tsup.config.ts explaining why ignoreDeprecations is there, with a link to tsup#1388. Easy to grep for later. | ✓ |
| Just leave it | The workaround is already scoped and harmless. No tracking needed — revisit when tsup releases a fix. | |
| Remove workaround, accept no DTS | Strip ignoreDeprecations entirely. If tsup can't generate DTS, skip DTS output until tsup fixes the bug. | |

**User's choice:** Code comment + TODO
**Notes:** None

---

## Verification Depth

### Output quality check

| Option | Description | Selected |
|--------|-------------|----------|
| Pass/fail only (Recommended) | Run tsc --noEmit, turbo build, turbo test. If all green with zero warnings, phase is done. DTS files existing is enough. | ✓ |
| Spot-check DTS output | Also open a few generated .d.ts files to verify they look correct — not just that they were generated. | |
| Full output audit | Check DTS correctness, compare bundle sizes before/after, verify sourcemaps. Thorough but slower. | |

**User's choice:** Pass/fail only
**Notes:** None

### Orchestration approach

| Option | Description | Selected |
|--------|-------------|----------|
| Turbo orchestration (Recommended) | Use turbo typecheck, turbo build, turbo test — respects task graph and caching. Standard monorepo approach. | ✓ |
| Package by package | Run tsc/build/test per-package in dependency order. Slower but isolates failures precisely. | |
| You decide | Claude picks the approach based on whether errors are found. | |

**User's choice:** Turbo orchestration
**Notes:** None

### TS5101 warning check

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, grep for TS5101 (Recommended) | After each command, explicitly check output for TS5101 deprecation warnings — not just exit code. | ✓ |
| Exit code is enough | If tsc/build exits 0, trust that there are no warnings. Faster. | |

**User's choice:** Yes, grep for TS5101
**Notes:** None

---

## Claude's Discretion

- Order of verification commands
- Failure isolation strategy (per-package if turbo reports errors)
- Exact wording of tsup workaround code comments

## Deferred Ideas

None — discussion stayed within phase scope
