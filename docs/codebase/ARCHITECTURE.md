# Architecture

## Core Sections (Required)

### 1) Architectural Style

- **Primary style**: Feature-Sliced Design (FSD) v2.1.
- **Why this classification**: The `src/` codebase is partitioned into formal architectural layers (`app`, `pages`, `entities`, `shared`). Layers strictly follow a hierarchical dependency structure: upper layers can import from lower layers, but lower layers can never import from upper layers (unidirectional dependency).
- **Primary constraints**:
  1. **Unidirectional Import Rule**: Lower layers (like `shared`) must be completely agnostic of domain concepts in upper layers (like `entities` or `pages`).
  2. **Strict Public API boundary**: Folder components in slices (e.g. `src/pages/builder`) export their public interface via a root `index.ts` barrel file. Cross-slice imports must target this barrel file directly instead of deep-importing internal files.
  3. **Decoupled Engines**: Runtime game validation and spaced repetition calculations are offloaded to an external SDK (`broker-core-sdk`), keeping UI presentation separate from mathematical learning logic.

### 2) System Flow

```text
[index.html]
     │ (Vite Entry Module)
     ▼
[src/main.tsx] ──► [src/app/providers/theme-provider.tsx] (Global theme context)
     │
     ▼
[src/App.tsx] (Custom router checking window.location.pathname)
     ├───► "/viewer" ──► [src/pages/viewer/ui/viewer-page.tsx] (Player mode)
     └───► default   ──► [src/pages/builder/ui/builder-page.tsx] (Editor mode)
                             │
                             ▼ (central state control)
                        [src/pages/builder/model/use-builder-store.ts]
                             │
                             ▼ (interactive canvas element wrapper)
                        [src/pages/builder/ui/canvas/CanvasElement.tsx]
                             │
                             ▼ (specific widgets from entities layer)
                        [src/entities/element/ui/*-element.tsx]
                             │
                             ▼ (evaluates interactions using core SDK)
                        [broker-core-sdk (learningEngine/gameEngine)]
```

#### Detailed Flow Steps:
1. **Entry Mounting**: Vite loads `index.html` which executes `src/main.tsx`. This mounts the React VDOM inside a `ThemeProvider` context and boots the `<App />` component.
2. **Path Routing**: `App.tsx` reads `window.location.pathname`. If it begins with `/viewer`, the standalone `<ViewerPage />` player mounts. Otherwise, it defaults to mounting the `<BuilderPage />` editor.
3. **State Bootstrapping**:
   - The `<BuilderPage />` initializes the global Zustand store `useBuilderStore.ts` which clones the Vietnam Real Estate Law deck `MOCK_SLIDES` (located at `src/shared/api/mock-slides.ts`) using deep-cloning to allow users to modify elements locally.
   - The `<ViewerPage />` reads from `MOCK_SLIDES` directly and maintains local state for slide pagination, visibility, and user quiz responses.
4. **Canvas Rendering**: Page components render the canvas layout. Individual elements on slides are mapped via `CanvasElement.tsx` or `ElementRenderer` to domain-specific views in `src/entities/element/ui/` (e.g., `quiz-element.tsx`, `matching-element.tsx`, `hotspot-element.tsx`) to draw the actual interactive game boards.
5. **Action Dispatching & SDK Evaluation**: When a user clicks a button, answers a quiz, or clicks a hotspot, the click is transformed into an `ElementAction` object (defined in `broker-core-sdk`).
   - The action runner (`useActionRunner.ts` in the builder, or the local `executeAction` in the viewer) parses the action payload.
   - If the action is `EVALUATE_ANSWER`, it calls `gameEngine.validateGameResult()` from the SDK to verify the answer.
   - It then invokes `learningEngine.calculateNextReview()` and `learningEngine.checkMastery()` to retrieve the spaced-repetition metrics (next review date, card mastery state) and updates the local state to pop open the `<CustomAlertDialog />` feedback modal.

