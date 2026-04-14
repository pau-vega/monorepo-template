# Technology Stack: TypeScript 6 Migration

**Project:** base-monorepo-template TS6 migration
**Researched:** 2026-04-14
**Scope:** Compatibility analysis of the existing toolchain against TypeScript 6.0.2

---

## Current State (Baseline)

The catalog currently pins:

| Package | Current Version |
|---------|----------------|
| `typescript` | `^5.9.3` |
| `tsup` | `^8.5.1` |
| `vite` | `^8.0.8` |
| `vitest` | `^4.1.4` |
| `eslint` | `^10.2.0` |
| `@tsconfig/node24` | `^24.0.4` (in `packages/tsconfig/`) |
| `typescript-eslint` | `^8.58.2` (in `packages/eslint-config/`) |

Three tsconfigs use `baseUrl: "."` alongside `paths`:
- `packages/eslint-config/tsconfig.json`
- `packages/ui/tsconfig.json`
- `apps/showcase/tsconfig.json`

The shared `packages/tsconfig/base.json` does NOT use `baseUrl`. It uses `preserveConstEnums: true`.

---

## TypeScript 6 Release Status

**Confidence: HIGH** — Official Microsoft blog confirms the stable release.

TypeScript 6.0.2 shipped on 2026-03-17 as the final JavaScript-based major release. It bridges TS 5.9 to TS 7.0 (the Go-native rewrite). The release philosophy: deprecate legacy options now so they can be hard-removed in TS 7.0. Options deprecated in 6.0 continue to work without errors if `"ignoreDeprecations": "6.0"` is set, but that flag will be invalid in TS 7.0.

Sources: [Announcing TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/), [TypeScript 6.0 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-rc/)

---

## Deprecation Analysis: What This Repo Uses

