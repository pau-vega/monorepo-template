---
phase: 01-catalog-bump-tsconfig-cleanup
plan: 01
subsystem: infra
tags: [typescript, tsconfig, pnpm-catalog, ts6-migration, tsup]

# Dependency graph
requires: []
provides:
  - TypeScript 6.0.2 resolving across all workspace packages via pnpm catalog
  - Clean tsconfigs with no baseUrl deprecation (TS5101-free)
  - Explicit types arrays in react-app and react-library presets
  - Forward-compatible eslint-config peer dependency (>=5.0.0)
  - Scoped tsup DTS ignoreDeprecations workaround for tsup#1388
affects: []

# Tech tracking
tech-stack:
  added: [typescript-6.0.2]
  patterns: [explicit-types-arrays, scoped-ignoreDeprecations-in-tsup]

key-files:
  created: []
  modified:
    - pnpm-workspace.yaml
    - pnpm-lock.yaml
    - packages/eslint-config/package.json
    - packages/eslint-config/tsconfig.json
    - packages/eslint-config/tsup.config.ts
    - packages/tsconfig/react-app.json
    - packages/tsconfig/react-library.json
    - packages/ui/tsconfig.json
    - packages/ui/tsup.config.ts
    - apps/showcase/tsconfig.json

key-decisions:
  - "Add typescript catalog: devDependency to eslint-config for correct peer resolution under pnpm"
  - "Add types: [node] to eslint-config tsconfig for import.meta.dirname support under TS6 explicit types"
  - "Add vite/client to react-app types array for CSS import declarations under TS6"
  - "Use scoped ignoreDeprecations: 6.0 in tsup DTS config as workaround for tsup#1388 (not in shared presets)"

patterns-established:
  - "Explicit types arrays: TS6 defaults types to [], so react presets must list react, react-dom, vitest/globals explicitly"
  - "Scoped tool workarounds: ignoreDeprecations only in tsup.config.ts dts.compilerOptions, never in shared tsconfig presets"
  - "Catalog peer resolution: packages with peer deps on typescript need catalog: devDependency for correct pnpm resolution"

requirements-completed: [CAT-01, CAT-02, TSC-01, TSC-02, TSC-03, TSC-04, TSC-05]

# Metrics
duration: 7min
completed: 2026-04-14
---

# Phase 01 Plan 01: Catalog Bump & TSConfig Cleanup Summary

**TypeScript 6.0.2 catalog upgrade with baseUrl removal, explicit types arrays in react presets, and scoped tsup DTS workaround for zero TS5101 warnings**

## Performance

- **Duration:** 6m 43s
- **Started:** 2026-04-14T12:50:29Z
- **Completed:** 2026-04-14T12:57:12Z
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- Upgraded TypeScript from 5.9.3 to 6.0.2 across all workspace packages via pnpm catalog
- Removed deprecated `baseUrl` from 3 consumer tsconfigs while preserving all path aliases
- Added explicit `types` arrays to react-app and react-library presets for TS6 compatibility
- Applied scoped `ignoreDeprecations: "6.0"` in tsup DTS configs to work around tsup#1388
- Zero TS5101 deprecation warnings from `tsc --noEmit` on all packages
- All packages build and typecheck cleanly under TypeScript 6.0.2

## Task Commits

Each task was committed atomically:

1. **Task 1: Bump TypeScript catalog and update peer dependency** - `a2c86fe` (feat)
2. **Task 2: Remove baseUrl from consumer tsconfigs and add types to presets** - `e8852bd` (feat)
3. **Task 3: Verify zero TS5101 warnings and path alias resolution** - `fa8601d` (fix)

