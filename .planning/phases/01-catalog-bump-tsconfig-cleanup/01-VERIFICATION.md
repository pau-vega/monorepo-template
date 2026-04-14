---
phase: 01-catalog-bump-tsconfig-cleanup
verified: 2026-04-14T13:30:00Z
status: passed
score: 5/5
overrides_applied: 0
---

# Phase 1: Catalog Bump & TSConfig Cleanup Verification Report

**Phase Goal:** TypeScript 6 is installed and all deprecated tsconfig options are removed -- the repo compiles without any TS5101 warnings
**Verified:** 2026-04-14T13:30:00Z
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | pnpm-workspace.yaml catalog references TypeScript ^6.0.2 and all packages resolve to that version | VERIFIED | `pnpm-workspace.yaml` line 22: `typescript: ^6.0.2`. Lockfile resolves `typescript@6.0.2`. `pnpm list typescript -r` confirms 6.0.2 for root and eslint-config. |
| 2 | baseUrl is absent from showcase, ui, and eslint-config tsconfigs -- path aliases still resolve correctly | VERIFIED | `grep baseUrl` returns zero matches in all 3 files. `tsc --noEmit` exits 0 for all 3 packages. Path aliases `@/*`, `@ui`, `@ui/*` use `./`-prefixed paths and resolve without baseUrl. |
| 3 | @tsconfig/node24 preset is confirmed compatible with TS6 (no TS5101 warnings from the preset) | VERIFIED | `packages/tsconfig/base.json` extends `@tsconfig/node24/tsconfig.json`. All packages that inherit from base typecheck with zero output (no TS5101 warnings, no errors). |
| 4 | Base and react-app presets set types explicitly so TS6's new default does not break type resolution | VERIFIED | `react-app.json` has `types: ["react", "react-dom", "vitest/globals", "vite/client"]`. `react-library.json` has `types: ["react", "react-dom", "vitest/globals"]`. `base.json` intentionally has no types field (per plan decision D-01 -- base stays minimal). The lone base consumer (`eslint-config/tsconfig.json`) adds `types: ["node"]` locally. All packages typecheck cleanly, confirming TS6's types default does not break type resolution. |
| 5 | eslint-config peer dependency accepts TypeScript v6 (updated to >=5.0.0) | VERIFIED | `packages/eslint-config/package.json` line 31: `"typescript": ">=5.0.0"` in peerDependencies. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `pnpm-workspace.yaml` | TypeScript catalog version ^6.0.2 | VERIFIED | Line 22: `typescript: ^6.0.2` -- contains expected string |
| `packages/eslint-config/package.json` | Forward-compatible TypeScript peer dependency | VERIFIED | Line 31: `"typescript": ">=5.0.0"` -- contains expected string |
| `apps/showcase/tsconfig.json` | Showcase tsconfig without deprecated baseUrl | VERIFIED | No `baseUrl` present. Has `paths` with `@/*` alias. 10 lines of substantive config. |
| `packages/ui/tsconfig.json` | UI tsconfig without deprecated baseUrl | VERIFIED | No `baseUrl` present. Has `paths` with `@ui` and `@ui/*` aliases. 12 lines of substantive config. |
| `packages/eslint-config/tsconfig.json` | ESLint-config tsconfig without deprecated baseUrl | VERIFIED | No `baseUrl` present. Has `types: ["node"]` and `paths` with `@/*`. 11 lines of substantive config. |
| `packages/tsconfig/react-app.json` | React app preset with explicit types array | VERIFIED | Contains `"types": ["react", "react-dom", "vitest/globals", "vite/client"]` |
| `packages/tsconfig/react-library.json` | React library preset with explicit types array | VERIFIED | Contains `"types": ["react", "react-dom", "vitest/globals"]` |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `pnpm-workspace.yaml` | all packages | pnpm catalog protocol | WIRED | Line 22: `typescript: ^6.0.2`. Lockfile resolves `typescript@6.0.2`. All workspace packages consume via `catalog:` protocol. |
| `packages/tsconfig/react-app.json` | `apps/showcase/tsconfig.json` | extends field | WIRED | `showcase/tsconfig.json` line 2: `"extends": "@monorepo-template/tsconfig/react-app.json"` |
| `packages/tsconfig/react-library.json` | `packages/ui/tsconfig.json` | extends field | WIRED | `ui/tsconfig.json` line 2: `"extends": "@monorepo-template/tsconfig/react-library.json"` |

