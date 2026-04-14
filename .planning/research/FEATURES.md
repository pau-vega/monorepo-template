# Feature Landscape: TypeScript 6 Migration

**Domain:** TypeScript compiler upgrade — monorepo template
**Researched:** 2026-04-14
**Confidence:** HIGH (primary source: official TypeScript 6.0 release notes + typescriptlang.org/docs)

---

## What This File Answers

TypeScript 6 (released 2026-03-17) introduces 9 changed defaults, several hard removals, and a set of soft deprecations. This file categorizes every relevant change against the three config files that must be migrated:

- `packages/tsconfig/base.json` (shared preset, extends `@tsconfig/node24`)
- `apps/showcase/tsconfig.json` (React app, extends `react-app.json`)
- `packages/ui/tsconfig.json` (React library, extends `react-library.json`)
- `packages/eslint-config/tsconfig.json` (tooling, extends `base.json`)

---

## Table Stakes — Must Fix (TS6 Will Not Compile Without These)

These are **hard removals** in TS6 — setting them produces an error that `"ignoreDeprecations": "6.0"` cannot suppress.

| Change | Affected Files | Current State | Impact |
|--------|----------------|---------------|--------|
| `moduleResolution: node` removed | `@tsconfig/node24` preset | Inherited `"node16"` (alias for node10) from `@tsconfig/node24` | `base.json` already overrides with `"bundler"` — override wins. `@tsconfig/node24` itself may emit a deprecation warning but is not a hard error for the consuming project. Verify by running `tsc` with TS6 and checking for TS5101 errors. |
| `moduleResolution: classic` removed | None in this project | Not used | No action needed |
| `module: amd/umd/systemjs` removed | None in this project | Not used | No action needed |
| `outFile` removed | None in this project | Not used | No action needed |
| `target: es5` removed | None in this project | Not used (`target: esnext` is set) | No action needed |
| `downlevelIteration` removed | None in this project | Not used | No action needed |
| `asserts` import keyword | None in this project | Not used | No action needed |

**Verdict:** This project has no hard-removal blockers from its own configs. The only risk is whether `@tsconfig/node24` (which includes `moduleResolution: node16`) triggers a TS5101 error when *that preset's own tsconfig* is evaluated. This is the first thing to test after the version bump.

---

## Table Stakes — Must Fix (Soft Deprecations That Produce TS5101 Errors)

Soft deprecations emit **TS5101 errors** unless `"ignoreDeprecations": "6.0"` is set. The project explicitly refuses to use `ignoreDeprecations` (see PROJECT.md). These must be resolved cleanly.

### 1. `baseUrl` Deprecation — HIGH PRIORITY

**Status:** Soft deprecation (TS5101 error, suppressible only with `ignoreDeprecations`)
**Affected files:** 3 configs
- `apps/showcase/tsconfig.json` — `"baseUrl": ".", "paths": { "@/*": ["./src/*"] }`
- `packages/ui/tsconfig.json` — `"baseUrl": ".", "paths": { "@ui": ["./src/index.ts"], "@ui/*": ["./src/*"] }`
- `packages/eslint-config/tsconfig.json` — `"baseUrl": ".", "paths": { "@/*": ["./src/*"] }`

**Why deprecated:** `baseUrl` was the only way to use `paths` in TS5. In TS6, `paths` works standalone without `baseUrl`. `baseUrl` also served as a bare-specifier resolution root, which is now considered an anti-pattern.

**Migration — remove `baseUrl`, make `paths` entries self-sufficient:**

