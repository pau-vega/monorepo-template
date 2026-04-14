# TypeScript 6 Migration

## What This Is

A monorepo GitHub template (`base-monorepo-template`) used as the starting point for all new projects. Currently on TypeScript 5.9.3, migrating to TypeScript 6.x to stay on the latest compiler and address deprecations before they become errors in TS7.

## Core Value

The template starts new projects on the latest TypeScript with zero deprecation warnings — clean slate every time.

## Requirements

### Validated

- [x] Upgrade TypeScript from ^5.9.3 to ^6.0.2 in pnpm catalog — Validated in Phase 1
- [x] Resolve `baseUrl` deprecation in app/package tsconfigs (showcase, ui, eslint-config) — Validated in Phase 1
- [x] Update `@tsconfig/node24` base preset if needed for TS6 compatibility — Validated in Phase 1 (compatible, no changes needed)
- [x] Update eslint-config peer dependency from `"typescript": "^5.0.0"` to include v6 — Validated in Phase 1

### Active

- [ ] All packages pass `typecheck` with zero errors and zero deprecation warnings
- [ ] `preserveConstEnums` deprecation in base tsconfig — confirmed NOT deprecated in TS6 (no action needed)

### Out of Scope

- Adopting new TS6 features beyond what's needed for migration — this is a version bump, not a rewrite
- Changing module resolution strategy — `bundler` is already the modern choice
- Updating other dependencies unless required by TS6 compatibility

## Context

- Monorepo managed with pnpm workspaces + Turborepo
- TypeScript version controlled via pnpm `catalog:` protocol
- Three shared tsconfig presets in `packages/tsconfig/`: `base.json`, `react-app.json`, `react-library.json`
- Base config extends `@tsconfig/node24/tsconfig.json`
- `baseUrl` is used in 3 packages purely for path alias support (`paths`), not for bare-specifier resolution
- ESLint config is a shared package with `typescript` as a peer dependency

## Constraints

- **Compatibility**: All existing packages (showcase, ui, eslint-config) must build and typecheck after migration
- **No deprecation warnings**: The template should be clean — no `ignoreDeprecations: "6.0"` workaround
- **Minimal churn**: Only change what TS6 requires; don't reorganize unrelated config

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Remove `baseUrl` instead of using `ignoreDeprecations` | Template should be clean for new projects, not carry forward workarounds | Done — Phase 1 |
| Scoped `ignoreDeprecations` in tsup DTS config only | tsup#1388 requires the flag internally; scoping to tool config keeps shared presets clean | Done — Phase 1 |
| Explicit `types` arrays in react presets | TS6 defaults `types` to `[]`; react presets must list react, react-dom, vitest/globals | Done — Phase 1 |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-14 after Phase 1 completion*
