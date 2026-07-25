# Dependency Upgrade Plan

Generated 2026-07-25 from `npm outdated` / `npm audit` against the current `package.json`.

## Current state

- `npm audit`: **18 vulnerabilities** (11 high, 6 moderate, 1 low), all transitive (via `vite`, `@hookform/devtools` → `uuid`, `cosmiconfig` → `yaml`).
- The high-severity findings are Vite dev-server path traversal / arbitrary file read issues, fixed in `vite@7.3.6` (still v7, no breaking change expected).
- Several packages have major versions available that are **not** drop-in: MUI 5→9, React 18→19, TypeScript 5→7, ESLint 9→10, Vite 7→8.

## Phase 1 — Safe patch/minor bumps (low risk, do first)

These stay within their current major version. No expected API breakage.

| Package | Current | Target |
|---|---|---|
| vite | 7.2.2 | 7.3.6 |
| @eslint/js | 9.39.1 | 9.39.5 |
| eslint | 9.39.1 | 9.39.5 |
| eslint-plugin-react-refresh | 0.4.24 | 0.4.26 |
| @reduxjs/toolkit | 2.10.1 | 2.12.0 |
| @types/react | 18.3.27 | 18.3.31 |
| react-hook-form | 7.66.1 | 7.83.0 |
| react-redux | 9.2.0 | 9.3.0 |
| redux-saga | 1.4.2 | 1.5.0 |
| typescript-eslint | 8.47.0 | 8.65.0 |
| @react-buddy/ide-toolbox | 2.4.0 | 2.5.0 |

**Instructions:**
1. Create a branch: `git checkout -b deps/phase-1-patch-updates`
2. `npm install <pkg>@<target>` for each row above (or bump ranges in `package.json` and run `npm install`).
3. Run `npm audit` again — the Vite high-severity findings should clear. Note remaining findings (likely `@hookform/devtools`'s `uuid` dep and `cosmiconfig`'s `yaml` dep) are dev-only and low urgency; re-evaluate once `@hookform/devtools` publishes a fix, don't force-fix them.
4. Run `npm run build` and `npm run lint`.
5. Manually smoke-test the app (`npm run dev`): list loads, keyboard navigation, detail form fetch/select, GitHub Pages base path unaffected.
6. Commit and open a PR titled something like "Bump dependencies (patch/minor)".

## Phase 2 — Major upgrades (evaluate and do independently, one PR each)

Each of these is a real migration with its own breaking-change surface. Do **not** bundle them together — if something regresses, you want to bisect to one package.

### 2a. Vite 7 → 8 (+ `@vitejs/plugin-react` 4→6, `vite-plugin-checker` 0.11→0.14, `vite-plugin-svgr` 4→5)
- Read Vite 8 migration guide; confirm Node version compatibility (project currently on Node 24, should be fine).
- Bump `vite`, `@vitejs/plugin-react`, `vite-plugin-checker`, `vite-plugin-svgr` together since they're coupled to the Vite plugin API.
- Verify `vite.config.ts` still builds and the GitHub Pages base-path config still works (`npm run build && npm run preview`).

### 2b. ESLint 9 → 10 (+ `eslint-plugin-react-hooks` 5→7, `globals` 16→17)
- Check flat-config compatibility; `eslint-plugin-react-hooks` 7.x targets ESLint 9/10 — verify current `eslint.config.*` still parses.
- Run `npm run lint` and fix any newly-surfaced rule violations or config errors.

### 2c. TypeScript 5 → 7
- TS 7 is a major rewrite (native/Go-based compiler); expect possible tooling friction with `typescript-eslint` and `vite-plugin-checker`.
- Confirm `typescript-eslint` version in use supports TS 7 before bumping.
- Run `npm run build` (`tsc -b`) and fix any new strict-mode diagnostics.
- Do this **after** 2b since `typescript-eslint` sits between them.

### 2d. React 18 → 19 (+ `@types/react-dom` 18→19)
- Review React 19 breaking changes (removed APIs, new JSX transform requirements, ref-as-prop changes).
- Check `react-redux`, `react-hook-form`, `redux-saga`, and MUI 5's React 19 compatibility — MUI 5 does **not** officially support React 19; this may force 2e to happen first or simultaneously.
- Smoke-test keyboard navigation and focus management in `PokemonList` closely — most likely to be affected by ref/JSX-transform changes.

### 2e. MUI 5 → 9
- Largest-surface change: 4 major versions (6, 7, 8, 9) collapsed into one jump. Do this as its own dedicated effort, not a quick bump.
- Read MUI's migration guides for v6, v7, v8, v9 in order — breaking changes accumulate across each.
- Expect: Emotion version requirements changes, `styled()` API surface changes, theme shape changes, possible Grid/Box prop renames.
- Since all styling in this repo goes through MUI's `styled()` (see `FormComponent.Styled.ts` and friends), audit every styled component after upgrading.
- Do this only after React 19 (2d) is settled, since recent MUI majors target React 18/19.

## Suggested order

1. Phase 1 (patch/minor) — single PR, low risk.
2. 2a (Vite) and 2b (ESLint) — can be done in parallel, independent of the React/MUI stack.
3. 2c (TypeScript) — after 2b.
4. 2d (React 19) — after confirming MUI compatibility story.
5. 2e (MUI) — largest effort, last, one PR per MUI major version if problems arise (5→6, 6→7, 7→8, 8→9) rather than one big jump.

## General instructions for every phase

- One branch and one PR per phase/package group above — do not combine unrelated majors in a single PR.
- After each install, run: `npm run lint`, `npm run build`, `npm run dev` + manual smoke test.
- Re-run `npm audit` after each phase to track vulnerability count trending to zero.
- If a major upgrade blocks on a peer dependency conflict, stop and report back rather than forcing with `--legacy-peer-deps` or `--force`.