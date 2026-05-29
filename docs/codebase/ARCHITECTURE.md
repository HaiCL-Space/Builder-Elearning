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
[src/main.tsx] ──► [src/app/providers/query-provider.tsx] (React Query provider)
     │         ──► [src/app/providers/theme-provider.tsx] (Global theme context)
     ▼
[src/App.tsx] (Custom router with session restore & auth guards)
     ├───► "/viewer" ──► [src/pages/viewer/ui/viewer-page.tsx] (Slide player mode)
     ├───► "/login"  ──► [src/pages/login/ui/login-page.tsx] (Auth portal)
     └───► "/edit"   ──► [src/pages/builder/ui/builder-page.tsx] (Editor mode)
                             │
                             ▼ (loads via React Query)
                         [src/entities/slide/model/queries.ts] (useSlidesQuery)
                             │   ├──► Online: REST API (VITE_API_URL)
                             │   └──► Offline: MOCK_SLIDES Fallback
                             ▼ (state cloned for editing)
                         [src/pages/builder/model/use-builder-store.ts] (Zustand)
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

1. **Entry Mounting**: Vite loads `index.html` which executes `src/main.tsx`. This mounts the React VDOM inside `<QueryProvider>` and `<ThemeProvider>` contexts, booting the `<App />` component.
2. **Session Restoration & Auth Guarding**: On app initialization, `App.tsx` checks if a refresh token exists in cookies. If present, it executes a silent token refresh (`auth.refresh()`) to restore the user session in `useAuthStore`.
3. **Path Routing**: `App.tsx` evaluates route guards based on path and auth status:
   - `/edit` requires authentication. Unauthenticated users are redirected to `/login`.
   - `/login` is guarded; authenticated users are redirected to `/edit`.
   - `/viewer` is accessible standalone for course playing.
4. **Data Syncing via TanStack Query**: Entities (`course`, `lesson`, `slide`) are fetched using query hooks (`useCoursesQuery`, `useLessonsQuery`, `useSlidesQuery`). If the remote API server (`VITE_API_URL` inside `.env`) is online, it retrieves real records; otherwise, it handles network failure by printing a warning and falling back gracefully to static mock data (`MOCK_COURSES`, `MOCK_LESSONS`, `MOCK_SLIDES`).
5. **State Bootstrapping & Canvas Sync**:
   - In `<BuilderPage />`, slides are fetched via `useSlidesQuery`. The slides are deep-cloned into Zustand (`useBuilderStore`) to enable drag-and-drop coordinate changes without mutating the query client cache.
   - Saving slides triggers `useSaveSlidesMutation`. If the API fails, it simulates latency and saves a secure local backup in the browser's `localStorage` (`previewer_slides_backup_{lessonId}`).
   - In `<ViewerPage />`, slides are rendered from static data or from the query cache.
6. **Canvas Rendering**: Individual elements are mapped via `CanvasElement.tsx` to domain-specific views in `entities/element/ui` (matching, sorting, crossword, swipe, sprint, memory card, hotspot) to build active layouts.
7. **Action Dispatching & SDK Evaluation**: Interactions generate `ElementAction` blocks. The action runner evaluates triggers (e.g. `EVALUATE_ANSWER`) using `gameEngine` and `learningEngine` from `broker-core-sdk` to determine success results and spaced repetition intervals, feeding updates into UI alerts to pop open the `<CustomAlertDialog />` feedback modal.

### 3) Layer/Module Responsibilities

| Layer or module | Owns                                                                                                                                                                               | Must not own                                                           | Evidence                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `src/app/`      | Global stylesheet bootstrap (`index.css`), React VDOM initial mounts, app-wide context providers (`theme-provider.tsx`, `query-provider.tsx`).                                     | Page layouts, business rules, API requests, state managers.            | `src/app/providers/theme-provider.tsx`, `src/app/providers/query-provider.tsx` |
| `src/pages/`    | Page layout orchestration, drag-and-drop/resize canvas handlers, sidebars editing controls, route switching.                                                                       | Primitive UI assets, specific slide element game logic.                | `src/pages/builder/ui/builder-page.tsx`, `src/pages/viewer/ui/viewer-page.tsx` |
| `src/entities/` | Domain-specific slices (`course`, `lesson`, `slide`, `element`) carrying domain React Query hooks (`queries.ts`) or display elements (`quiz-element.tsx`).                         | Canvas grid guides, sidebar slide reordering state, main page layouts. | `src/entities/element/index.ts`                                                |
| `src/shared/`   | Base UI primitives (`button.tsx`, `card.tsx`), mock datasets (`mock-slides.ts`), low-level helpers (`utils.ts`), central auth (`shared/auth/`), REST client (`shared/api/api.ts`). | Core builder page editing styles, slide element game views.            | `src/shared/ui/button.tsx`, `src/shared/lib/utils.ts`                          |

### 4) Reused Patterns

| Pattern                       | Where found                                                                         | Why it exists                                                                                                                                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Zustand Central Store**     | `src/pages/builder/model/use-builder-store.ts`                                      | Serves as the single source of truth for the course editor, syncing sidebar inputs, canvas positions, slide CRUD, and active UI states.                                                                |
| **Command Pattern (Actions)** | `src/pages/builder/lib/use-action-runner.ts`, `src/pages/viewer/ui/viewer-page.tsx` | Represents user interactions (slide jumps, media plays, answer evaluations, visibility toggling) as serializable `ElementAction` objects that can be executed uniformly regardless of the active page. |
| **Provider/Context Pattern**  | `src/app/providers/theme-provider.tsx`                                              | Distributes global styling themes (light, dark, sunset, ocean) down the React hierarchy so that deep nested child elements react instantly to configuration changes.                                   |

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
