# Project Architecture Rules (Non-Obvious Only)

- Project follows FSD-ish layout (`src/app`, `src/pages`, `src/entities`, `src/shared`) but enforcement is social-only (no boundary tooling found).
- Builder behavior depends on external `@broker/core-sdk` engines (learning/game) invoked from UI hook (`src/pages/builder/lib/use-action-runner.ts`) → architecture changes may require SDK alignment.
- State single source of truth → `useBuilderStore` holds slides/selection/dragging/resizing; avoid duplicating state in components (`src/pages/builder/model/use-builder-store.ts`).
- Slide seed data is mock-only (`src/shared/api/mock-slides.ts`) → persistence/API integration is absent in repo (document as gap, not assumed).
