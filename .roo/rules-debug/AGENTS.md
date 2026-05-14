# Project Debug Rules (Non-Obvious Only)

- If actions “do nothing” → check `isInteractiveMode` (actions are early-returned when false) (`src/pages/builder/lib/use-action-runner.ts`).
- Initial slide state resets → store seeds from deep-cloned `MOCK_SLIDES`; edits won’t persist across reload (no backend) (`src/pages/builder/model/use-builder-store.ts`).
- Build failures complaining about `@broker/core-sdk` → dep not declared in `package.json`; fix install/alias before chasing TS errors.
- Styling mismatch (Tailwind sorting / shadcn add) → config references `src/index.css` but app imports `src/app/styles/index.css` (`.prettierrc`, `components.json`, `src/main.tsx`).
