# Architecture Patterns: TypeScript 6 Migration

**Domain:** pnpm monorepo tsconfig cascade with shared presets
**Researched:** 2026-04-14
**Overall confidence:** HIGH (primary sources: official TS6 release notes, TypeScript docs)

---

## Current System Structure

```
packages/tsconfig/
  base.json              ← root preset, extends @tsconfig/node24
  react-app.json         ← extends base.json, adds jsx + noEmit
  react-library.json     ← extends base.json, adds jsx + declaration

packages/ui/
  tsconfig.json          ← extends react-library.json, adds baseUrl + paths

packages/eslint-config/
  tsconfig.json          ← extends base.json, adds baseUrl + paths

apps/showcase/
  tsconfig.json          ← extends react-app.json, adds baseUrl + paths

pnpm-workspace.yaml      ← catalog: typescript: ^5.9.3
```

### Cascade Direction

```
@tsconfig/node24
    ↓
packages/tsconfig/base.json
    ↓                    ↓
react-app.json     react-library.json
    ↓                    ↓
apps/showcase/     packages/ui/
tsconfig.json      tsconfig.json

packages/tsconfig/base.json
    ↓
packages/eslint-config/
tsconfig.json
```

Data flows strictly downward. Leaf configs can only add or override — they cannot modify the preset chain above them.

---

## TypeScript 6 Changes That Affect This Codebase

### 1. `baseUrl` Deprecation (TS5101 warning → TS7 removal)

**Status:** Deprecated in TS6, removed in TS7. Emits `TS5101` warning on every typecheck run.

**What it was doing here:** All three leaf tsconfigs set `"baseUrl": "."` purely to anchor their `paths` entries. None of them use `baseUrl` as a bare-specifier resolution root (no bare imports like `import { foo } from "components/foo"`).

