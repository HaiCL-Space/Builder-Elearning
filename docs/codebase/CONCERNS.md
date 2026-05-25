# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|----------|---------|----------|--------|------------------|
| **High** | **Zero Automated Testing Coverage** | No testing package dependencies or scripts inside `package.json` | Unchecked regression bugs when modifying complex state handlers or coordinate dragging mathematics. | User has noted that testing is not a project requirement, so this will remain zero-coverage. |
| **Medium** | **Cross-Slice Layer Circular Coupling (FSD Violation)** | `ViewerPage` (in pages layer) imports `CanvasElement` directly from `src/pages/builder/ui/canvas/CanvasElement` | Violates FSD architectural boundaries; makes page layer components tightly coupled to independent slice internals. | Extract non-editing presentation logic of `CanvasElement` into a shared component inside `entities/element` or `shared/ui`. |
| **Medium** | **Duplicated Action Dispatching Logic** | Redundant implementations of `ElementAction` handlers in `useActionRunner.ts` and `viewer-page.tsx` | Highly fragile system; adding or modifying a course interaction type requires editing multiple different files. | Consolidate action execution logic into a unified custom hook (e.g. `useElementActionRunner`) in `entities/element` or `shared/lib`. |
| **Low** | **Synchronous Deep-Cloning Block** | Synchronous `JSON.parse(JSON.stringify(MOCK_SLIDES))` inside Zustand store initialization. | High memory footprint and blocking operation on the main UI thread during boot, causing frame drops on large decks. | Offload seed bootstrap to an asynchronous action or replace with a non-mutative structure using shallow object copies. |

### 2) Technical Debt

List the most important debt items only.

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|-----------|---------------|-------|-----------------|---------------|
| **Resolved: Dead SlidePreview Component** | Purged in recent cleanup session | `src/entities/slide` | *No longer a risk* (deleted to clear 435 lines of duplicate/dead code). | Cleanup complete. Export references removed. |
| **Resolved: Tailwind Stylesheet Path Mismatch** | realigned configs in recent cleanup session | `components.json`, `.prettierrc` | *No longer a risk* (successfully pointed to `src/app/styles/index.css`). | Path references aligned. Prettier Tailwind sorting fully operational. |
| **Resolved: Unused Duplicated `uid()` Helper** | Purged in recent cleanup session | `src/shared/lib/builder-utils.ts` | *No longer a risk* (consolidated to `src/shared/lib/utils.ts`). | Removed dead function definition. |

### 3) Security Concerns

| Risk | OWASP category (if applicable) | Evidence | Current mitigation | Gap |
|------|--------------------------------|----------|--------------------|-----|
| **Client-Side Game Validation Bypass** | Client-Side Security Controls | gameEngine is called directly inside browser runners. | Low risk because application currently operates as a presentation demo. | Players can modify javascript state in browser dev tools to bypass spaced repetition and answer checks. |
| **Sensitive Data Exposure** | N/A | None. | No user PII or auth credentials handled in frontend. | None (runs fully in local environment). |

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---------|----------|-----------------|-------------|-----------------------|
| **Monolithic Mock Data File** | `mock-slides.ts` is 34.9KB and over 900 lines of hardcoded code. | Large file size; difficult for developers to review or modify. | Adding slides or rich media files will cause file to grow excessively, slowing down IDE compile times. | Partition deck sections into separate static JSON documents and fetch them dynamically. |
| **Dynamic Re-renders on Store Subscriptions** | Zustand store holds both state and layout coordinate setters. | Changing coordinate positions during element dragging triggers global re-renders. | Dragging items on complex slides with dozens of elements will cause interface stutter and lagging drag overlays. | Use target selectors (`useBuilderStore(state => state.draggingId)`) to scope subscription scopes. |

### 5) Fragile/High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|------|-------------|-------------|----------------------|
| `src/pages/builder/ui/canvas/CanvasElement.tsx` | Controls canvas coordinates, boundary resize handles, hotspot maps, and isInteractive conditions. | **10 changes in git history** | Encapsulate helper components (like `ResizeHandles`, `DeleteButton`) into isolated files; introduce strict prop-types. |
| `src/shared/api/mock-slides.ts` | Stores the entire educational slide seed configuration for Vietnam Real Estate Law. | **9 changes in git history** | Keep seed data structured as a static JSON array; perform typechecks on schemas against `broker-core-sdk`. |
| `src/entities/element/ui/element-preview.tsx` | Serves as the central dispatcher routing components to specific interactive widgets. | **8 changes in git history** | Maintain strict switch-case maps; ensure all child elements implement unified Props interface. |

### 6) `[ASK USER]` Questions

1. [ASK USER] Should we extract `CanvasElement` layout and view logic from the `pages/builder` slice into the shared `entities/element` layer to fully resolve the circular FSD layer coupling risk?
2. [ASK USER] Would you like us to extract a unified `useElementActionRunner` hook to consolidate duplicated action dispatchers in `useActionRunner.ts` and `viewer-page.tsx`?

### 7) Evidence

- Clean type-checking of `npm run typecheck`.
- Zero active references or definitions for `SlidePreviewApp` or duplicate `uid()`.
- Successful verification of config paths inside Prettier environment.