**Confidence: HIGH** — Cross-referenced official deprecation list (issue #54500) against every tsconfig in the repo.

### `baseUrl` — DEPRECATED in TS 6.0

`baseUrl` is listed in the TS 6.0 deprecation list as TS error code 5101. It will produce a deprecation warning in TS 6.0 and stop functioning entirely in TS 7.0.

**What this repo uses it for:** All three package tsconfigs set `baseUrl: "."` as a companion to `paths`. This was historically required in older TS versions to resolve path aliases, but it is no longer required as of TypeScript 5.0. The `paths` entries work standalone.

**Correct fix:** Remove `baseUrl: "."` from all three tsconfigs. The `paths` entries do not need to be updated — they will continue to work without `baseUrl`. This is confirmed in the official TS 6.0 migration guide.

**Do NOT use:** `"ignoreDeprecations": "6.0"` — the project explicitly rejects this workaround (see PROJECT.md "No deprecation warnings" constraint).

Source: [TypeScript 5.x to 6.0 Migration Guide](https://gist.github.com/privatenumber/3d2e80da28f84ee30b77d53e1693378f), [TypeScript deprecation issue #62207](https://github.com/microsoft/TypeScript/issues/62207)

### `preserveConstEnums` — NOT DEPRECATED in TS 6.0

**Confidence: MEDIUM** — Not found in official deprecation list; multiple searches confirm absence.

The TS 6.0 deprecation list covers: `target: es3/es5`, `downlevelIteration`, `module: amd/umd/system`, `outFile`, `moduleResolution: node10`, `alwaysStrict`, `baseUrl`. `preserveConstEnums` does not appear in the list. The project rules say not to convert existing enums unless asked, and the base tsconfig currently sets `preserveConstEnums: true`. No change needed here.

Source: [6.0 Deprecation List #54500](https://github.com/microsoft/TypeScript/issues/54500)

### `alwaysStrict` — DEPRECATED, but not used here

Not present in any tsconfig in this repo. No action needed.

### `esModuleInterop` — Potentially deprecated

**Confidence: LOW** — A PR (#62567) exists to deprecate `esModuleInterop` and make it default `true`, but it was not confirmed as shipped in 6.0.2. The base.json sets `esModuleInterop: true`. If deprecated, it means the default changed to `true` and the explicit opt-in becomes redundant — not a breaking change in either case. Monitor this.

---

## Tool-by-Tool TS6 Compatibility

### TypeScript itself: `^6.0.2`

**Action: Bump the catalog entry from `^5.9.3` to `^6.0.2`.**

This is the primary catalog change. All other changes cascade from here.

### `typescript-eslint`: `^8.58.2` — ALREADY AT THE RIGHT VERSION

**Confidence: HIGH** — PR #12124 "feat: support TypeScript 6" was merged into typescript-eslint v8.58.0, released 2026-03-30. The current pin in `packages/eslint-config/package.json` is already `^8.58.2`, which satisfies this requirement.

**Peer dependency in eslint-config:** The file currently declares `"typescript": "^5.0.0"` as a peer. This needs to be broadened to `"typescript": ">=5.0.0"` (or `"^5.0.0 || ^6.0.0"`) to reflect that consumers using TS 6 are valid. Without this change, pnpm will report a peer dependency warning when the catalog TypeScript bumps to 6.x.

**No major version bump needed.** typescript-eslint v8.58.x handles TS 6 within the v8 line.

Source: [PR #12124 feat: support TypeScript 6](https://github.com/typescript-eslint/typescript-eslint/pull/12124), [Issue #12123](https://github.com/typescript-eslint/typescript-eslint/issues/12123)

### `tsup`: `^8.5.1` — HAS A KNOWN TS6 BUG

**Confidence: HIGH** — Multiple GitHub issues confirm the breakage; fix status as of 2026-04-14 is unresolved in tsup itself.

**Problem:** When tsup runs DTS generation against a tsconfig that sets `baseUrl`, it injects `baseUrl` internally in `getRollupConfig`. Under TS 6, this triggers error TS5101 (deprecated option). This means even if the package's own tsconfig has `baseUrl` removed, tsup's internal handling still sets it programmatically.

**Good news for this specific migration:** The bug primarily manifests when tsup is used alongside `isolatedDeclarations`/DTS generation paths. The `packages/eslint-config` and `packages/ui` packages use tsup and both currently set `baseUrl`. If `baseUrl` is removed from both tsconfigs AND tsup's internal behavior is fixed, the migration path is clean.

**Current recommendation:**
1. Remove `baseUrl` from both tsup-using package tsconfigs (required anyway for TS6 compliance).
2. Test `tsup` DTS builds under TS 6 immediately after the TypeScript bump.
3. If tsup still injects `baseUrl` internally even after tsconfig cleanup, evaluate replacing tsup.

**tsdown as replacement:**

tsdown is the actively maintained successor to tsup, powered by Rolldown (Rust) + Oxc. It does not carry tsup's TS6 `baseUrl` injection bug. Latest stable: `^0.20.3` (npm). The migration from tsup to tsdown is documented and intentionally low-friction — most tsup config is directly compatible.

**Recommendation:** Do not preemptively swap tsup for tsdown in this milestone. The scope is "bump TypeScript, remove deprecations." However, if tsup DTS generation fails under TS 6 after `baseUrl` removal, tsdown is the correct immediate fallback and represents a net improvement (active maintenance, faster builds). Flag this as a likely Phase 2 task.

Source: [tsup issue #1388](https://github.com/egoist/tsup/issues/1388), [tsup issue #1389](https://github.com/egoist/tsup/issues/1389), [tsdown migration guide](https://tsdown.dev/guide/migrate-from-tsup), [tsdown FAQ](https://tsdown.dev/guide/faq)

### `vite`: `^8.0.8` — COMPATIBLE with TS 6

**Confidence: MEDIUM** — No blocking issues found in Vite 8 + TS 6 searches. Vite's policy is that TypeScript is treated as a transpilation target only (it does not type-check); the compiler option compatibility concern is minimal for Vite itself. Vite 8.0 shipped March 12, 2026 and already operates in the TS 6.x era.

**Action: No catalog change needed.** `^8.0.8` stays.

Note: The `apps/showcase` package runs `tsc -b && vite build` — the `tsc -b` step is the type-checking gate. This will pick up the catalog TypeScript version and will surface any deprecation errors from the `baseUrl` removal.

Source: [Vite 8.0 release](https://vite.dev/blog/announcing-vite8)

### `vitest`: `^4.1.4` — COMPATIBLE with TS 6

**Confidence: MEDIUM** — Vitest uses Vite's transform pipeline; its TypeScript compatibility tracks Vite's, not tsc's. No reported breakage for vitest 4.x + TS 6.

**Action: No catalog change needed.**

### `eslint`: `^10.2.0` — COMPATIBLE, NO CHANGE

ESLint 10 is fully compatible with typescript-eslint 8.58. No TypeScript version dependency on the ESLint side.

**Action: No catalog change needed.**

### `@tsconfig/node24`: `^24.0.4` — COMPATIBLE, NO CHANGE NEEDED

**Confidence: MEDIUM** — The `@tsconfig/node24` base preset does not include `baseUrl` or any of the TS 6 deprecated options. It sets `"module": "nodenext"`, `"target": "es2024"`, `"lib": ["es2024"]`. This is clean under TS 6.

The `packages/tsconfig/base.json` extends this preset and overrides module settings to `"module": "ESNext"`, `"moduleResolution": "bundler"` — both of which remain valid in TS 6.

**Action: No version bump needed.** `^24.0.4` is fine.

Source: [npm @tsconfig/node24](https://www.npmjs.com/package/@tsconfig/node24)

### Turborepo: `^2.9.6` — COMPATIBLE, NO CHANGE

Turborepo is a task orchestrator, not a TypeScript tool. It delegates build/typecheck commands to each package's own scripts. No TypeScript version coupling.

### `prettier`: `^3.8.2` — COMPATIBLE, NO CHANGE

Prettier's TypeScript support is independent of the installed TypeScript version for formatting purposes.

---

## Recommended Changes Summary

### pnpm catalog (`pnpm-workspace.yaml`)

| Change | From | To | Reason |
|--------|------|----|--------|
| `typescript` | `^5.9.3` | `^6.0.2` | The migration target |

Everything else in the catalog stays.

### `packages/tsconfig/` — no changes to base/react-app/react-library JSONs

`preserveConstEnums: true` in `base.json` is not deprecated. No changes to the preset files.

### Package-level tsconfigs — remove `baseUrl` from all three

| File | Change |
|------|--------|
| `packages/eslint-config/tsconfig.json` | Remove `"baseUrl": "."` from `compilerOptions` |
| `packages/ui/tsconfig.json` | Remove `"baseUrl": "."` from `compilerOptions` |
| `apps/showcase/tsconfig.json` | Remove `"baseUrl": "."` from `compilerOptions` |

The `paths` entries in each file remain unchanged — they do not depend on `baseUrl` in TS 5.0+.

### `packages/eslint-config/package.json` — broaden TypeScript peer dependency

| Field | From | To | Reason |
|-------|------|----|--------|
| `peerDependencies.typescript` | `"^5.0.0"` | `">=5.0.0"` | Allow TS 6 consumers without peer warning |

### `typescript-eslint` — already at the correct version

`^8.58.2` already includes TS 6 support (merged in 8.58.0). No version change needed.

---

## Risk Register

| Tool | Risk | Severity | Mitigation |
|------|------|----------|------------|
| `tsup` | Internal `baseUrl` injection causes TS5101 under TS 6 even after tsconfig cleanup | HIGH | Test DTS build immediately; have tsdown migration ready as fallback |
| `esModuleInterop` | May be soft-deprecated in TS 6 (unconfirmed) | LOW | Explicit `true` in base.json is at worst redundant; will not break builds |
| `preserveConstEnums` | Appears safe but not 100% verified against final TS 6.0.2 | LOW | Run typecheck after bump; error would be explicit if deprecated |
| `typescript-eslint` peer | Consumers on TS 6 will see peer mismatch until peer range is broadened | MEDIUM | Fix peer dep in same PR as TypeScript bump |

---

## What NOT to Change

- **`moduleResolution: "bundler"`** — This is the modern choice and is explicitly valid in TS 6. Not deprecated.
- **`isolatedModules: true`** — Valid, not deprecated.
- **`moduleDetection: "force"`** — Valid, not deprecated.
- **`module: "ESNext"`** — Valid. Only `amd`, `umd`, `system` are deprecated.
- **`tsup` version** — Do not proactively replace tsup with tsdown in this milestone. The scope is TypeScript version migration, not bundler migration. Replace only if tsup DTS generation is confirmed broken after `baseUrl` removal.
- **`vite`, `vitest`, `eslint`, `prettier`** — No changes needed; none have TS6 compatibility issues.
- **`@tsconfig/node24` version** — Stays at `^24.0.4`; the preset is TS6-clean.

---

## Sources

- [Announcing TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/)
- [TypeScript 6.0 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-rc/)
- [TypeScript 5.x to 6.0 Migration Guide (privatenumber)](https://gist.github.com/privatenumber/3d2e80da28f84ee30b77d53e1693378f)
- [TypeScript 6.0 Deprecation List #54500](https://github.com/microsoft/TypeScript/issues/54500)
- [baseUrl deprecation issue #62207](https://github.com/microsoft/TypeScript/issues/62207)
- [typescript-eslint TypeScript 6 Support issue #12123](https://github.com/typescript-eslint/typescript-eslint/issues/12123)
- [typescript-eslint PR #12124 feat: support TypeScript 6](https://github.com/typescript-eslint/typescript-eslint/pull/12124)
- [tsup DTS TS5101 issue #1388](https://github.com/egoist/tsup/issues/1388)
- [tsup TypeScript 6 support issue #1389](https://github.com/egoist/tsup/issues/1389)
- [tsdown migration from tsup](https://tsdown.dev/guide/migrate-from-tsup)
- [Vite 8.0 release](https://vite.dev/blog/announcing-vite8)
- [npm @tsconfig/node24](https://www.npmjs.com/package/@tsconfig/node24)
- [typescript-eslint dependency versions](https://typescript-eslint.io/users/dependency-versions/)
