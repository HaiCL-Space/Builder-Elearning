# Architecture

## Core Sections (Required)

### 1) Architectural Style

- Primary style: Feature-Sliced Design (FSD)
- Why this classification: The `src` directory is divided into `app`, `pages`, `entities`, and `shared` which strictly matches FSD layers.
- Primary constraints: Unidirectional dependency (e.g. `shared` cannot import from `entities`).

### 2) System Flow

```text
[index.html] -> [src/main.tsx] -> [src/app/App.tsx] -> [src/pages/builder] -> [src/entities & src/shared]
```

Initialization starts in Vite's `index.html` loading `main.tsx`, which mounts the React tree. The router or main app loads page components which aggregate business entities.

### 3) Layer/Module Responsibilities

| Layer or module | Owns | Must not own | Evidence |
|-----------------|------|--------------|----------|
| `app` | Global initialization, providers, styles | Feature logic | `src/app` |
| `pages` | Route definitions, page composition | Reusable UI primitives | `src/pages` |
| `entities` | Domain models, types, schemas (slide, element) | Multi-domain features | `src/entities` |
| `shared` | Design system, hooks, generic libs | Domain models | `src/shared` |

### 4) Reused Patterns

| Pattern | Where found | Why it exists |
|---------|-------------|---------------|
| Global State Management | Zustand store | Used across components to share data without prop-drilling |
| UI Component primitives | `src/shared/ui` | Shadcn UI library pattern for accessibility and styling consistency |

### 5) Known Architectural Risks

- Cross-imports violating FSD principles (especially between entities/shared).
- Global state size if builder complexity grows heavily.
- `useActionRunner.ts` logic might tightly couple builder UI and interaction execution.

### 6) Evidence

- `src/main.tsx`
- `src/app`, `src/pages`, `src/entities`, `src/shared` folder structures.
