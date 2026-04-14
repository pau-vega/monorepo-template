# Phase 1: Catalog Bump & TSConfig Cleanup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-04-14
**Phase:** 01-catalog-bump-tsconfig-cleanup
**Areas discussed:** types field strategy, @tsconfig/node24 fallback, peer dep version format, verification scope

---

## Types Field Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Per-preset (Recommended) | Set types in react-app.json and react-library.json with the types they need. base.json stays minimal. Each preset declares exactly what it uses. | ✓ |
| In base.json only | Set types: ["node"] in base.json so all configs inherit. React presets may need to extend the list if they need additional types. | |
| You decide | Claude picks the approach during planning based on what TS6 actually requires. | |

**User's choice:** Per-preset (Recommended)
**Notes:** No follow-up needed -- decision was clear.

---

## @tsconfig/node24 Fallback

| Option | Description | Selected |
|--------|-------------|----------|
| Override in base.json (Recommended) | Keep the extends, override any problematic fields in base.json compilerOptions. Minimal change, stays on the preset for future updates. | ✓ |
| Drop extends, inline settings | Remove the @tsconfig/node24 extends entirely. Inline its settings into base.json for full control. More churn but no inherited surprises. | |
| Pin preset version | Lock @tsconfig/node24 to a specific version known to be TS6-compatible. Less churn now, but may drift. | |

**User's choice:** Override in base.json (Recommended)
**Notes:** No follow-up needed -- decision was clear.

---

## Peer Dependency Version Format

| Option | Description | Selected |
|--------|-------------|----------|
| >=5.0.0 (Recommended) | Broad range. Accepts any TS5+ including v6. Simple, forward-compatible. Standard for templates that want to work with future versions. | ✓ |
| ^5.0.0 \|\| ^6.0.0 | Precise union. Explicitly declares both majors supported. More defensive -- won't accept TS7 until manually updated. | |
| >=5.0.0 <7.0.0 | Bounded range. Accepts TS5 and TS6 but not TS7. Middle ground between broad and precise. | |

**User's choice:** >=5.0.0 (Recommended)
**Notes:** No follow-up needed -- aligns with REQUIREMENTS.md CAT-02.

---

## Verification Scope in Phase 1

| Option | Description | Selected |
|--------|-------------|----------|
| Quick tsc sanity check (Recommended) | Run tsc --noEmit on each package after changes to confirm zero TS5101 warnings. Catches config mistakes immediately. Full build/test deferred to Phase 2. | ✓ |
| No verification in Phase 1 | Trust the config changes, defer ALL verification to Phase 2. Faster phase, but config mistakes won't surface until later. | |
| Full build + typecheck | Run turbo build + tsc --noEmit in Phase 1 too. Overlap with Phase 2, but catches everything immediately. | |

**User's choice:** Quick tsc sanity check (Recommended)
**Notes:** No follow-up needed -- clear boundary with Phase 2.

---

## Claude's Discretion

- Exact `types` array values per-preset
- Whether `preserveConstEnums` needs adjustment for TS6
- Order of operations for the atomic change

## Deferred Ideas

None -- discussion stayed within phase scope
