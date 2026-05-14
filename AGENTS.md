# AGENTS.md

This file provides guidance to agents when working with code in this repository.

- Pkg mgr → npm (lockfile present) (`package-lock.json`).
- Cmds (`package.json`): dev/build/lint/format/typecheck/preview. No test runner/script defined → “single test” N/A.
- TS build uses project refs → `npm run build` runs `tsc -b` first (needs TS refs OK).
- Module path alias `@/*` → `src/*` (configured in `vite.config.ts` + `tsconfig.json`). Prefer alias over deep relatives.
- Prettier: `semi: false`, `printWidth: 80`, plugin `prettier-plugin-tailwindcss`; plugin configured w/ functions `cn`, `cva` (`.prettierrc`).
- Tailwind plugin config points to stylesheet `src/index.css` (in both `.prettierrc` + `components.json`) but actual global CSS imported is `src/app/styles/index.css` via `src/main.tsx` → beware mismatched path.
- Shared util `cn()` is canonical Tailwind class merge helper (`src/shared/lib/utils.ts`); keep class composition via `cn()`.
- Builder state is centralized in Zustand store `useBuilderStore` (`src/pages/builder/model/use-builder-store.ts`); slide data bootstrapped by deep-cloning `MOCK_SLIDES` (`JSON.parse(JSON.stringify(...))`).
- Action execution gated by `isInteractiveMode` in `useActionRunner.handleAction()`; actions no-op when false (`src/pages/builder/lib/use-action-runner.ts`).
- UID helper duplicated: `uid()` exists in both `src/shared/lib/utils.ts` + `src/shared/lib/builder-utils.ts` (different formats) → don’t mix unless intended.
- Code imports external types/runtime from `@broker/core-sdk` (e.g. `Slide`, engines) but it’s not declared in `package.json` → install/add dep or fix import source before build.

Evidence:

- `package.json`
- `.prettierrc`
- `components.json`
- `vite.config.ts`
- `tsconfig.json`
- `src/main.tsx`
- `src/shared/lib/utils.ts`
- `src/pages/builder/model/use-builder-store.ts`
- `src/pages/builder/lib/use-action-runner.ts`
