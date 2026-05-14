# Project Documentation Rules (Non-Obvious Only)

- Docs folder `docs/codebase/` exists but may contain TODOs/assumptions; treat as generated notes, verify against source before citing (`docs/codebase/*.md`).
- “Builder” feature is centered under `src/pages/builder/` w/ Zustand store + action runner; use those as primary references in explanations.
- Mention CSS path gotcha explicitly: tooling configs point to `src/index.css`, runtime uses `src/app/styles/index.css` (`.prettierrc`, `components.json`, `src/main.tsx`).
- Testing: no framework/scripts present → any QA/testing doc must state “[TODO] add test runner” (`package.json`).
