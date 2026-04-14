---
phase: 01-catalog-bump-tsconfig-cleanup
reviewed: 2026-04-14T12:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - pnpm-workspace.yaml
  - packages/eslint-config/package.json
  - packages/eslint-config/tsconfig.json
  - packages/eslint-config/tsup.config.ts
  - packages/tsconfig/react-app.json
  - packages/tsconfig/react-library.json
  - packages/ui/tsconfig.json
  - packages/ui/tsup.config.ts
  - apps/showcase/tsconfig.json
findings:
  critical: 0
  warning: 1
  info: 2
  total: 3
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-04-14T12:00:00Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

This phase covers the TypeScript 6.0.2 catalog bump and associated tsconfig cleanup. The changes are well-structured and follow the planning artifacts closely: `baseUrl: "."` removed from all three leaf tsconfigs (paths already used `./`-prefixed values so no rewriting needed), explicit `types` arrays added to the react presets to handle TS6's `types: []` default, and `ignoreDeprecations: "6.0"` scoped to tsup DTS `compilerOptions` only (workaround for tsup#1388). No critical issues found. The `baseUrl` removal, TypeScript catalog bump, and `eslint-config` devDep addition are all correct. Three minor items noted below.

## Warnings

### WR-01: `vitest/globals` in react-library preset leaks test types into production source

**File:** `packages/tsconfig/react-library.json:9`
**Issue:** The `types` array includes `"vitest/globals"`, which makes vitest global functions (`describe`, `it`, `expect`, `vi`, etc.) available in all files covered by this preset -- including production library source files, not just test files. Since `react-library.json` is the shared preset for `packages/ui` (a published library), any accidental use of a vitest global in a production component file would pass typechecking silently rather than producing a compile error. The same issue exists in `react-app.json` but is lower risk since apps are leaf nodes.

**Fix:** Move `vitest/globals` out of the shared presets and into a separate `tsconfig.test.json` (or equivalent) that only covers test files. The library and app tsconfigs would then only include `["react", "react-dom"]` (and `"vite/client"` for react-app). Each package's vitest config already has `globals: true`, and a dedicated test tsconfig can extend the base preset while adding `vitest/globals`.

Alternatively, if a separate test tsconfig is too much churn for this phase, document this as a known trade-off to address in a follow-up phase.

```json
// packages/tsconfig/react-library.json -- without vitest/globals
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "types": ["react", "react-dom"]
  }
}
```

```json
// packages/ui/tsconfig.test.json -- test-only config
{
  "extends": "./tsconfig.json",
  "include": ["src/**/*.test.ts", "src/**/*.test.tsx", "src/test"],
  "compilerOptions": {
    "types": ["react", "react-dom", "vitest/globals"]
  }
}
```

## Info

### IN-01: Unbounded peerDependency range for TypeScript

**File:** `packages/eslint-config/package.json:31`
**Issue:** The `typescript` peerDependency was changed from `^5.0.0` to `>=5.0.0`. This open-ended range accepts any future TypeScript major version (7, 8, etc.) without verification. While peerDependencies are advisory and rarely cause install failures, an unbounded range signals broader compatibility than has been tested.

**Fix:** Consider using a bounded range that explicitly covers tested versions:
```json
"typescript": ">=5.0.0 <7.0.0"
```
Or use a union of caret ranges: `"^5.0.0 || ^6.0.0"`. This communicates that TS5 and TS6 are the tested versions while still allowing patch/minor updates within those ranges.

### IN-02: Shared react-app preset couples to Vite via `vite/client` type

**File:** `packages/tsconfig/react-app.json:8`
**Issue:** The `types` array includes `"vite/client"`, which provides type declarations for Vite-specific features (CSS module imports, `import.meta.env`, etc.). This couples the shared tsconfig preset to the Vite bundler. If this template is forked for a project using a different bundler (e.g., webpack, Rspack), the consumer would need to override the `types` field entirely to remove `vite/client` and add their bundler's types.

**Fix:** This is an acceptable trade-off for a Vite-standardized template. No code change needed -- just a note that the preset assumes Vite. If maximum flexibility is desired in the future, `vite/client` could be moved from the shared preset into each app's leaf `tsconfig.json`.

---

_Reviewed: 2026-04-14T12:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