For `showcase` and `eslint-config` (pattern: `"@/*": ["./src/*"]`):
```json
// Remove baseUrl entirely. paths entries already use relative syntax.
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
The path `"./src/*"` is relative to the tsconfig file location, which is identical to what `baseUrl: "."` + `"./src/*"` produced. No content change needed, only remove `baseUrl`.

For `packages/ui` (two-alias pattern):
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
Same reasoning — `./src/...` paths are already explicit. Remove `baseUrl: "."` only.

**Verification:** After removing `baseUrl`, run `tsc --noEmit` in each package. Path aliases must still resolve correctly for the bundler (Vite) — note that TypeScript `paths` only affect type-checking; Vite has its own alias config and is unaffected.

### 2. `esModuleInterop: false` — Not Applicable Here

`base.json` already has `"esModuleInterop": true`. In TS6, setting it to `false` becomes an error. This project is already compliant.

### 3. `allowSyntheticDefaultImports: false` — Not Applicable Here

Not set explicitly in any project config. Default is now `true` (always enabled). No action needed.

### 4. `alwaysStrict: false` — Not Applicable Here

Not set explicitly. `strict: true` is already in `base.json`. No action needed.

---

## Changed Defaults — Must Audit

These defaults changed in TS6. Because this project's `base.json` extends `@tsconfig/node24` and then overrides, existing explicit settings may already be set correctly — but the `@tsconfig/node24` preset itself uses TS5-era defaults that are now overridden by new TS6 defaults.

### 1. `types` Now Defaults to `[]` (Empty)

**Previous default:** All `@types/*` packages in `node_modules/@types` auto-included
**TS6 default:** Empty array — nothing auto-included

**Impact assessment:** The project's `base.json` does not set `types` explicitly. With TS6, global types from `@types/react`, `@types/react-dom`, and `@types/node` will no longer be auto-included.

**Risk:** Projects using globals from `@types/node` (e.g., `process`, `Buffer`, `__dirname`) or `@types/jest`/`@types/vitest` globals will get "cannot find name" errors.

**Recommended fix for `base.json`:** Explicitly set `"types": []` to document the intent clearly (no global types by default), or add specific packages as needed per config:

```json
// In react-app.json or individual app tsconfigs, add:
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

For `eslint-config/tsconfig.json` which builds Node.js tooling, may need:
```json
{
  "compilerOptions": {
    "types": ["node"]
  }
}
```

**Priority:** Test with TS6 first — if `@types` packages are listed in `package.json` devDependencies and the code uses no globals, this may be a no-op. Only matters if global ambient types are relied upon.

### 2. `rootDir` Now Defaults to `.` (tsconfig.json directory)

**Previous default:** Inferred from common root of source files
**TS6 default:** Directory containing the tsconfig.json file

**Impact assessment:** The shared presets (`react-app.json`, `react-library.json`, `base.json`) live in `packages/tsconfig/` but apps and packages override them locally. Since each app/package has its own `tsconfig.json` with `"include": ["src"]`, TS6's `rootDir: "."` means TypeScript expects all source files to be under the tsconfig directory — which is correct.

**Risk:** The `react-library.json` and `react-app.json` presets in `packages/tsconfig/` emit no output directly (they are used as extensions), so their `rootDir` default does not matter. Individual package tsconfigs that emit (`react-library.json` uses `declaration: true`) may be affected if they don't set an explicit `rootDir`.

**Recommended fix:** Add `"rootDir": "./src"` to `react-library.json` (the emit preset), since that preset enables `declaration: true` and emitting to a `dist/` folder implies sources are in `src/`.

### 3. `noUncheckedSideEffectImports` Now Defaults to `true`

**Previous default:** `false`
**TS6 default:** `true`

**What this does:** With `true`, TypeScript errors on side-effect imports (e.g., `import "./styles.css"`) where the file cannot be found. Previously, TypeScript silently skipped unresolvable side-effect imports.

**Impact assessment:** The `showcase` app likely imports CSS files for Tailwind (`import "./index.css"` or similar). With `moduleResolution: bundler`, CSS imports may or may not resolve depending on Vite's type stubs.

**Risk:** `import "*.css"` patterns will emit TS errors unless the CSS module's type is declared somewhere. Vite provides `vite/client` types which include `*.css` declarations.

**Recommended fix:** In `react-app.json` (or individual app tsconfigs):
```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```
This provides the `*.css` ambient module declaration. Alternatively, set `"noUncheckedSideEffectImports": false` explicitly in `base.json` to restore the TS5 behavior — but only if CSS imports are actually used.

**Note:** `base.json` already has this option absent — the new default activates automatically with TS6.

### 4. `strict` Now Defaults to `true`

**Not applicable:** `base.json` already sets `"strict": true`. No action needed.

### 5. `module` Now Defaults to `esnext`

**Not applicable:** `base.json` already sets `"module": "ESNext"`. No action needed.

### 6. `target` Now Defaults to `es2025` (floating)

**Not applicable:** `base.json` already sets `"target": "esnext"`. No action needed.

### 7. `libReplacement` Now Defaults to `false`

**Previous default:** `true` (custom lib implementations were checked)
**TS6 default:** `false` (performance improvement)

**Impact:** Minimal for standard projects not using custom lib overrides. This is a no-op for this template.

---

## Improvements — Should Adopt

New TS6 features and options that are worth adding to the template for a clean, modern baseline. These are optional but align with the template's goal of a clean starting point.

### 1. Explicit `"types": []` in `base.json`

Even though the template may not break immediately from the `types` default change (depending on what globals are used), being explicit is better than relying on an implicit default.

**Add to `base.json`:**
```json
"types": []
```

Then individual presets/apps opt into the types they need. This is already best practice and TS6 makes it the default behavior — codify it explicitly.

### 2. Explicit `"rootDir": "./src"` in `react-library.json`

The `react-library.json` preset enables emit (`declaration: true`). With TS6's new `rootDir` default, being explicit prevents surprises when `dist/` output structure changes between TS5 and TS6.

### 3. Temporal API Support (Library Type)

TS6 ships first-class `Temporal` types. `Temporal` is the modern replacement for `Date`. The template's `"lib": ["esnext", "DOM"]` in `base.json` should automatically include Temporal types as they're part of ESNext — no config change needed.

**Verdict:** Auto-included. No action needed.

### 4. ES2025 `lib` and `target`

TS6 introduces `"target": "es2025"` and `"lib": ["es2025"]` as stable options. The project already uses `"target": "esnext"` which floats to the latest — this is already equivalent or better. No change needed.

### 5. Subpath Imports (`#/` prefix)

TS6 supports Node.js `"imports"` field in `package.json` for `#/*` subpath imports under `moduleResolution: bundler` or `nodenext`.

**Verdict:** Not relevant for this template's current structure. Packages use `paths` for aliasing, not Node.js subpath imports. Ignore.

### 6. `--stableTypeOrdering` Flag

New flag to make TS6 type ordering match TS7's deterministic ordering. Documentation notes it can add up to 25% slowdown.

**Verdict:** Ignore. This is a debugging tool for diagnosing 6.0→7.0 migration differences, not for production use. The template should not set this.

### 7. Update `eslint-config` Peer Dependency Range

`packages/eslint-config/package.json` lists `"typescript": "^5.0.0"` as a peer dependency. This must be updated to `"typescript": "^5.0.0 || ^6.0.0"` (or `">=5.0.0"`) to accept TS6 consumers.

**This is a must-fix** for the template to be usable — a TS6 project installing this eslint-config would get a peer dependency warning.

---

## Ignore — Not Applicable to This Setup

TS6 features that don't apply to this monorepo template's architecture.

| Feature | Why Ignore |
|---------|-----------|
| `--ignoreConfig` flag | CLI-only flag for compiling single files ignoring tsconfig. Not relevant to project builds. |
| `--stableTypeOrdering` | Debugging/migration tool, adds 25% slowdown. Not for production. |
| `module: amd/umd/systemjs` removal | Not used. Project uses `module: esnext`. |
| `outFile` removal | Not used. Template uses bundler (Vite) + tsup. |
| `moduleResolution: classic` removal | Not used. |
| Subpath imports (`#/`) | Template uses `paths` aliasing, not Node.js `imports` field. |
| Namespace `module` keyword deprecation | Template follows project rules (no enums, no namespaces). |
| `asserts` import keyword error | Not used. Template uses `with` syntax (modern). |

---

## Feature Dependencies

```
Remove baseUrl (showcase) → verify Vite alias config still works (independent of TS)
Remove baseUrl (ui) → verify tsup build resolves @ui alias correctly
Remove baseUrl (eslint-config) → verify eslint type-checking still works
Update @tsconfig/node24 → check if newer version removes node16 (avoids TS warning cascade)
Add explicit types: [] to base.json → add "vite/client" to react-app.json
Add rootDir: "./src" to react-library.json → verify dist/ output structure unchanged
Update eslint peer dep → required for template consumers on TS6
```

---

## MVP (Minimum Viable Migration)

The minimum set of changes to make the template build and typecheck cleanly on TS6 with zero errors and zero deprecation warnings:

**Must do (in order):**
1. Bump `typescript` in `pnpm-workspace.yaml` catalog from `^5.9.3` to `^6.0.2`
2. Remove `baseUrl` from `apps/showcase/tsconfig.json`, `packages/ui/tsconfig.json`, `packages/eslint-config/tsconfig.json` — paths entries are already prefix-complete
3. Update `eslint-config` peer dependency to include `"^6.0.0"`
4. Run `tsc --noEmit` across all packages and address any `types`-related errors (Vite client types, etc.)
5. Address `noUncheckedSideEffectImports` errors if any CSS/asset imports fail

**Should do (clean template baseline):**
6. Add `"types": []` explicitly to `base.json`
7. Add `"rootDir": "./src"` to `react-library.json`
8. Verify `@tsconfig/node24` version — if it uses `moduleResolution: node16` and TS6 emits a cascade of TS5101 from the preset, either stop extending it or override more aggressively

**Defer:**
- Migrating away from `@tsconfig/node24` entirely (the preset's `node16` is overridden by `base.json`'s `bundler` — the override wins, but the preset's line may still cause TS5101 warnings depending on how TS6 loads extended configs)

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Remove `baseUrl` | Vite build breaks even though TS typecheck passes — Vite alias config is separate | Verify Vite `resolve.alias` or `@/` pattern in `vite.config.ts` is independent of tsconfig `paths` |
| `types: []` default | Vitest globals (`describe`, `it`, `expect`) disappear — they're from `@types/vitest` | Add `"types": ["vitest/globals"]` to vitest tsconfig or `vitest.config.ts` globals option |
| `noUncheckedSideEffectImports: true` | `import "./index.css"` in showcase fails | Add `"types": ["vite/client"]` to react-app.json or set the option to false |
| `@tsconfig/node24` with `moduleResolution: node16` | Even though `base.json` overrides to `bundler`, TS6 may still emit TS5101 for the extended file | Check if `@tsconfig/node24` has a TS6-compatible release; if not, inline the relevant options from it and drop the extends |
| `eslint-config` peer dep | Template users on TS6 get peer dep warning | Update peerDependencies range before shipping |

---

## Confidence Assessment

| Area | Confidence | Source |
|------|------------|--------|
| Hard removals (outFile, es5, etc.) | HIGH | Official TS6 release notes (typescriptlang.org) |
| `baseUrl` soft deprecation + fix | HIGH | Official release notes + GitHub issues (microsoft/TypeScript#62207) |
| `types: []` default change | HIGH | Official release notes, multiple corroborating sources |
| `rootDir` default change | HIGH | Official release notes |
| `noUncheckedSideEffectImports` default | HIGH | Official release notes |
| `preserveConstEnums` status | HIGH | Confirmed NOT deprecated — not on the TS6 deprecation list |
| `@tsconfig/node24` TS6 behavior | MEDIUM | Known to use `node16` (directly read); unclear if it has been updated for TS6 — verify during implementation |
| Vite alias independence from tsconfig `paths` | MEDIUM | General bundler knowledge; verify during implementation |

---

## Sources

- [TypeScript 6.0 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html) — Official
- [Announcing TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) — Official Microsoft blog
- [TypeScript 6.0 Deprecation List (GitHub Issue #54500)](https://github.com/microsoft/TypeScript/issues/54500) — Official TypeScript repo
- [baseUrl Deprecation Issue #62207](https://github.com/microsoft/TypeScript/issues/62207) — Official TypeScript repo
- [Allow moduleResolution bundler + module commonjs (PR #62320)](https://github.com/microsoft/TypeScript/pull/62320) — Official TypeScript repo
- [TypeScript 5.x to 6.0 Migration Guide (Gist)](https://gist.github.com/privatenumber/3d2e80da28f84ee30b77d53e1693378f) — Community (MEDIUM confidence)
- [TypeScript 6.0 RC Announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-rc/) — Official