**What changes:** `paths` entries have not required `baseUrl` since TypeScript 4.1 (PR #40101). Without `baseUrl`, path entries resolve relative to the tsconfig file location. The migration is purely mechanical: remove `baseUrl: "."` and prefix each path target with `./`.

**Before (showcase):**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

**After (showcase):**
```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

The path targets already use `./src/*`, so the prefix is already explicit. The `baseUrl: "."` removal is the only required change — the `paths` values themselves do not need modification in this codebase.

**After (ui):**
```json
{
  "compilerOptions": {
    "paths": {
      "@ui": ["./src/index.ts"],
      "@ui/*": ["./src/*"]
    }
  }
}
```

**After (eslint-config):**
```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### 2. `preserveConstEnums` Status

**Status:** NOT deprecated in TypeScript 6. The deprecation list confirmed by official TS6 release notes does not include `preserveConstEnums`. It remains valid in `base.json`. No change required.

### 3. New Default Behavior Changes That Do Not Require Config Changes

The following TS6 default changes are already explicitly set in this codebase and therefore are no-ops:

| TS6 New Default | Current `base.json` Setting | Impact |
|---|---|---|
| `strict: true` | `"strict": true` explicitly set | No change |
| `esModuleInterop: true` always | `"esModuleInterop": true` explicitly set | No change |
| `rootDir` defaults to config directory | Not set in base.json; `include` arrays in leaf configs constrain resolution naturally | Needs verification — see Pitfall below |
| `types: []` | Not set anywhere | Potential silent breaking change |

### 4. `types` Default Change — Potential Silent Issue

**Status:** MEDIUM confidence, needs verification after bumping.

In TS6, `types` defaults to `[]` (empty) instead of auto-discovering all `@types/*` packages in `node_modules`. This means `@types/node`, `@types/react`, etc. are no longer implicitly available unless:
- The tsconfig sets `"types": ["node", "react"]`, or
- The consuming package has `@types/*` in `devDependencies` (still picked up within that package's scope)

The current configs do not set `types`. For the base preset (Node.js context), this likely means `@types/node` globals stop being auto-injected. The `lib: ["esnext", "DOM"]` setting in `base.json` covers DOM types but not Node.js globals.

**Resolution:** Add `"types": ["node"]` to `base.json` if typechecks fail on Node.js globals after bumping. Leaf configs that need React types should add `"types": ["react", "react-dom"]` or rely on package-local `@types/react` resolution.

### 5. `esModuleInterop: false` and `allowSyntheticDefaultImports: false` Now Errors

**Status:** HIGH confidence. Setting either to `false` in TS6 produces a hard error. Current `base.json` sets `"esModuleInterop": true`, so this is safe. No leaf config overrides it to `false`.

---

## Vite Path Alias: No Change Required

`apps/showcase/vite.config.ts` defines its alias independently of tsconfig:

```typescript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
```

This is a Vite-level runtime alias, not a tsconfig-driven alias. Vite does not read `tsconfig.paths` by default — it uses its own `resolve.alias`. Removing `baseUrl` from `apps/showcase/tsconfig.json` has **zero effect** on Vite's runtime resolution. The alias continues to work identically.

The tsconfig `paths` entry in showcase (`@/*` → `./src/*`) exists solely so the TypeScript language server resolves the alias during type checking. These two configs (Vite alias and tsconfig paths) are parallel declarations of the same mapping — one for the bundler, one for tsc.

---

## tsup Build: No Change Required

`packages/ui/tsup.config.ts` does not use tsconfig `paths` for resolution. tsup invokes esbuild under the hood, which performs its own module resolution. The `paths` in `packages/ui/tsconfig.json` are consumed only by `tsc` (via `dts: true` which calls `tsc` for declaration generation).

The `@ui` and `@ui/*` aliases in `packages/ui/tsconfig.json` map internal source locations for type-checking, not for esbuild bundling. Removing `baseUrl` does not affect esbuild's resolution path.

**Caveat:** If tsup's `dts: true` triggers `tsc` with path-mapping, confirm that tsc still resolves `@ui` correctly after removing `baseUrl`. Since the paths targets are already explicit (`./src/index.ts`, `./src/*`), this should be transparent.

---

## `@tsconfig/node24` Compatibility

`packages/tsconfig/base.json` extends `@tsconfig/node24/tsconfig.json` (currently at v24.0.4).

The `@tsconfig/node24` preset sets:
- `module: "nodenext"`, `moduleResolution: "node16"`, `target: "es2024"`, `strict: true`

**Critical conflict:** `base.json` overrides `module`, `moduleResolution`, and `target` entirely:
```json
"target": "esnext",
"module": "ESNext",
"moduleResolution": "bundler"
```

This means `@tsconfig/node24` contributes only its `lib`, `strict`, `esModuleInterop`, and `skipLibCheck` settings — all of which `base.json` also explicitly sets. In practice, `@tsconfig/node24` is nearly fully overridden.

**TS6 interaction:** `@tsconfig/node24` itself does not set `baseUrl`, so no conflict there. The preset does not create TS6 deprecation warnings on its own. The deprecations come from the leaf configs that add `baseUrl`.

**Recommendation:** `@tsconfig/node24` is not a blocking concern for the migration. It may be worth evaluating whether extending it provides meaningful value given that every setting it contributes is overridden, but that is out of scope per PROJECT.md.

---

## Component Boundaries

| Component | Responsibility | Owns | Consumes |
|---|---|---|---|
| `packages/tsconfig` | Shared compiler options presets | `base.json`, `react-app.json`, `react-library.json` | `@tsconfig/node24` |
| `packages/ui` | React component library, produces `dist/` | Its own `tsconfig.json` | `react-library.json` preset |
| `packages/eslint-config` | Shared ESLint rules, produces `dist/` | Its own `tsconfig.json` | `base.json` preset |
| `apps/showcase` | React app (Vite), no `dist/` emitted | Its own `tsconfig.json`, `vite.config.ts` | `react-app.json` preset |
| `pnpm-workspace.yaml` | Canonical TypeScript version via catalog | `typescript: ^5.9.3` | All packages |

---

## Config Change Cascade — Edit Order

Changes must be applied in dependency order to avoid a typecheck passing in a preset but failing in a leaf that overrides it incorrectly.

```
Step 1: pnpm-workspace.yaml
  → Bump catalog: typescript: ^5.9.3 → ^6.0.2

Step 2: packages/tsconfig/base.json
  → No baseUrl to remove (none present)
  → Verify preserveConstEnums is still valid (it is)
  → Consider adding "types": ["node"] if Node globals fail

Step 3: packages/tsconfig/react-app.json
  → No changes required

Step 4: packages/tsconfig/react-library.json
  → No changes required

Step 5: packages/ui/tsconfig.json
  → Remove "baseUrl": "."
  → paths targets already explicit — no path value changes needed

Step 6: packages/eslint-config/tsconfig.json
  → Remove "baseUrl": "."
  → paths targets already explicit — no path value changes needed

Step 7: apps/showcase/tsconfig.json
  → Remove "baseUrl": "."
  → paths targets already explicit — no path value changes needed

Step 8: packages/eslint-config/package.json
  → Widen peerDependency: "typescript": "^5.0.0" → "^5.0.0 || ^6.0.0"

Step 9: Run typecheck across all packages
  → Turbo: pnpm typecheck
  → Expected: zero TS5101 warnings, zero errors
```

**Why this order:** The catalog bump (Step 1) changes the compiler version for all packages simultaneously. Preset changes (Steps 2-4) must happen before leaf changes (Steps 5-7) so that if tsc is run incrementally, it sees a consistent preset. In practice, `turbo typecheck` only runs after all edits are done, so the order within Steps 2-7 does not matter for correctness — it matters for readability of the diff.

---

## Turbo Build Order Implications

From `turbo.json`:
- `typecheck` depends on `^build` — meaning all upstream package builds must complete before typechecking starts
- `packages/tsconfig` has no `build` task (it is JSON files, not compiled)
- `packages/ui` must build before `apps/showcase` can typecheck (showcase imports `@monorepo-template/ui`)
- `packages/eslint-config` must build before apps can lint

The TypeScript version bump does not change this dependency graph. tsconfig changes are picked up by tsc directly from the JSON files — no build step needed for the preset package itself.

---

## Architecture Risks

### Risk 1: `rootDir` Default Change Uncovering Latent Issues
TS6 changes `rootDir` default from "inferred from input files" to "directory containing tsconfig.json". All three leaf configs have explicit `include` arrays (`["src", "*.ts"]`). If any `.ts` file outside `src/` is included that tsc previously auto-included, the new `rootDir: "."` default might emit declarations outside the expected output structure. This only matters for packages that emit declarations (`packages/ui`, `packages/eslint-config`). Verify `dist/` structure is unchanged after migration.

### Risk 2: `types: []` Default Breaking Node Globals
Packages using `process`, `Buffer`, `__dirname`, etc. without `@types/node` in their `devDependencies` will get type errors. The root `package.json` has `@types/node: ^25.6.0` as a devDependency — this may or may not be visible to nested packages depending on hoisting. Explicit `"types": ["node"]` in `base.json` is the safe resolution.

### Risk 3: `typescript-eslint` Peer Compatibility
`packages/eslint-config` uses `typescript-eslint: ^8.58.2`. TypeScript 6 support in typescript-eslint is tracked in issue #12123. As of the research date, typescript-eslint v8.x added TS6 support. Verify the installed version supports TS6 before or immediately after bumping.

---

## Authoritative Sources

- TypeScript 6.0 Release Notes: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html
- Announcing TypeScript 6.0: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/
- TS 5.x to 6.0 Migration Guide: https://gist.github.com/privatenumber/3d2e80da28f84ee30b77d53e1693378f
- `paths` without `baseUrl` PR (TS 4.1): https://github.com/microsoft/TypeScript/pull/40101
- TS6 `baseUrl` deprecation issue: https://github.com/microsoft/TypeScript/issues/62207
- typescript-eslint TS6 tracking: https://github.com/typescript-eslint/typescript-eslint/issues/12123
- tsconfig/bases node24: https://github.com/tsconfig/bases/blob/main/bases/node24.json
