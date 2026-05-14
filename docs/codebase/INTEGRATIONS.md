# External Integrations

## Core Sections (Required)

### 1) Integration Inventory

| System | Type (API/DB/Queue/etc) | Purpose | Auth model | Criticality | Evidence |
|--------|---------------------------|---------|------------|-------------|----------|
| [TODO] | [TODO] | [TODO] | [TODO] | [TODO] | [TODO] |

### 2) Data Stores

| Store | Role | Access layer | Key risk | Evidence |
|-------|------|--------------|----------|----------|
| Zustand (Client) | Global UI State | `shared/lib` or `entities` | Memory leak if unbounded | `package.json` |

### 3) Secrets and Credentials Handling

- Credential sources: [TODO]
- Hardcoding checks: [TODO]
- Rotation or lifecycle notes: [TODO]

### 4) Reliability and Failure Behavior

- Retry/backoff behavior: [TODO]
- Timeout policy: [TODO]
- Circuit-breaker or fallback behavior: [TODO]

### 5) Observability for Integrations

- Logging around external calls: [TODO]
- Metrics/tracing coverage: [TODO]
- Missing visibility gaps: [TODO]

### 6) Evidence

- `package.json`
