# External Integrations

## Core Sections (Required)

### 1) Integration Inventory

| System | Type (API/DB/Queue/etc) | Purpose | Auth model | Criticality | Evidence |
|--------|---------------------------|---------|------------|-------------|----------|
| `@broker/core-sdk` | Types/Runtime | Core domain models | [ASK USER] | High | `AGENTS.md` |

### 2) Data Stores

| Store | Role | Access layer | Key risk | Evidence |
|-------|------|--------------|----------|----------|
| Zustand (Client) | Global UI State | `shared/lib` or `entities` | Memory leak if unbounded | `package.json` |

### 3) Secrets and Credentials Handling

- Credential sources: [ASK USER]
- Hardcoding checks: [ASK USER]
- Rotation or lifecycle notes: [ASK USER]

### 4) Reliability and Failure Behavior

- Retry/backoff behavior: [ASK USER]
- Timeout policy: [ASK USER]
- Circuit-breaker or fallback behavior: [ASK USER]

### 5) Observability for Integrations

- Logging around external calls: [ASK USER]
- Metrics/tracing coverage: [ASK USER]
- Missing visibility gaps: [ASK USER]

### 6) Evidence

- `package.json`
