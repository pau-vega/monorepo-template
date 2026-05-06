# Quick Task: Migrate from husky to lefthook

**Date:** 2026-05-06
**Status:** Complete

## Description
Migrate the project's git hooks from husky to lefthook for improved performance and monorepo support.

## Tasks

### 1. Remove husky dependency
- Remove husky from devDependencies
- Remove `prepare` script from package.json
- Delete `.husky` directory

### 2. Install and configure lefthook
- Install lefthook as devDependency
- Create `lefthook.yml` with equivalent hook configurations:
  - pre-commit: run `pnpm format:check` and `pnpm lint`
  - commit-msg: run commitlint
- Run `lefthook install` to set up git hooks

### 3. Verify installation
- Confirm hooks are installed in `.git/hooks/`
- Verify lefthook version
- Test that hooks trigger correctly
