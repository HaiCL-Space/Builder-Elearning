# Codebase Structure

## Core Sections (Required)

### 1) Top-Level Map

List only meaningful top-level directories and files.

| Path | Purpose | Evidence |
|------|---------|----------|
| `src/` | Main source code directory containing all application layers | Root directory scan |
| `src/app/` | Application root: entry bootstrap, theme and React Query providers, global styles | `src/main.tsx` imports |
| `src/pages/` | Routed pages composing the main application views | `src/App.tsx` imports |
| `src/pages/home/` | Course listing page: displays and filters available courses, manages lessons, and navigates to builder/viewer modes | `src/pages/home/ui/HomePage.tsx` |
| `src/pages/builder/` | Interactive slide builder with visual canvas, slide management, and drag/resize editing | `src/pages/builder/ui/builder-page.tsx` |
| `src/pages/viewer/` | Lightweight slide slideshow player/viewer for courses | `src/pages/viewer/ui/viewer-page.tsx` |
| `src/pages/login/` | Secure authentication portal with customized visual layout | `src/App.tsx` imports |
| `src/entities/` | Domain-specific slices (`course`, `lesson`, `slide` query hooks, and `element` slide widgets) | `src/entities/element/index.ts` |
| `src/shared/` | Cross-cutting shared modules: auth helper slices, API REST client, basic design system UI | `src/shared/ui/button.tsx` |
| `public/` | Standard public assets (Vite logo, static web files) | Root directory scan |
| `docs/` | Comprehensive codebase technical documentation | Root directory scan |

### 2) Entry Points

- **Main runtime entry**: `src/main.tsx` - initializes the React 19 root, mounts the global `<ThemeProvider>`, and renders the core `<App />` component.
- **Secondary entry points (worker/cli/jobs)**: None.
- **How entry is selected (script/config)**: Referenced inside the main root `index.html` via a `<script type="module" src="/src/main.tsx">` injection, compiled by Vite.

### 3) Module Boundaries

| Boundary | What belongs here | What must not be here |
|----------|-------------------|------------------------|
| `app` | Global initialization, providers (`theme-provider.tsx`, `query-provider.tsx`), global CSS layout styles. | Core page components, state management stores, component features. |
| `pages` | High-level page-composing views (`HomePage.tsx`, `builder-page.tsx`, `viewer-page.tsx`, `LoginPage.tsx`) that bundle features and entities together. | Generic UI button styles, low-level domain math helpers. |
| `entities` | Slide element UI widgets (`quiz-element.tsx`, `hotspot-element.tsx`), domain entities (`course`, `lesson`, `slide`) with React Query hooks (`queries.ts`). | High-level canvas drag state, sidebars, or page navigation controls. |
| `shared` | Design system primitives (`button.tsx`, `card.tsx`), mock slide data (`mock-slides.ts`), low-level helpers (`utils.ts`), authentication helpers (`shared/auth`), REST API client (`shared/api/api.ts`). | Domain element layout state, complex page-routing decisions. |

### 4) Naming and Organization Rules

- **File naming pattern**: PascalCase for React component files (e.g. `CanvasElement.tsx`, `CustomAlertDialog.tsx`, `CourseDialog.tsx`), camelCase or kebab-case for utilities, logic files, and hooks (e.g. `use-builder-store.ts`, `builder-utils.ts`).
- **Directory organization pattern**: Follows a strict Feature-Sliced Design (FSD) architecture dividing modules into layers (`app`, `pages`, `entities`, `shared`), slices, and segments.
- **Import aliasing or path conventions**: Absolute path aliases are enforced using `@/` mapping directly to the `src/` directory (e.g. `import { uid } from "@/shared/lib/utils"`). This is defined in `tsconfig.json` and `vite.config.ts`. Direct circular imports or deep relative jumps crossing module layers (e.g., `shared` importing from `pages`) are forbidden by architectural rules.

### 5) Evidence

- [vite.config.ts](file:///d:/Dev/Work/previewer/vite.config.ts) (Alias mapping rule)
- [tsconfig.app.json](file:///d:/Dev/Work/previewer/tsconfig.app.json) (Include boundaries)
- [src/App.tsx](file:///d:/Dev/Work/previewer/src/App.tsx) (Composition of page layers)
- [src/main.tsx](file:///d:/Dev/Work/previewer/src/main.tsx) (Runtime entry mounting)
- [src/pages/home/ui/HomePage.tsx](file:///d:/Dev/Work/previewer/src/pages/home/ui/HomePage.tsx) (Course listing dashboard)

