# Project Coding Rules (Non-Obvious Only)

- Use alias imports `@/...` (wired in `vite.config.ts` + `tsconfig.json`); keep consistent in new modules.
- ClassName composition → prefer `cn()` (`src/shared/lib/utils.ts`) so Tailwind merge ordering works w/ Prettier Tailwind plugin.
- Builder mutations → go through `useBuilderStore` updaters (`updateElement`, `updateSelected*`) vs ad-hoc array mutation (`src/pages/builder/model/use-builder-store.ts`).
- New “action” types must respect `isInteractiveMode` gate; follow `handleAction()` pattern (`src/pages/builder/lib/use-action-runner.ts`).
- Avoid introducing a 3rd UID generator; there are already 2 incompatible `uid()` fns (`src/shared/lib/utils.ts`, `src/shared/lib/builder-utils.ts`).
- `@broker/core-sdk` currently missing from `package.json` → changes that touch those imports may break build until dep/source resolved.
