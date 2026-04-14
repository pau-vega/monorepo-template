# Roadmap: TypeScript 6 Migration

## Overview

A narrow, atomic migration from TypeScript 5.9.3 to TypeScript 6.x in the base monorepo template. Phase 1 lands the catalog bump and all tsconfig deprecation fixes together — splitting them would leave CI broken. Phase 2 confirms the full build, typecheck, and test suite passes with the new compiler, handling any toolchain edge cases (tsup DTS bug) along the way.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Catalog Bump & TSConfig Cleanup** - Upgrade TypeScript to v6 and remove all deprecated config options atomically
- [ ] **Phase 2: Build & Verification** - Confirm the monorepo builds, typechecks, and tests pass cleanly under the new compiler

## Phase Details

### Phase 1: Catalog Bump & TSConfig Cleanup
**Goal**: TypeScript 6 is installed and all deprecated tsconfig options are removed — the repo compiles without any TS5101 warnings
**Depends on**: Nothing (first phase)
**Requirements**: CAT-01, CAT-02, TSC-01, TSC-02, TSC-03, TSC-04, TSC-05
**Success Criteria** (what must be TRUE):
  1. `pnpm-workspace.yaml` catalog references TypeScript ^6.0.2 and all packages resolve to that version
  2. `baseUrl` is absent from showcase, ui, and eslint-config tsconfigs — path aliases still resolve correctly
  3. `@tsconfig/node24` preset is confirmed compatible with TS6 (no TS5101 warnings from the preset)
  4. Base and react-app presets set `types` explicitly so TS6's new default does not break type resolution
  5. eslint-config peer dependency accepts TypeScript v6 (updated to `>=5.0.0`)
**Plans:** 1 plan

Plans:
- [x] 01-01-PLAN.md — Bump TS catalog, remove baseUrl, add types to presets, verify zero warnings

### Phase 2: Build & Verification
**Goal**: The full monorepo build, typecheck, and test run pass cleanly under TypeScript 6 — zero errors, zero deprecation warnings, working DTS output
**Depends on**: Phase 1
**Requirements**: BLD-01, BLD-02, BLD-03, BLD-04
**Success Criteria** (what must be TRUE):
  1. `tsc --noEmit` passes across all packages with zero errors and zero TS5101 warnings
  2. `turbo build` completes successfully with no TypeScript deprecation warnings in any package output
  3. DTS files are generated correctly — tsup DTS output is valid, with scoped `ignoreDeprecations` workaround applied if tsup#1388 is still unfixed
  4. All existing tests pass under `turbo test` with no new failures
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Catalog Bump & TSConfig Cleanup | 0/1 | Not started | - |
| 2. Build & Verification | 0/TBD | Not started | - |
