# Coding Conventions

## Core Sections (Required)

### 1) Naming Rules

| Item | Rule | Example | Evidence |
|------|------|---------|----------|
| Files (Components) | kebab-case or PascalCase | `App.tsx`, `main.tsx` (FSD typically uses kebab-case for directories) | `src/App.tsx` |
| Functions/methods | camelCase | `handleAction()` | `src/pages/builder/lib/use-action-runner.ts` |
| Types/interfaces | PascalCase | `Slide` | `@broker/core-sdk` imports |
| Constants/env vars | UPPER_SNAKE_CASE | `MOCK_SLIDES` | `src/pages/builder/model/use-builder-store.ts` |

### 2) Formatting and Linting

- Formatter: Prettier (`.prettierrc`)
- Linter: ESLint (`eslint.config.js`)
- Most relevant enforced rules: React hooks rules, TypeScript strict rules.
- Run commands: `npm run lint`, `npm run format`

### 3) Import and Module Conventions

- Import grouping/order: [ASK USER]
- Alias vs relative import policy: `@/` is used for absolute paths from `src` (configured in `vite.config.ts` and `tsconfig.json`).
- Public exports/barrel policy: FSD encourages barrel files (`index.ts`) at layer boundaries.

### 4) Error and Logging Conventions

- Error strategy by layer: [ASK USER]
- Logging style and required context fields: [ASK USER]
- Sensitive-data redaction rules: [ASK USER]

### 5) Testing Conventions

- Test file naming/location rule: [ASK USER] No testing configured yet.
- Mocking strategy norm: [ASK USER]
- Coverage expectation: [ASK USER]

### 6) Evidence

- `eslint.config.js`
- `.prettierrc`
- `vite.config.ts` (alias)
