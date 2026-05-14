# Coding Conventions

## Core Sections (Required)

### 1) Naming Rules

| Item | Rule | Example | Evidence |
|------|------|---------|----------|
| Files (Components) | PascalCase | `App.tsx`, `main.tsx` (exception for entry) | `src/App.tsx` |
| Functions/methods | [TODO] | [TODO] | [TODO] |
| Types/interfaces | [TODO] | [TODO] | [TODO] |
| Constants/env vars | [TODO] | [TODO] | [TODO] |

### 2) Formatting and Linting

- Formatter: Prettier (`.prettierrc`)
- Linter: ESLint (`eslint.config.js`)
- Most relevant enforced rules: React hooks rules, TypeScript strict rules.
- Run commands: `npm run lint`, `npm run format`

### 3) Import and Module Conventions

- Import grouping/order: [TODO]
- Alias vs relative import policy: `@/` is used for absolute paths from `src`.
- Public exports/barrel policy: FSD encourages barrel files (index.ts) at layer boundaries, but exact local usage [TODO].

### 4) Error and Logging Conventions

- Error strategy by layer: [TODO]
- Logging style and required context fields: [TODO]
- Sensitive-data redaction rules: [TODO]

### 5) Testing Conventions

- Test file naming/location rule: [TODO]
- Mocking strategy norm: [TODO]
- Coverage expectation: [TODO]

### 6) Evidence

- `eslint.config.js`
- `.prettierrc`
- `vite.config.ts` (alias)