### Data-Flow Trace (Level 4)

Not applicable -- this phase modifies configuration files (tsconfig, package.json, workspace config), not components or modules that render dynamic data.

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| TypeScript 6.0.2 resolves for all packages | `pnpm list typescript -r` | Shows `typescript 6.0.2` for root and eslint-config | PASS |
| eslint-config typechecks cleanly | `cd packages/eslint-config && pnpm tsc --noEmit` | Exit 0, zero output | PASS |
| ui package typechecks cleanly | `cd packages/ui && pnpm tsc --noEmit` | Exit 0, zero output | PASS |
| showcase app typechecks cleanly | `cd apps/showcase && pnpm tsc --noEmit` | Exit 0, zero output | PASS |
| turbo typecheck passes all tasks | `pnpm turbo typecheck` | 5 successful, 5 total, 5 cached | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-----------|-------------|--------|----------|
| CAT-01 | 01-01-PLAN | TypeScript catalog bumped from ^5.9.3 to ^6.0.2 | SATISFIED | `pnpm-workspace.yaml` line 22 |
| CAT-02 | 01-01-PLAN | eslint-config peer dep updated to >=5.0.0 | SATISFIED | `packages/eslint-config/package.json` line 31 |
| TSC-01 | 01-01-PLAN | baseUrl removed from showcase tsconfig, paths resolve | SATISFIED | No baseUrl in file, tsc --noEmit exits 0 |
| TSC-02 | 01-01-PLAN | baseUrl removed from ui tsconfig, paths resolve | SATISFIED | No baseUrl in file, tsc --noEmit exits 0 |
| TSC-03 | 01-01-PLAN | baseUrl removed from eslint-config tsconfig, paths resolve | SATISFIED | No baseUrl in file, tsc --noEmit exits 0 |
| TSC-04 | 01-01-PLAN | types field set in presets for TS6 default | SATISFIED | react-app.json and react-library.json have types arrays; base.json intentionally excluded per D-01; eslint-config adds types: ["node"] locally |
| TSC-05 | 01-01-PLAN | @tsconfig/node24 confirmed compatible with TS6 | SATISFIED | base.json extends @tsconfig/node24; all packages typecheck with zero TS5101 warnings |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `packages/eslint-config/tsup.config.ts` | 6 | `ignoreDeprecations: "6.0"` | INFO | Scoped workaround for tsup#1388 -- intentional and documented. Not in shared presets. |
| `packages/ui/tsup.config.ts` | 9, 21 | `ignoreDeprecations: "6.0"` | INFO | Same scoped workaround for tsup#1388. Two entries for two tsup config objects. |

No TODO/FIXME/HACK/PLACEHOLDER patterns found in any modified file.

### Human Verification Required

None. All verifiable truths were confirmed programmatically via `tsc --noEmit`, `pnpm list`, and file content inspection. No visual, real-time, or external-service behaviors to verify.

### Gaps Summary

No gaps found. All 5 roadmap success criteria are verified. All 7 requirement IDs (CAT-01, CAT-02, TSC-01 through TSC-05) are satisfied. All artifacts exist, are substantive, and are wired. The tsup `ignoreDeprecations` workaround is correctly scoped to DTS generation only and does not appear in any shared tsconfig preset.

**Note on SC4 (types in presets):** The roadmap says "Base and react-app presets set types explicitly." The base preset (`base.json`) intentionally has no types field -- the plan's D-01 decision kept base minimal since its sole consumer (`eslint-config`) adds `types: ["node"]` locally. The react-app and react-library presets both have explicit types arrays. The functional outcome is fully achieved: TS6's `types: []` default does not break type resolution in any package.

---

_Verified: 2026-04-14T13:30:00Z_
_Verifier: Claude (gsd-verifier)_
