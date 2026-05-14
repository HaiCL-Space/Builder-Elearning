# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|----------|---------|----------|--------|------------------|
| High | Missing Test Suite | `package.json` lacks test scripts | Reduced confidence during refactoring | Introduce Vitest/Jest and Testing Library |

### 2) Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|-----------|---------------|-------|-----------------|---------------|
| Unknown logic inside entities | Just generated skeleton without deep look | `src/entities/element` | Unknown | [TODO] |

### 3) Security Concerns

| Risk | OWASP category (if applicable) | Evidence | Current mitigation | Gap |
|------|--------------------------------|----------|--------------------|-----|
| [TODO] | [TODO] | [TODO] | [TODO] | [TODO] |

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---------|----------|-----------------|-------------|-----------------------|
| [TODO] | [TODO] | [TODO] | [TODO] | [TODO] |

### 5) Fragile/High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|------|-------------|-------------|----------------------|
| `src/pages/builder` | Usually core of app | [TODO] | [TODO] |

### 6) `[ASK USER]` Questions

1. [ASK USER] Should we integrate Vitest for unit testing?
2. [ASK USER] Is there a backend API we are integrating with that requires documentation in `INTEGRATIONS.md`?

### 7) Evidence

- `package.json` missing test commands.