## Files Created/Modified
- `pnpm-workspace.yaml` - TypeScript catalog entry changed from ^5.9.3 to ^6.0.2
- `pnpm-lock.yaml` - Regenerated with TypeScript 6.0.2 resolution
- `packages/eslint-config/package.json` - Peer dep updated to >=5.0.0, added typescript catalog: devDep
- `packages/eslint-config/tsconfig.json` - Removed baseUrl, added types: [node]
- `packages/eslint-config/tsup.config.ts` - Added ignoreDeprecations: 6.0 to DTS compilerOptions
- `packages/tsconfig/react-app.json` - Added types: [react, react-dom, vitest/globals, vite/client]
- `packages/tsconfig/react-library.json` - Added types: [react, react-dom, vitest/globals]
- `packages/ui/tsconfig.json` - Removed baseUrl, paths preserved with ./ prefix
- `packages/ui/tsup.config.ts` - Added ignoreDeprecations: 6.0 to DTS compilerOptions (both entries)
- `apps/showcase/tsconfig.json` - Removed baseUrl, @/* path alias preserved

## Decisions Made
- **Added typescript catalog: devDep to eslint-config:** The eslint-config package's peer dependencies (from typescript-eslint, tsup, etc.) were resolving to TypeScript 5.9.3 instead of 6.0.2. Adding `"typescript": "catalog:"` as a devDependency ensures pnpm uses the catalog version for peer resolution.
- **Added types: [node] to eslint-config tsconfig:** TS6 changes the default `types` to `[]`, so `@types/node` is no longer auto-included. The eslint.config.ts uses `import.meta.dirname` which requires Node types.
- **Added vite/client to react-app types:** CSS side-effect imports (`.css`) need Vite's client type declarations. Without `vite/client` in the types array, TS2882 errors occur on CSS imports.
- **Scoped ignoreDeprecations in tsup config:** tsup's DTS builder internally uses `baseUrl` when processing path aliases, triggering TS5101. The `ignoreDeprecations: "6.0"` workaround is scoped to `tsup.config.ts` `dts.compilerOptions` only -- not in any shared tsconfig preset. This follows the known tsup#1388 issue guidance from STATE.md.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added typescript catalog: devDependency to eslint-config**
- **Found during:** Task 1 (Bump TypeScript catalog)
- **Issue:** eslint-config's peer dependencies resolved typescript 5.9.3 instead of 6.0.2 because pnpm resolves peers from the package's own deps, not from root
- **Fix:** Added `"typescript": "catalog:"` to eslint-config devDependencies
- **Files modified:** packages/eslint-config/package.json
- **Verification:** `pnpm list typescript -r` shows 6.0.2 for all packages
- **Committed in:** a2c86fe (Task 1 commit)

**2. [Rule 1 - Bug] Added types: [node] to eslint-config tsconfig**
- **Found during:** Task 3 (Verification)
- **Issue:** `import.meta.dirname` in eslint.config.ts caused TS2339 because @types/node not auto-included under TS6 types default
- **Fix:** Added `"types": ["node"]` to packages/eslint-config/tsconfig.json compilerOptions
- **Files modified:** packages/eslint-config/tsconfig.json
- **Verification:** `tsc --noEmit` exits 0 in eslint-config
- **Committed in:** fa8601d (Task 3 commit)

**3. [Rule 3 - Blocking] Added ignoreDeprecations to tsup DTS configs**
- **Found during:** Task 3 (Verification)
- **Issue:** tsup DTS builder internally uses baseUrl, causing TS5101 error and build failure (tsup#1388)
- **Fix:** Changed `dts: true` to `dts: { compilerOptions: { ignoreDeprecations: "6.0" } }` in both tsup.config.ts files
- **Files modified:** packages/eslint-config/tsup.config.ts, packages/ui/tsup.config.ts
- **Verification:** `pnpm turbo typecheck` passes all 5 tasks
- **Committed in:** fa8601d (Task 3 commit)

**4. [Rule 1 - Bug] Added vite/client to react-app types array**
- **Found during:** Task 3 (Verification)
- **Issue:** CSS imports in showcase app caused TS2882 because vite/client types not included under TS6 explicit types
- **Fix:** Added `"vite/client"` to types array in packages/tsconfig/react-app.json
- **Files modified:** packages/tsconfig/react-app.json
- **Verification:** showcase typecheck passes with zero errors
- **Committed in:** fa8601d (Task 3 commit)

---

**Total deviations:** 4 auto-fixed (2 bugs, 2 blocking)
**Impact on plan:** All auto-fixes necessary for correct TypeScript 6 operation. The plan anticipated the tsup#1388 workaround (noted in STATE.md blockers). The other fixes address TS6's change to `types` default behavior. No scope creep.

## Issues Encountered
- tsup's DTS builder internally uses `baseUrl` even when removed from tsconfig, requiring a scoped `ignoreDeprecations` workaround. This was anticipated in STATE.md as a known concern (tsup#1388).
- TS6 changes the `types` compiler option default from "include all @types" to "include none", requiring explicit types arrays in all tsconfig presets that need type packages.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All packages typecheck and build cleanly under TypeScript 6.0.2
- base.json is unchanged -- no types field, no modifications
- @tsconfig/node24 preset confirmed compatible with TS6 (TSC-05)
- Template is ready to serve as a clean TS6 starting point

## Self-Check: PASSED

All 10 modified files verified present. All 3 task commits (a2c86fe, e8852bd, fa8601d) verified in git log. SUMMARY.md exists at expected path.

---
*Phase: 01-catalog-bump-tsconfig-cleanup*
*Completed: 2026-04-14*
