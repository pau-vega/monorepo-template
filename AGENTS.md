# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

pnpm + Turborepo monorepo with two workspace locations: `apps/*` and `packages/*`.

**Node >= 24** (see `.nvmrc`), **pnpm 10.11.0** (corepack).

## Commands

```bash
pnpm install              # install dependencies
pnpm dev                  # run all packages/apps in dev mode (turbo)
pnpm build                # build all packages (turbo, outputs to dist/)
pnpm lint                 # lint all packages (eslint --fix)
pnpm format               # format all packages (prettier --write)
pnpm typecheck            # typecheck all packages (tsc --noEmit)
pnpm clean                # remove dist/node_modules/.turbo in all packages (uses rimraf)
pnpm nuke                 # full reset (git clean), removes everything untracked
```

Run tasks for a single package: `pnpm --filter <package-name> <script>` (e.g. `pnpm --filter ui build`).

## Packages

- **`packages/ui`** — Shared React component library built with shadcn/ui, Radix primitives, Tailwind CSS v4, and `class-variance-authority`. Built with `tsup`. Exports components, hooks, and `globals.css`. Uses `tailwind-merge` + `clsx` via `cn()` utility in `src/lib/utils.ts`.
- **`packages/eslint-config`** — Shared ESLint flat config. Exports `node` and `react` presets. Uses `typescript-eslint`, `eslint-plugin-perfectionist`, `eslint-config-prettier`, and `@eslint-react`.

## Architecture Notes

- All packages use ESM (`"type": "module"`).
- TypeScript config extends `@tsconfig/node24` via `tsconfig.base.json` at root. Each package has its own `tsconfig.json`.
- Turbo tasks: `build`, `dev`, `typecheck`, `lint`, `format`, `clean`. Build outputs go to `dist/`.
- UI package components follow shadcn/ui patterns — each component in its own file under `src/components/`, hooks under `src/hooks/`, all re-exported from `src/index.ts`.
