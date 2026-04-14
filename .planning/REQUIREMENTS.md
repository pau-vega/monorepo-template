# Requirements: TypeScript 6 Migration

**Defined:** 2026-04-14
**Core Value:** The template starts new projects on the latest TypeScript with zero deprecation warnings

## v1 Requirements

Requirements for the TS6 migration. Each maps to roadmap phases.

### Catalog & Version

- [ ] **CAT-01**: TypeScript catalog version bumped from ^5.9.3 to ^6.0.2 in pnpm-workspace.yaml
- [ ] **CAT-02**: eslint-config peer dependency updated from "^5.0.0" to ">=5.0.0" in package.json

### TSConfig Cleanup

- [ ] **TSC-01**: `baseUrl` removed from apps/showcase/tsconfig.json — path aliases still resolve
- [ ] **TSC-02**: `baseUrl` removed from packages/ui/tsconfig.json — path aliases still resolve
- [ ] **TSC-03**: `baseUrl` removed from packages/eslint-config/tsconfig.json — path aliases still resolve
- [ ] **TSC-04**: `types` field explicitly set in base/react-app presets to handle TS6 `types: []` default
- [ ] **TSC-05**: `@tsconfig/node24` verified compatible with TS6 (no TS5101 warnings from preset)

### Build & Verification

- [ ] **BLD-01**: All packages pass `tsc --noEmit` with zero errors and zero deprecation warnings
- [ ] **BLD-02**: All packages build successfully (`turbo build`) with zero TS5101 warnings
- [ ] **BLD-03**: tsup DTS generation works — with scoped workaround if tsup#1388 still unfixed
- [ ] **BLD-04**: All existing tests pass (`turbo test`)

## v2 Requirements

Deferred to future work. Tracked but not in current scope.

### Tooling Modernization

- **TOOL-01**: Replace tsup with tsdown if tsup DTS bug persists long-term
- **TOOL-02**: Remove `@tsconfig/node24` extends and inline its settings for full control

## Out of Scope

| Feature | Reason |
|---------|--------|
| Adopting new TS6 language features | Migration only — not a rewrite |
| Changing module resolution strategy | `bundler` is already the modern choice |
| Removing `preserveConstEnums` | Not deprecated in TS6 |
| Using `ignoreDeprecations: "6.0"` in shared presets | Creates TS7 debt; only allowed in scoped tsup config |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CAT-01 | Phase 1 | Pending |
| CAT-02 | Phase 1 | Pending |
| TSC-01 | Phase 1 | Pending |
| TSC-02 | Phase 1 | Pending |
| TSC-03 | Phase 1 | Pending |
| TSC-04 | Phase 1 | Pending |
| TSC-05 | Phase 1 | Pending |
| BLD-01 | Phase 2 | Pending |
| BLD-02 | Phase 2 | Pending |
| BLD-03 | Phase 2 | Pending |
| BLD-04 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-14*
*Last updated: 2026-04-14 after roadmap creation*
