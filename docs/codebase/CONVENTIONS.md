# Coding Conventions

## Core Sections (Required)

### 1) Naming Rules

| Item | Rule | Example | Evidence |
|------|------|---------|----------|
| React Components | **PascalCase** | `CanvasElement.tsx`, `CustomAlertDialog.tsx` | `src/pages/builder/ui/canvas/` |
| Directories / Slices | **kebab-case** | `theme-provider`, `builder-utils` | `src/app/providers/`, `src/shared/lib/` |
| Functions and Hooks | **camelCase** | `useActionRunner()`, `handleAction()` | `src/pages/builder/lib/use-action-runner.ts` |
| Types and Interfaces | **PascalCase** | `BuilderElement`, `BuilderState` | `src/pages/builder/model/types.ts` |
| Constants / Configs | **UPPER_SNAKE_CASE** | `MOCK_SLIDES`, `THEME_BACKGROUNDS` | `src/shared/api/mock-slides.ts` |

### 2) Formatting and Linting

- **Formatter**: Prettier. Configured via [.prettierrc](file:///d:/Dev/Work/previewer/.prettierrc):
  - No semicolons (`semi: false`).
  - Standard double quotes (`singleQuote: false`).
  - Tab spacing of 2 spaces (`tabWidth: 2`).
  - Strict line wrapping at 80 characters (`printWidth: 80`).
  - Integrated `prettier-plugin-tailwindcss` for class sorting.
  - Aligned style target point: `"tailwindStylesheet": "src/app/styles/index.css"`.
- **Linter**: ESLint. Configured via [eslint.config.js](file:///d:/Dev/Work/previewer/eslint.config.js):
  - Extends recommended flat configs for JS (`js.configs.recommended`), TS (`tseslint.configs.recommended`), and React (`reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`).
- **Most relevant enforced rules**: Enforces React Hook declaration order, forbids explicit `any` casting, and requires strict type assertions.
- **Run commands**:
  - `npm run format` (formats codebase files with Prettier)
  - `npm run lint` (runs ESLint validation and scans for type errors)
  - `npm run typecheck` (runs typescript compiler type-audits)

### 3) Import and Module Conventions

- **Import grouping/order**: Standard ES imports. CSS stylesheets and React core libraries are imported at the top, followed by absolute `@/` alias paths, then relative layout files.
- **Alias vs relative import policy**: Path alias `@/` mapping to `src/` is strictly enforced for cross-layer imports (e.g. `@/shared/ui/button`). Deep relative imports across layers (such as `../../shared/ui`) are prohibited.
- **Public exports/barrel policy**: FSD public API boundaries are created using barrel files (`index.ts`) at slice and segment entry points. Slices must import from these public barrels instead of target file internals.

### 4) Error and Logging Conventions

- **Error strategy by layer**:
  - **Interaction Layer**: High-risk browser actions (such as HTML5 media playing `audio.play()`) are wrapped in `.catch()` promises to log issues silently to the developer console and prevent UI crashes.
  - **Form/Quiz Validation**: Missing answers or incomplete interaction inputs trigger a non-blocking UI alert modal (`setAlert` in the builder store or `setActiveAlert` in the viewer page) rather than throwing runtime errors.
- **Logging style**: System flow actions (such as navigating slides, validating games, or clicking hotspots) write clear traces to the developer console `console.log()` for clean local debugging. No external cloud logging platform is integrated.
- **Sensitive-data redaction rules**: There is no client sensitive data (e.g. user credentials or PII) handled in the current application. All slide state is statically seeded and in-memory.

### 5) Testing Conventions

- **Test file naming/location rule**: None. The project currently has no automated tests configured.
- **Mocking strategy norm**: N/A.
- **Coverage expectation**: N/A.

### 6) Evidence

- [eslint.config.js](file:///d:/Dev/Work/previewer/eslint.config.js)
- [.prettierrc](file:///d:/Dev/Work/previewer/.prettierrc)
- [tsconfig.app.json](file:///d:/Dev/Work/previewer/tsconfig.app.json) (Strict types config)
- [src/pages/builder/lib/use-action-runner.ts](file:///d:/Dev/Work/previewer/src/pages/builder/lib/use-action-runner.ts) (Audio try/catch pattern)
- [src/entities/element/index.ts](file:///d:/Dev/Work/previewer/src/entities/element/index.ts) (Barrel export convention)
