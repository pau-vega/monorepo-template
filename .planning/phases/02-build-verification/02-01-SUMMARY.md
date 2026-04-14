---
phase: 02-build-verification
plan: 01
subsystem: infra
tags: [typescript, tsup, turbo, dts, typecheck, build, vitest]

# Dependency graph
requires:
  - phase: 01-catalog-bump-tsconfig-cleanup
    provides: TypeScript 6.0.2 upgrade, baseUrl removal, tsup DTS ignoreDeprecations workaround

provides:
  - Documented tsup DTS workaround with tsup#1388 references in both config files
  - Verified clean turbo typecheck (zero TS5101 warnings, exit 0)
  - Verified clean turbo build (zero TS5101 warnings, exit 0, DTS files generated)
  - Verified all tests pass under TypeScript 6 (10 tests, 0 failures)

affects: [future-phases, consumers-of-ui-package]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "tsup DTS workaround comments: add tsup#1388 link above every ignoreDeprecations line for grep-able cleanup tracking"

key-files:
  created: []
  modified:
    - packages/ui/tsup.config.ts
    - packages/eslint-config/tsup.config.ts

key-decisions:
  - "tsup DTS workaround comments added above each ignoreDeprecations line — makes future cleanup grep-able when tsup#1388 is fixed"
  - "pnpm install required in worktree before turbo commands — worktrees do not inherit node_modules from main repo"

patterns-established:
  - "Deprecation-workaround comments: always link upstream issue (e.g. tsup#1388) and include 'remove when X fixes this' so future maintainers know when to clean up"

requirements-completed: [BLD-01, BLD-02, BLD-03, BLD-04]

# Metrics
duration: 15min
completed: 2026-04-14
---

# Phase 2 Plan 1: Build Verification Summary

**TypeScript 6 migration verified clean: turbo typecheck, build, and test all exit 0 with zero TS5101 deprecation warnings; tsup workaround documented with tsup#1388 links in both config files**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-14T15:30:00Z
- **Completed:** 2026-04-14T15:45:00Z
- **Tasks:** 3 completed (1 code change, 2 verification)
- **Files modified:** 2

## Accomplishments

- Added tsup#1388 workaround comments above every `ignoreDeprecations: "6.0"` line in both tsup config files (2 occurrences in ui, 1 in eslint-config), making the workaround grep-able for future cleanup
- Verified `pnpm turbo typecheck --force` exits 0 across all 4 packages (eslint-config, ui, tsconfig, showcase) with zero TS5101/deprecation warnings in output
- Verified `pnpm turbo build --force` exits 0 with DTS files generated in both `packages/ui/dist/` (55+ .d.ts files) and `packages/eslint-config/dist/` (index.d.ts)
- Verified `pnpm turbo test --force` exits 0 with all 10 tests passing (2 test files in packages/ui — utils.test.ts and button.test.tsx)

## Task Commits

Each task was committed atomically:

1. **Task 1: Document tsup ignoreDeprecations workaround** - `214daaa` (docs)
2. **Task 2: Typecheck and build verification** - no commit (verification-only)
3. **Task 3: Test suite verification** - no commit (verification-only)

## Files Created/Modified

- `packages/ui/tsup.config.ts` — Added two workaround comment blocks (above each of the two `dts:` entries)
- `packages/eslint-config/tsup.config.ts` — Added one workaround comment block (above the single `dts:` entry)

## Decisions Made

- Used `pnpm install --frozen-lockfile` in the worktree before running turbo commands — worktrees do not inherit node_modules from the parent repo checkout, so dependencies must be installed explicitly
- Task 2 and Task 3 generated no commits (verification-only work with no source changes needed)

## Deviations from Plan

None - plan executed exactly as written. All acceptance criteria met on first run. No TypeScript errors, no deprecation warnings, no test failures found.

## Issues Encountered

- **Worktree missing node_modules:** The git worktree at `.claude/worktrees/agent-a32a29b9` had no node_modules directory. Running `pnpm install --frozen-lockfile` installed all dependencies in ~5s using the existing lockfile, unblocking turbo execution. Not a code issue — expected worktree setup behavior.
- **Working tree state after reset:** The `git reset --soft` to align the worktree branch to the correct base commit left working tree files at an older state. Resolved by running `git checkout HEAD -- <files>` to restore all modified files to their HEAD state before applying plan edits.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 2 is the final phase. All requirements satisfied:
- BLD-01: turbo typecheck exits 0 with zero TS5101 warnings — DONE
- BLD-02: turbo build exits 0 with zero TS5101 warnings — DONE
- BLD-03: DTS files generated correctly in both package dist/ directories — DONE
- BLD-04: All tests pass under TypeScript 6 — DONE

The TypeScript 6 migration is complete. The template is a clean slate for new projects — TypeScript 6.0.2, zero deprecation warnings in shared tsconfigs, scoped workaround for tsup#1388 documented for future cleanup.

---
*Phase: 02-build-verification*
*Completed: 2026-04-14*