### 3) Layer/Module Responsibilities

| Layer or module | Owns | Must not own | Evidence |
|-----------------|------|--------------|----------|
| `src/app/` | Global stylesheet bootstrap (`index.css`), React VDOM initial mounts, app-wide context providers (`theme-provider.tsx`). | Page layouts, business rules, API requests, state managers. | `src/app/providers/theme-provider.tsx` |
| `src/pages/` | Page layout orchestration, drag-and-drop/resize canvas handlers, sidebars editing controls, route switching. | Primitive UI assets, specific slide element game logic. | `src/pages/builder/ui/builder-page.tsx`, `src/pages/viewer/ui/viewer-page.tsx` |
| `src/entities/` | Domain-specific components (`quiz-element.tsx`, `fill-blank-element.tsx`) that display a specific course item. | Canvas grid guides, sidebar slide reordering state, main page layouts. | `src/entities/element/index.ts` |
| `src/shared/` | Base UI primitives (`button.tsx`, `card.tsx`), mock dataset seed files (`mock-slides.ts`), structural helpers (`utils.ts`). | Core builder page editing styles, slide element game views. | `src/shared/ui/button.tsx`, `src/shared/lib/utils.ts` |

### 4) Reused Patterns

| Pattern | Where found | Why it exists |
|---------|-------------|---------------|
| **Zustand Central Store** | `src/pages/builder/model/use-builder-store.ts` | Serves as the single source of truth for the course editor, syncing sidebar inputs, canvas positions, slide CRUD, and active UI states. |
| **Command Pattern (Actions)** | `src/pages/builder/lib/use-action-runner.ts`, `src/pages/viewer/ui/viewer-page.tsx` | Represents user interactions (slide jumps, media plays, answer evaluations, visibility toggling) as serializable `ElementAction` objects that can be executed uniformly regardless of the active page. |
| **Provider/Context Pattern** | `src/app/providers/theme-provider.tsx` | Distributes global styling themes (light, dark, sunset, ocean) down the React hierarchy so that deep nested child elements react instantly to configuration changes. |

### 5) Known Architectural Risks

1. **Duplicate Action Dispatching Logic**: The same interaction logic (`executeAction` inside `viewer-page.tsx` and `SlidePreviewApp` inside `slide-preview.tsx`, alongside `useActionRunner.ts` inside `builder/lib`) is written multiple times. This introduces a synchronization risk where adding a new action type requires manual updates across three separate files.
2. **State Mutability Risk via JSON cloning**: The Zustand store performs a heavy synchronous deep-clone using `JSON.parse(JSON.stringify(MOCK_SLIDES))` at boot. For very large slideshow courses, this blocking operation can degrade startup performance and cause frame drops.
3. **Circular / Violation Risk between Pages & Builder**: The `ViewerPage` in the `pages` layer imports `CanvasElement` directly from `src/pages/builder/ui/canvas/CanvasElement`. In strict FSD architecture, cross-importing between slices of the same layer is discouraged; common elements should reside in the `entities` or `shared` layers to avoid tight coupling.

### 6) Evidence

- [src/App.tsx](file:///d:/Dev/Work/previewer/src/App.tsx) (custom routing module)
- [src/pages/builder/model/use-builder-store.ts](file:///d:/Dev/Work/previewer/src/pages/builder/model/use-builder-store.ts) (Zustand state store)
- [src/pages/builder/lib/use-action-runner.ts](file:///d:/Dev/Work/previewer/src/pages/builder/lib/use-action-runner.ts) (Action command dispatcher)
- [src/pages/viewer/ui/viewer-page.tsx](file:///d:/Dev/Work/previewer/src/pages/viewer/ui/viewer-page.tsx) (Viewer composition and action dispatcher)
- [src/entities/element/ui/element-preview.tsx](file:///d:/Dev/Work/previewer/src/entities/element/ui/element-preview.tsx) (Visual routing for slide elements)
