# Domain Pitfalls: TypeScript 5 → 6 Migration

**Domain:** TypeScript version migration in a pnpm monorepo
**Researched:** 2026-04-14
**Scope:** TS5.9.3 → TS6.x migration for base-monorepo-template (Vite, React 19, tsup, shared tsconfig presets)

---

## Critical Pitfalls

Mistakes that cause typecheck failures, build errors, or silent regressions that surface only at runtime.

---

### Pitfall 1: tsup Injects `baseUrl: "."` Internally — Your Config Fix Is Not Enough

**What goes wrong:** Even after removing `baseUrl` from all three package tsconfigs (showcase, ui, eslint-config), the tsup DTS build fails with `TS5101: Option 'baseUrl' is deprecated`. This is because tsup's internal `getRollupConfig` function unconditionally injects `baseUrl: compilerOptions.baseUrl || "."` into the compiler options it passes to the TypeScript API. Your tsconfig is clean; tsup re-adds it anyway.

**Why it happens:** tsup uses the TypeScript compiler API to generate `.d.ts` declarations. When it constructs compiler options, it falls back to `"."` for `baseUrl` regardless of what your tsconfig says. This is a tsup bug, tracked as [egoist/tsup#1388](https://github.com/egoist/tsup/issues/1388) and [egoist/tsup#1389](https://github.com/egoist/tsup/issues/1389), opened the day TS6 shipped (March 24, 2026). Both issues remain open as of research date.

**Consequences:** The `eslint-config` package uses tsup for its build. Running `pnpm build` in that package will emit a TS5101 error and fail the DTS step even after you've cleaned up all tsconfigs. This blocks the build pipeline.

**Warning signs:**
- `TS5101: Option 'baseUrl' is deprecated` in tsup DTS output even though no tsconfig contains `baseUrl`
- Error only appears when `dts: true` is active in tsup config; `noEmit` typecheck passes fine

**Prevention:** Two-step mitigation. First, remove `baseUrl` from all tsconfigs as planned. Second, add a tsup-specific override to silence the injected deprecation while the upstream bug is unresolved. In the tsup config for `eslint-config`:

```ts
// tsup.config.ts
export default defineConfig({
  dtsConfig: {
    compilerOptions: {
      ignoreDeprecations: "6.0",
    },
  },
});
```

Do not add `ignoreDeprecations: "6.0"` to the root tsconfig — that would suppress deprecation warnings across the whole project, defeating the migration goal. Scope it to the tsup DTS step only.

**Phase:** Address in the same phase as `baseUrl` removal. Removing `baseUrl` without fixing the tsup injection means builds still fail. Do both atomically.

**Confidence:** HIGH — confirmed by two open tsup GitHub issues with exact error reproduction, opened on the TS6 release date.

---

### Pitfall 2: `paths` Resolution Changes Without `baseUrl` — Relative Prefix Required

**What goes wrong:** In TS5, many `paths` entries were written relative to `baseUrl`. When `baseUrl` is removed, the same `paths` entries silently resolve from the tsconfig file location instead. If the paths don't start with `./`, resolution behavior changes. In this repo, the pattern `"@/*": ["./src/*"]` already uses the correct `./`-prefixed form, so this is low risk — but the non-obvious failure mode is that TypeScript compiles without error while Vite's runtime path resolver (or vite-tsconfig-paths, if used) resolves from a different root.

**Why it happens:** TypeScript has allowed `paths` without `baseUrl` since TS4.1 (PR #40101). But the semantics changed: paths entries must now be relative to the tsconfig file itself. The rule is: if `baseUrl` is absent, every `paths` value must start with `./` or `../`.

**Consequences:**
- If a path entry lacks the `./` prefix, TypeScript may quietly resolve the import to `undefined` or produce a misleading "cannot find module" error at the wrong file
- The showcase tsconfig's `"@/*": ["./src/*"]` with `baseUrl: "."` becomes `"@/*": ["./src/*"]` without `baseUrl` — these are semantically identical when the tsconfig is at the package root, so this specific repo is safe
- The ui tsconfig's `"@ui": ["./src/index.ts"]` follows the same safe pattern

**Warning signs:** Typecheck passes but runtime imports fail or resolve to unexpected modules. IDE "go to definition" jumps to wrong file.

**Prevention:** After removing `baseUrl` from each package tsconfig, verify paths values against this rule: every path value must begin with `./`. Run `tsc --noEmit` and confirm zero errors. Do not rely on the IDE alone — run `tsc` from the CLI.

**Phase:** Part of `baseUrl` removal phase. Confirm path resolution correctness immediately after each package's `baseUrl` is removed, before moving to the next.

**Confidence:** HIGH — documented TypeScript behavior since 4.1; confirmed in official module resolution docs.

---

### Pitfall 3: `preserveConstEnums` Deprecation May Surface from the Base Config

**What goes wrong:** The shared `packages/tsconfig/base.json` sets `"preserveConstEnums": true`. This option was included in TS6's deprecation plan (GitHub issue #54500) though its TS5101 status is less certain than `baseUrl`. If it emits a TS5101 in TS6, the deprecation will appear in every package that extends `base.json` — all three (showcase, ui, eslint-config) — not just one.

**Why it happens:** `preserveConstEnums` controls whether `const enum` declarations retain their object form in the emit. With `isolatedModules: true` already set in base.json, `const enum` is already restricted. `preserveConstEnums` has no practical effect when `isolatedModules` is true, making it redundant. The TS6 cleanup targets options with no meaningful effect in modern configurations.

**Consequences:** All typecheck and build commands fail simultaneously with the same TS5101 message referencing a file users didn't edit. This looks confusing because the error appears in application tsconfigs rather than `base.json` itself.

**Warning signs:** TS5101 error mentioning `preserveConstEnums` in multiple packages simultaneously, all pointing up through the `extends` chain to base.json.

**Prevention:** Check whether TS6 emits TS5101 for `preserveConstEnums` when first bumping the TypeScript version in the catalog. If it does, remove it from `base.json` immediately — it is already a no-op given `isolatedModules: true`. If it does not warn, leave it in place (do not remove for removal's sake — the project goal is minimal churn).

**Phase:** Detect in the catalog-bump phase (the first step). Fix in that same phase if the warning appears.

**Confidence:** MEDIUM — `preserveConstEnums` appears in the TS6 deprecation tracking issue, but the official TS6 release notes do not call it out with the same prominence as `baseUrl`. Needs live verification on first install.

---

### Pitfall 4: Strict Mode Now Default — Existing Code With No Explicit `strict` Setting Breaks

**What goes wrong:** TypeScript 6 enables `strict: true` by default. Projects that never explicitly set `strict` in their tsconfig suddenly have `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, and all other strict sub-flags enabled. This causes a wave of type errors in existing code.

**Why it does NOT apply here:** This repo already explicitly sets `"strict": true` in `base.json`. All three package tsconfigs inherit it. This pitfall is a non-issue for this specific migration.

**Why it's included:** Future template users who fork before migrating may forget this. Also, `@tsconfig/node24` (the base preset this project extends) may set options that interact with new TS6 defaults. If the preset is updated to match TS6 defaults and removes an explicit `strict: true`, the effective configuration could shift.

**Warning signs:** Sudden `Type 'X | null' is not assignable to type 'X'` errors after bumping TypeScript, in code that was previously error-free.

**Prevention:** Keep `"strict": true` explicitly in `base.json`. Never rely on defaults for safety-critical flags.

**Phase:** N/A for this migration. Monitor if `@tsconfig/node24` is also updated simultaneously.

**Confidence:** HIGH — confirmed in multiple TS6 release resources; non-issue for this repo given explicit strict setting.

---

### Pitfall 5: `eslint-config` Peer Dependency Range Excludes TypeScript 6

**What goes wrong:** `packages/eslint-config/package.json` declares `"typescript": "^5.0.0"` as a peer dependency. This range excludes TypeScript 6 (semver `^5` means `>=5.0.0 <6.0.0`). After bumping the catalog to `typescript: ^6.0.2`, pnpm will report a peer dependency mismatch warning (or error, depending on pnpm strict peer mode). Consumer projects that install this shared ESLint config will see the warning on every install.

**Why it happens:** The peer dependency was set when the package was written for TS5. pnpm's `dedupePeerDependents: true` setting in this workspace means peer conflicts can propagate across packages in unexpected ways.

**Consequences:**
- `pnpm install` emits peer dependency warnings in CI and locally
- If pnpm peer dependency strictness is raised in the future, this becomes a hard install failure
- Template users who fork and then upgrade TypeScript inherit a misleading peer range

**Warning signs:** `pnpm install` output showing `eslint-config` peer dependency mismatch after catalog bump. pnpm warning: `typescript@6.x is not compatible with the declared peer dependency range ^5.0.0`.

**Prevention:** Update the peer dependency range in `packages/eslint-config/package.json` to `"typescript": ">=5.0.0"` (or `"^5.0.0 || ^6.0.0"`). The `>=5.0.0` form is simpler and forward-compatible with TS7. Update this in the same commit as the catalog bump so the workspace is internally consistent from the first install.

**Phase:** Catalog bump phase — do this before or alongside bumping the catalog entry.

**Confidence:** HIGH — peer dependency range semantics are standard semver; the current range `^5.0.0` definitively excludes 6.x.

---

## Moderate Pitfalls

---

### Pitfall 6: `ignoreDeprecations: "6.0"` as a Workaround Becomes Permanent

**What goes wrong:** When TS5101 errors first appear, the fastest fix is adding `"ignoreDeprecations": "6.0"` to `base.json`. This works, silences all warnings, and the project appears clean — but every deprecation suppressed this way becomes a hard removal error in TypeScript 7. The project context explicitly forbids this workaround for the base config, but the temptation is high when debugging multiple failing packages.

**Why it happens:** `ignoreDeprecations` is a designed escape hatch, and the error messages themselves suggest it. Developers under time pressure apply it globally without fully understanding the TS7 consequence.

**Consequences:** The template ships with a `ignoreDeprecations: "6.0"` in base.json, meaning every project forked from it carries the same debt. When TS7 ships, every project needs an emergency migration.

**Warning signs:** `"ignoreDeprecations": "6.0"` appearing in `packages/tsconfig/base.json` or any shared preset.

**Prevention:** The project decision is already correct: remove deprecated options rather than suppress them. The only acceptable use is scoped to the tsup DTS override (Pitfall 1). Treat any `ignoreDeprecations` in shared tsconfig files as a blocking issue in code review.

**Phase:** Governance concern for all phases. Establish the rule before starting: `ignoreDeprecations` is forbidden in shared presets.

**Confidence:** HIGH — `ignoreDeprecations: "6.0"` will not work in TS7; documented in official TS6 release notes.

---

### Pitfall 7: pnpm Catalog Bump Triggers Simultaneous Failures Across All Packages

**What goes wrong:** Because all packages consume TypeScript via `catalog:`, bumping the catalog entry from `^5.9.3` to `^6.0.2` upgrades all packages atomically. If any package has a deprecation or breaking change, all packages fail at the same time. This makes it hard to isolate which package is causing which error.

**Why it happens:** This is the catalog protocol's intended behavior (single source of truth), but it makes incremental validation impossible.

**Consequences:** If `pnpm typecheck` is run immediately after the catalog bump, all three packages emit TS5101 errors simultaneously. The error stream is large and the root cause (shared `base.json`) is buried.

**Warning signs:** All packages failing typecheck with the same error code in the same CI run immediately after the catalog bump commit.

**Prevention:** After bumping the catalog, run `tsc --noEmit` in each package individually in dependency order (tsconfig preset package first, then eslint-config and ui, then showcase). This makes the cascade visible: if base.json has a deprecation, it shows up first in eslint-config or ui before you touch showcase. Alternatively, run `tsc --noEmit` from `packages/tsconfig` (the preset package) first — but since it has no source files, run it from a consuming package.

**Phase:** Catalog bump phase. Plan for 10-20 minutes of isolation debugging rather than assuming a single `turbo typecheck` run will give clear results.

**Confidence:** HIGH — direct consequence of how pnpm catalogs work with atomic version upgrades.

---

### Pitfall 8: `@tsconfig/node24` Preset May Not Yet Be TS6-Aware

**What goes wrong:** `packages/tsconfig/base.json` extends `@tsconfig/node24/tsconfig.json`. If this preset was authored before TS6 and contains options now deprecated in TS6 (e.g., `module: "Node16"` with a `baseUrl`, or other legacy settings), those options will emit TS5101 errors in the extended configs and appear to originate from the consumer config, not the preset.

**Why it happens:** `@tsconfig/node24` (from the `tsconfig/bases` repo) may lag behind TS6 compatibility. The current installed version is `^24.0.4`. A known open issue (#345 in tsconfig/bases) exists for Node 24 import compatibility problems. Preset maintainers must explicitly test against TS6 and release an update.

**Consequences:** TS5101 errors in every package that uses base.json, with error messages pointing at lines inside `node_modules/@tsconfig/node24/tsconfig.json`. These errors cannot be fixed by editing project files.

**Warning signs:** TS5101 errors referencing a line number inside `node_modules/@tsconfig/node24/`. The project tsconfigs look correct but errors persist.

**Prevention:** Before bumping TypeScript, check the `@tsconfig/node24` changelog and npm for a version published after March 23, 2026 (TS6 release date). If a compatible version is available, bump it in `packages/tsconfig/package.json` first. If none exists yet, review what `@tsconfig/node24/tsconfig.json` actually contains (`cat node_modules/@tsconfig/node24/tsconfig.json`) and determine if any of its options trigger TS5101.

**Phase:** Pre-work before the catalog bump. This is a dependency to validate before TypeScript itself is bumped.

**Confidence:** MEDIUM — the specific issue depends on what `@tsconfig/node24@24.0.4` contains and whether maintainers have already released a TS6-compatible version. Requires live verification.

---

## Minor Pitfalls

---

### Pitfall 9: `esModuleInterop` Now Always `true` — Cannot Be Set to `false`

**What goes wrong:** TypeScript 6 makes `esModuleInterop: true` non-negotiable. It cannot be set to `false`. Since this project already has `"esModuleInterop": true` in `base.json`, there is no impact here. However, if any package later attempts to override it to `false` (for compatibility with a strict CJS library), they will get a TS error.

**Warning signs:** Only relevant if a new package is added that tries to disable `esModuleInterop`.

**Prevention:** Document in code comments that `esModuleInterop: false` is not valid in TS6+.

**Phase:** N/A — no action needed for this migration.

**Confidence:** HIGH — confirmed in TS6 release notes.

---

### Pitfall 10: `downlevelIteration` Deprecation May Appear if Extended Preset Sets It

**What goes wrong:** `downlevelIteration` is deprecated in TS6 because it only had effects on ES5 emit, and ES5 is now removed. If `@tsconfig/node24` (or any preset in the `extends` chain) sets this option, a TS5101 will appear.

**Warning signs:** TS5101 referencing `downlevelIteration` in a file you didn't edit.

**Prevention:** Check the `@tsconfig/node24` preset contents after install. Remove `downlevelIteration` from any config in the chain that sets it.

**Phase:** Detect during the catalog bump verification step.

**Confidence:** MEDIUM — `downlevelIteration` deprecation is confirmed; whether any config in this chain sets it requires live verification.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Bump `typescript` in catalog | Atomic failure across all packages simultaneously (Pitfall 7) | Run `tsc --noEmit` per package in leaf-first order, not via Turbo |
| Bump `typescript` in catalog | `@tsconfig/node24` may have TS6-incompatible options (Pitfall 8) | Inspect preset contents before bumping; update preset if needed |
| Update peer dep in eslint-config | `"typescript": "^5.0.0"` excludes TS6 (Pitfall 5) | Update to `">=5.0.0"` in the same commit as catalog bump |
| Remove `baseUrl` from package tsconfigs | tsup injects `baseUrl: "."` internally (Pitfall 1) | Add `ignoreDeprecations: "6.0"` scoped to tsup's `dtsConfig` only |
| Remove `baseUrl` from package tsconfigs | `paths` resolution changes (Pitfall 2) | Verify all path values start with `./`; run `tsc --noEmit` after each package |
| Remove `baseUrl` from base.json check | `preserveConstEnums` may emit TS5101 (Pitfall 3) | Check on first install; remove if warning appears |
| Any phase | `ignoreDeprecations: "6.0"` added to shared preset (Pitfall 6) | Treat as blocking in review; only allow in tsup dts override |

---

## Sources

- [TypeScript 6.0 Release Announcement — devblogs.microsoft.com](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/)
- [TypeScript 6.0 Beta Announcement — devblogs.microsoft.com](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0-beta/)
- [TypeScript 6.0 Release Notes — typescriptlang.org](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)
- [TypeScript 6.0 Deprecation List — GitHub Issue #54500](https://github.com/microsoft/TypeScript/issues/54500)
- [Deprecate, remove support for baseUrl — GitHub Issue #62207](https://github.com/microsoft/TypeScript/issues/62207)
- [baseUrl removal caused multiple libraries to fail — typescript-go #1431](https://github.com/microsoft/typescript-go/issues/1431)
- [tsup DTS Build error TS5101 — egoist/tsup #1388](https://github.com/egoist/tsup/issues/1388)
- [tsup Support TypeScript 6 — egoist/tsup #1389](https://github.com/egoist/tsup/issues/1389)
- [TypeScript 5.x to 6.0 Migration Guide (community) — GitHub Gist](https://gist.github.com/privatenumber/3d2e80da28f84ee30b77d53e1693378f)
- [esModuleInterop and allowSyntheticDefaultImports in TS6 — GitHub Issue #62529](https://github.com/microsoft/TypeScript/issues/62529)
- [NX tsconfig baseUrl deprecation issue — nrwl/nx #32958](https://github.com/nrwl/nx/issues/32958)
- [@docusaurus/tsconfig baseUrl issue — facebook/docusaurus #11893](https://github.com/facebook/docusaurus/issues/11893)
- [node24 TypeScript import issues — tsconfig/bases #345](https://github.com/tsconfig/bases/issues/345)
- [TypeScript 6 Support — typescript-eslint #12123](https://github.com/typescript-eslint/typescript-eslint/issues/12123)
- [paths without baseUrl PR — microsoft/TypeScript #40101](https://github.com/microsoft/TypeScript/pull/40101)
