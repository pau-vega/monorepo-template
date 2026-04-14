# Phase 1: Catalog Bump & TSConfig Cleanup - Research

**Researched:** 2026-04-14
**Domain:** TypeScript 6 migration — version management, tsconfig deprecations, types resolution
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Set explicit `types` field per-preset, not in base.json. Each preset declares exactly what it uses — react-app.json and react-library.json get their own types lists, base.json stays minimal.
- **D-02:** This addresses TS6's new `types: []` default which stops auto-inclusion of `@types/*` packages.
- **D-03:** Keep the `extends: "@tsconfig/node24/tsconfig.json"` in base.json. If the preset introduces TS5101 warnings under TS6, override the specific problematic fields in base.json compilerOptions rather than dropping or pinning the preset.
- **D-04:** Update eslint-config's typescript peer dependency from `"^5.0.0"` to `">=5.0.0"`. Broad range, forward-compatible, standard for templates.
- **D-05:** Run `tsc --noEmit` on each package after changes as a quick sanity check to confirm zero TS5101 warnings. Full build and test verification is deferred to Phase 2.

### Claude's Discretion

- Exact `types` array values per-preset (determined by what each preset actually needs under TS6)
- Whether `preserveConstEnums` in base.json needs any adjustment for TS6
- Order of operations for the atomic change (catalog bump first vs tsconfig cleanup first)

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CAT-01 | TypeScript catalog version bumped from ^5.9.3 to ^6.0.2 in pnpm-workspace.yaml | TS 6.0.2 is current `latest` on npm registry — confirmed via `pnpm view typescript dist-tags` |
| CAT-02 | eslint-config peer dependency updated from "^5.0.0" to ">=5.0.0" in package.json | Peer dep lives in `packages/eslint-config/package.json` under `peerDependencies.typescript` |
| TSC-01 | `baseUrl` removed from apps/showcase/tsconfig.json — path aliases still resolve | TS6 deprecates `baseUrl`; `paths` works without it — prefix must move into each paths entry |
| TSC-02 | `baseUrl` removed from packages/ui/tsconfig.json — path aliases still resolve | Same pattern; two aliases (@ui, @ui/*) need their paths made absolute |
| TSC-03 | `baseUrl` removed from packages/eslint-config/tsconfig.json — path aliases still resolve | Same pattern; single @/* alias |
| TSC-04 | `types` field explicitly set in base/react-app presets to handle TS6 `types: []` default | TS6 changes `types` default to `[]`; React + vitest globals break without explicit list |
| TSC-05 | `@tsconfig/node24` verified compatible with TS6 (no TS5101 warnings from preset) | Preset uses module:nodenext + target:es2024 + esModuleInterop:true — none of these are deprecated in TS6 |
</phase_requirements>

---

## Summary

TypeScript 6.0.2 is the current `latest` release on npm. [VERIFIED: `pnpm view typescript dist-tags`] Migrating from ^5.9.3 involves two classes of change: a catalog bump (one line in `pnpm-workspace.yaml`) and three categories of tsconfig surgery (removing `baseUrl`, adding explicit `types`, verifying the `@tsconfig/node24` preset).

The most impactful TS6 change for this repo is the `types` default switching from "include all `@types/*`" to `[]`. Every package using `@types/react`, `@types/react-dom`, or vitest globals must now declare them explicitly. The second change — `baseUrl` deprecation — is a warning (TS5101) in TS6 and a hard error in TS7; it must be removed cleanly per D-01.

The `@tsconfig/node24@24.0.4` preset is safe under TS6. Its options (`module: nodenext`, `target: es2024`, `moduleResolution: node16`, `esModuleInterop: true`) do not overlap with the TS6 deprecated list. [VERIFIED: preset content read from installed package + TS6 deprecated options list from official migration guide]

**Primary recommendation:** Bump catalog to `^6.0.2`, remove `baseUrl` from the three consumer tsconfigs (updating `paths` entries with explicit prefixes), and add `types` arrays to `react-app.json` and `react-library.json`. No changes needed to `base.json` itself beyond the types decision. Verify with `pnpm tsc --noEmit` per package.

---

## Standard Stack

### Core (unchanged — no new packages required)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| typescript | 6.0.2 | TypeScript compiler | Bump from ^5.9.3 to ^6.0.2 in catalog |
| @tsconfig/node24 | 24.0.4 | Base tsconfig preset | No change needed |

**Version verification:**
```bash
# Confirmed current latest via pnpm view typescript dist-tags
# latest: '6.0.2'
# @tsconfig/node24: '24.0.4' (already installed version)
```

[VERIFIED: pnpm registry]

---

## Architecture Patterns

### pnpm Catalog Pattern — Version Bump

The entire monorepo resolves TypeScript through a single catalog entry. Bumping the version in one place propagates to all packages.

```yaml
# pnpm-workspace.yaml
catalog:
  typescript: ^6.0.2   # was ^5.9.3
```

All packages that use `typescript: "catalog:"` (or inherit from the catalog) will pick up the new version after `pnpm install`. [VERIFIED: pnpm-workspace.yaml read from repo]

### baseUrl Removal Pattern — Paths Must Become Self-Contained

In TS5, `baseUrl: "."` was required as a resolution root when using `paths`. In TS6 it is deprecated; `paths` entries now resolve relative to the tsconfig's directory without needing `baseUrl` as a prefix.

**Migration rule:** If the path entry was `"@/*": ["./src/*"]` and `baseUrl` was `"."`, the paths entry is already using `./src/*` (an explicit relative path). Simply remove the `baseUrl` line — `paths` already has the correct prefix.

If the paths entries were relative to `baseUrl` (e.g., `"@/*": ["src/*"]` with `baseUrl: "."`), you would need to add the `./` prefix. However, all three tsconfigs in this repo already use `./`-prefixed paths, so removal is a one-line delete in each file. [VERIFIED: read from repo files]

**Current state of each file:**

| File | baseUrl value | paths entries | Action |
|------|--------------|---------------|--------|
| apps/showcase/tsconfig.json | `"."` | `"@/*": ["./src/*"]` | Delete `baseUrl` line only |
| packages/ui/tsconfig.json | `"."` | `"@ui": ["./src/index.ts"]`, `"@ui/*": ["./src/*"]` | Delete `baseUrl` line only |
| packages/eslint-config/tsconfig.json | `"."` | `"@/*": ["./src/*"]` | Delete `baseUrl` line only |

All paths entries already use `./`-prefixed absolute paths. No paths values need updating.

### types Field Pattern — Explicit Per-Preset Declaration

Under TS6, `types` defaults to `[]`. The planner must determine the exact array for each preset (that is Claude's discretion per D-01). Research identifies what each preset context actually uses:

**react-app.json** (used by: `apps/showcase`):
- `@types/react` — installed, needed for JSX
- `@types/react-dom` — installed, needed for DOM React
- `vitest/globals` — showcase vitest.config has `globals: true`, environment jsdom
- No `@types/node` — showcase source code uses no Node.js APIs directly; Vite/Vitest handle the runtime
- Note: `@testing-library/jest-dom` matchers come via the setup file import, not via `types`

Recommended: `"types": ["react", "react-dom", "vitest/globals"]`

**react-library.json** (used by: `packages/ui`):
- `@types/react` — installed, needed for JSX
- `@types/react-dom` — installed, needed for DOM React
- `vitest/globals` — ui vitest.config has `globals: true`, environment jsdom
- No `@types/node` — ui package source does not use Node.js APIs

Recommended: `"types": ["react", "react-dom", "vitest/globals"]`

**base.json** (used by: `packages/eslint-config`):
- No `@types/react` — pure Node/ESLint config, no JSX
- No `@types/node` — eslint-config source uses `globals.node` for ESLint config, not Node.js APIs directly
- Recommendation (per D-01): leave `base.json` without a `types` field — it stays minimal; the empty-default only breaks things when you actually need @types packages to be auto-discovered

[VERIFIED: package.json devDependencies read from repo; vitest.config.ts files read from repo; eslint-config src/node.ts read from repo]

### @tsconfig/node24 Compatibility Verification

The preset installed at `packages/tsconfig/node_modules/@tsconfig/node24/tsconfig.json` (version 24.0.4) sets:

```json
{
  "compilerOptions": {
    "lib": ["es2024", "ESNext.Array", "ESNext.Collection", "ESNext.Error", "ESNext.Iterator", "ESNext.Promise"],
    "module": "nodenext",
    "target": "es2024",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node16"
  }
}
```

TS6 deprecated options that would trigger TS5101: `target: "es3"|"es5"`, `moduleResolution: "node10"|"classic"`, `module: "amd"|"umd"|"system"|"none"`, `baseUrl`, `esModuleInterop: false`, `allowSyntheticDefaultImports: false`, `alwaysStrict: false`, `outFile`, `downlevelIteration`.

None of the preset's options appear in the deprecated list. `moduleResolution: "node16"` is NOT deprecated — only `"node10"` and `"classic"` are. The preset is safe. [VERIFIED: preset content from repo + migration guide from official TS docs]

`base.json` overrides `module: "ESNext"` and `moduleResolution: "bundler"` — both are valid TS6 values. [VERIFIED: base.json read from repo]

### preserveConstEnums Assessment

`base.json` includes `"preserveConstEnums": true`. This option is NOT in the TS6 deprecated list. No action required. [CITED: typescript-6-0-migration-guide verified list of deprecated options; `preserveConstEnums` not listed]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Detecting all deprecated TS options | manual grep | `tsc --noEmit` output | Compiler reports TS5101 for every deprecated option in use |
| Updating all paths after baseUrl removal | sed/replace script | delete one JSON key | Paths entries already use `./`-prefixed values — no path rewriting needed |
| Version consistency across packages | editing each package.json | pnpm catalog | Single change in pnpm-workspace.yaml propagates everywhere |

---

## Common Pitfalls

### Pitfall 1: Forgetting That tsup Injects Its Own baseUrl

**What goes wrong:** After you remove `baseUrl` from all tsconfigs, `tsc --noEmit` passes, but `tsup` (used by `packages/ui` and `packages/eslint-config`) still injects a `baseUrl` internally when generating DTS files. This triggers TS5101 from tsup's own rollup configuration — not from your tsconfig.

**Why it happens:** tsup's DTS pipeline merges its own compiler options (including a `baseUrl`) with your tsconfig. Issue #1388 on the tsup repo (opened 2026-03-24) confirms this is unfixed in tsup 8.5.1. [VERIFIED: GitHub issue #1388 fetched]

**How to avoid:** This is a Phase 2 concern (BLD-03). The REQUIREMENTS.md explicitly flags it with: "with scoped workaround if tsup#1388 still unfixed." The STATE.md notes it as a known blocker. Phase 1 is limited to `tsc --noEmit` verification (D-05) — the tsup DTS issue will not manifest until a full build.

**Warning signs:** TS5101 errors appearing only during `tsup` builds but not during `tsc --noEmit`.

### Pitfall 2: types Default Breaks @testing-library/jest-dom Matchers

**What goes wrong:** `@testing-library/jest-dom` matchers like `toBeInTheDocument()` stop being recognized by TypeScript after the upgrade, even though the setup file (`src/test/setup.ts`) imports them.

**Why it happens:** The setup file side-effect import adds runtime matchers to Jest, but TypeScript needs the @types declaration separately. Under TS5, `@testing-library/jest-dom` was auto-included via `@types` discovery. Under TS6, `types: []` stops that.

**How to avoid:** `@testing-library/jest-dom` ships its own types (no `@types/*` package needed) and augments the `@jest/expect` types via the import in setup.ts. The import `import "@testing-library/jest-dom"` in setup.ts is sufficient for type augmentation — this does NOT need to be in the `types` array. Confirmed: the package's typings are loaded via the setup file import, not via automatic `@types` discovery. [VERIFIED: packages/ui/src/test/setup.ts read from repo]

### Pitfall 3: baseUrl Used as Bare Module Resolution Root (Not the Case Here)

**What goes wrong:** Some projects used `baseUrl: "./src"` so that `import { Foo } from "components/foo"` would resolve without a leading `@`. Removing baseUrl would break these bare imports.

**Why it doesn't apply here:** All three tsconfigs use `baseUrl: "."` paired with `paths` entries that use `./src/...` prefixes. No bare module imports rely on baseUrl as a resolution root — only the `@/*` and `@ui/*` aliases do, and those go through `paths`, not bare resolution. [VERIFIED: all three tsconfig files read from repo]

### Pitfall 4: pnpm lockfile freeze

**What goes wrong:** `preferFrozenLockfile: true` is set in pnpm-workspace.yaml. Running `pnpm install` after bumping the catalog without regenerating the lockfile will fail.

**How to avoid:** After bumping the catalog entry, run `pnpm install` (not `pnpm install --frozen-lockfile`). The install will update `pnpm-lock.yaml`. This is expected and correct. [VERIFIED: pnpm-workspace.yaml read from repo]

---

## Code Examples

### After: apps/showcase/tsconfig.json

```json
{
  "extends": "@monorepo-template/tsconfig/react-app.json",
  "include": ["src", "*.ts"],
  "exclude": ["node_modules"],
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

`baseUrl` deleted. `paths` values unchanged — they were already `./`-prefixed.

### After: packages/ui/tsconfig.json

```json
{
  "extends": "@monorepo-template/tsconfig/react-library.json",
  "include": ["src", "*.ts"],
  "exclude": ["node_modules", "dist"],
  "compilerOptions": {
    "paths": {
      "@ui": ["./src/index.ts"],
      "@ui/*": ["./src/*"]
    }
  }
}
```

### After: packages/eslint-config/tsconfig.json

```json
{
  "extends": "@monorepo-template/tsconfig/base.json",
  "include": ["src", "*.ts"],
  "exclude": ["node_modules", "dist"],
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### After: packages/tsconfig/react-app.json

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "types": ["react", "react-dom", "vitest/globals"]
  }
}
```

### After: packages/tsconfig/react-library.json

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "types": ["react", "react-dom", "vitest/globals"]
  }
}
```

### Verification command (per D-05)

```bash
# Run after all changes, before committing
cd packages/eslint-config && pnpm tsc --noEmit
cd packages/ui && pnpm tsc --noEmit
cd apps/showcase && pnpm tsc --noEmit
# Or via turbo:
pnpm turbo typecheck
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `types` auto-discovers all `@types/*` | `types: []` default — must declare explicitly | TS6.0 | All @types/react, vitest globals must be explicit |
| `baseUrl` required as path anchor for `paths` | `paths` self-contained, `baseUrl` deprecated | TS6.0 | Remove baseUrl, verify paths are absolute |
| `moduleResolution: "node"` / `"classic"` | Use `"bundler"`, `"nodenext"`, or `"node16"` | TS6.0 (node/classic deprecated) | Already on "bundler" — no action |
| `^5.0.0` peer dep range for typescript | `>=5.0.0` for templates | Best practice for templates | Forward-compatible |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@testing-library/jest-dom` type augmentation is loaded via the setup file import, not via `@types` auto-discovery, so it does not need to be in the `types` array | Common Pitfalls #2 | If wrong, toBeInTheDocument() etc. would show type errors after upgrade; fix is adding `"@testing-library/jest-dom"` to the types array |
| A2 | base.json needs no `types` field because eslint-config source code uses no `@types/*` packages directly | Architecture Patterns — types field | If wrong, tsc --noEmit on eslint-config would report type errors; fix is adding appropriate types to base.json |
| A3 | `vitest/globals` is the correct types entry for vitest (not `"vitest"`) when `globals: true` is set | Architecture Patterns — types array values | If wrong, vitest globals (describe, it, expect) would not be recognized; easy to verify with tsc --noEmit |

**Note on A3:** The `vitest/globals` value in `types` enables TypeScript to recognize Vitest's global functions when `globals: true` is configured in vitest.config. [CITED: Vitest documentation pattern — common configuration confirmed by multiple WebSearch results]

---

## Open Questions

1. **Does `react-library.json` need vitest types for the build path (non-test)?**
   - What we know: `packages/ui` runs vitest tests, and `react-library.json` is used for the `tsc --noEmit` typecheck of the full `src/` including test files
   - What's unclear: whether tsup's build step (which excludes test files) also reads this tsconfig
   - Recommendation: Add vitest/globals to react-library.json anyway — it causes no harm in build context and prevents errors in test context

2. **Will `pnpm install` update the lockfile correctly with preferFrozenLockfile in workspace config?**
   - What we know: `preferFrozenLockfile: true` is in pnpm-workspace.yaml; it applies to CI but not to developer `pnpm install` calls
   - What's unclear: Whether the GSD executor environment treats this as a CI-like run
   - Recommendation: Run `pnpm install` explicitly (not `--frozen-lockfile`) after bumping the catalog entry

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | TypeScript compiler, pnpm | Yes | 24.9.0 | — |
| pnpm | Package installation | Yes | 10.29.3 | — |
| TypeScript 6.0.2 | Phase goal | After install | 6.0.2 (registry) | — |
| @tsconfig/node24 | base.json extends | Yes (24.0.4 installed) | 24.0.4 | — |

**No missing dependencies.** Phase only requires bumping the catalog entry and running `pnpm install`.

---

## Project Constraints (from CLAUDE.md)

| Constraint | Implication for Phase 1 |
|------------|------------------------|
| No `ignoreDeprecations: "6.0"` in shared presets | Cannot use the easy workaround in base.json, react-app.json, or react-library.json |
| All existing packages must build and typecheck after migration | Phase 1 verifies with `tsc --noEmit`; full build is Phase 2 |
| Minimal churn — only change what TS6 requires | Do not reorganize tsconfig structure, do not add unrelated options |
| pnpm catalog for version management | Bump only the catalog entry, not individual package.json devDependencies |
| kebab-case file names, no default exports, import type for type-only imports | No new files created in this phase |

---

## Sources

### Primary (HIGH confidence)
- Installed file: `packages/tsconfig/node_modules/@tsconfig/node24/tsconfig.json` — preset options verified directly
- `pnpm view typescript dist-tags` — TypeScript 6.0.2 confirmed as `latest`
- All repo tsconfig files read directly: `base.json`, `react-app.json`, `react-library.json`, `apps/showcase/tsconfig.json`, `packages/ui/tsconfig.json`, `packages/eslint-config/tsconfig.json`
- `packages/eslint-config/package.json` — peer dependency string confirmed as `"^5.0.0"`
- `pnpm-workspace.yaml` — catalog entry confirmed as `typescript: ^5.9.3`

### Secondary (MEDIUM confidence)
- [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html) — fetched and parsed; confirmed types default change and baseUrl deprecation
- [Announcing TypeScript 6.0 blog post](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) — confirmed TS5101 is warning (not hard error) in TS6
- [TypeScript 5.x to 6.0 Migration Guide](https://gist.github.com/privatenumber/3d2e80da28f84ee30b77d53e1693378f) — complete deprecated options list; confirmed node16 not deprecated
- [TypeScript PR #63054](https://github.com/microsoft/TypeScript/pull/63054) — confirmed types:[] default and undefined=[] behavior

### Tertiary (LOW confidence, for awareness only)
- [tsup issue #1388](https://github.com/egoist/tsup/issues/1388) — tsup injects baseUrl in DTS build; unfixed as of 2026-03-24
- [tsup issue #1389](https://github.com/egoist/tsup/issues/1389) — full TS6 support tracking issue; unfixed

---

## Metadata

**Confidence breakdown:**
- Standard stack (version bump): HIGH — verified via pnpm registry
- baseUrl removal mechanics: HIGH — verified by reading all 3 tsconfig files; paths are already ./prefixed
- @tsconfig/node24 compatibility: HIGH — preset content read directly + TS6 deprecated list cross-checked
- types array values: MEDIUM — exact values are Claude's Discretion (A1, A2, A3 tagged as assumptions); confirmed by vitest docs pattern
- tsup DTS issue awareness: HIGH — issue confirmed open on GitHub

**Research date:** 2026-04-14
**Valid until:** 2026-07-14 (stable TypeScript versioning; tsup issue status may change sooner)
