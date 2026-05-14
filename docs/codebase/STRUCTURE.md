# Codebase Structure

## Core Sections (Required)

### 1) Top-Level Map

| Path | Purpose | Evidence |
|------|---------|----------|
| `src/` | Primary source code | `tsconfig.app.json` |
| `public/` | Static assets | `list_dir` on root |
| `docs/` | Codebase documentation | `list_dir` on root |
| `src/app/` | Application root, providers, styles | `list_dir` on src |
| `src/entities/` | Business entities (slide, element) | `list_dir` on src |
| `src/pages/` | Routed pages (builder) | `list_dir` on src |
| `src/shared/` | Shared UI, lib, and API | `list_dir` on src |

### 2) Entry Points

- Main runtime entry: `src/main.tsx`
- Secondary entry points (worker/cli/jobs): [NONE]
- How entry is selected (script/config): Referenced via `index.html`

### 3) Module Boundaries

| Boundary | What belongs here | What must not be here |
|----------|-------------------|------------------------|
| `app` | Global providers, global styles, root component | Business logic, page specific components |
| `pages` | Page-level composition and routing | Low-level reusable components |
| `entities` | Domain-specific types and basic UI for domain items | Complex features crossing multiple domains |
| `shared` | Agnostic UI components (shadcn), generic utilities | Domain specific logic |

### 4) Naming and Organization Rules

- File naming pattern: PascalCase for components (`App.tsx`), camelCase or kebab-case for utilities.
- Directory organization pattern: Feature-Sliced Design (FSD) architecture.
- Import aliasing or path conventions: `@/` aliases to `src/` directory.

### 5) Evidence

- `vite.config.ts` (path alias)
- `package.json`
- `index.html`
