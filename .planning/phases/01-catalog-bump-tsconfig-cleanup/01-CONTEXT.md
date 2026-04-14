# Phase 1: Catalog Bump & TSConfig Cleanup - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Upgrade TypeScript from ^5.9.3 to ^6.0.2 in the pnpm catalog and remove all deprecated tsconfig options (primarily `baseUrl`) so the repo compiles without any TS5101 warnings. This is an atomic change -- splitting catalog bump from tsconfig cleanup would leave CI broken.

</domain>

<decisions>
## Implementation Decisions

### Types field strategy
- **D-01:** Set explicit `types` field per-preset, not in base.json. Each preset declares exactly what it uses -- react-app.json and react-library.json get their own types lists, base.json stays minimal.
- **D-02:** This addresses TS6's new `types: []` default which stops auto-inclusion of `@types/*` packages.

### @tsconfig/node24 compatibility
- **D-03:** Keep the `extends: "@tsconfig/node24/tsconfig.json"` in base.json. If the preset introduces TS5101 warnings under TS6, override the specific problematic fields in base.json compilerOptions rather than dropping or pinning the preset.

### Peer dependency version format
- **D-04:** Update eslint-config's typescript peer dependency from `"^5.0.0"` to `">=5.0.0"`. Broad range, forward-compatible, standard for templates.

### Verification scope
- **D-05:** Run `tsc --noEmit` on each package after changes as a quick sanity check to confirm zero TS5101 warnings. Full build and test verification is deferred to Phase 2.

### Claude's Discretion
- Exact `types` array values per-preset (determined by what each preset actually needs under TS6)
- Whether `preserveConstEnums` in base.json needs any adjustment for TS6
- Order of operations for the atomic change (catalog bump first vs tsconfig cleanup first)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### TypeScript configuration
- `packages/tsconfig/base.json` -- Base tsconfig extending @tsconfig/node24, defines strict mode and module settings
- `packages/tsconfig/react-app.json` -- React app preset (showcase), extends base with jsx and noEmit
- `packages/tsconfig/react-library.json` -- React library preset (UI package), extends base with jsx and declarations

### Package tsconfigs with baseUrl to remove
- `apps/showcase/tsconfig.json` -- Uses baseUrl + paths for `@/*` alias
- `packages/ui/tsconfig.json` -- Uses baseUrl + paths for `@ui` and `@ui/*` aliases
- `packages/eslint-config/tsconfig.json` -- Uses baseUrl + paths for `@/*` alias

### Version management
- `pnpm-workspace.yaml` -- Catalog with `typescript: ^5.9.3` to bump
- `packages/eslint-config/package.json` -- Peer dependency `"typescript": "^5.0.0"` to update

### Requirements
- `.planning/REQUIREMENTS.md` -- CAT-01, CAT-02, TSC-01 through TSC-05

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Path alias pattern (`baseUrl` + `paths`) is consistent across all 3 consuming tsconfigs -- removal can follow the same pattern everywhere
- Shared preset architecture (`base.json` -> `react-app.json` / `react-library.json`) means `types` changes propagate through inheritance

### Established Patterns
- pnpm catalog protocol for version management -- single source of truth for TypeScript version
- Preset inheritance chain: `@tsconfig/node24` -> `base.json` -> `react-app.json` / `react-library.json` -> consumer tsconfigs
- All 3 tsconfigs with `baseUrl` use it identically: `"baseUrl": "."` paired with `paths` for local aliases

### Integration Points
- `pnpm-workspace.yaml` catalog entry controls TypeScript version for all packages
- `eslint-config` peer dependency gates external consumers
- `tsup` in UI package and eslint-config consumes tsconfig for DTS generation (Phase 2 concern, but worth noting)

</code_context>

<specifics>
## Specific Ideas

No specific requirements -- open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 01-catalog-bump-tsconfig-cleanup*
*Context gathered: 2026-04-14*
