# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|----------|---------|----------|--------|------------------|
| High | Missing Test Suite | `package.json` lacks test scripts | Reduced confidence during refactoring | Introduce Vitest/Jest and Testing Library |
| Medium | Undeclared dependency | `AGENTS.md` | Build failure or missing types | Add `@broker/core-sdk` to `package.json` |

### 2) Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|-----------|---------------|-------|-----------------|---------------|
| Tailwind config mismatch | Config points to `src/index.css` but app uses `src/app/styles/index.css` | `components.json`, `.prettierrc` | Formatting or CLI tooling errors | Align path in configs |
| Duplicated `uid()` | Helper exists in two places with different formats | `src/shared/lib/utils.ts` and `src/shared/lib/builder-utils.ts` | Inconsistent ID formats | Consolidate to one helper |

### 3) Security Concerns

| Risk | OWASP category (if applicable) | Evidence | Current mitigation | Gap |
|------|--------------------------------|----------|--------------------|-----|
| [ASK USER] Are there any specific security concerns for the builder? | [TODO] | [TODO] | [TODO] | [TODO] |

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---------|----------|-----------------|-------------|-----------------------|
| Deep-cloning mock data | `JSON.parse(JSON.stringify(MOCK_SLIDES))` in `useBuilderStore` | Memory usage | Slow initialization for large slides | Optimize cloning or fetch asynchronously |

### 5) Fragile/High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|------|-------------|-------------|----------------------|
| `src/pages/builder` | Core of app builder logic and hooks | Scan output (3+ changes) | Refactor with tests |
| `src/App.tsx` | Main entry wiring | Scan output (4 changes) | [ASK USER] |

### 6) `[ASK USER]` Questions

1. [ASK USER] Should we integrate Vitest for unit testing?
2. [ASK USER] Is there a backend API we are integrating with that requires documentation in `INTEGRATIONS.md`?

### 7) Evidence

- `package.json` missing test commands.
