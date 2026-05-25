# External Integrations

## Core Sections (Required)

### 1) Integration Inventory

| System | Type (API/DB/Queue/etc) | Purpose | Auth model | Criticality | Evidence |
|--------|---------------------------|---------|------------|-------------|----------|
| `broker-core-sdk` | **Local NPM Dependency** | Provides unified TypeScript schemas and core validation/spaced-repetition learning engines. | None (runs fully locally in the browser). | **High** | `package.json`, `src/pages/builder/lib/use-action-runner.ts` |
| `Zustand` | **In-memory Client Store** | Manages current slide deck modifications, canvas item layout coordinates, slide order arrays, and user interaction alerts. | None (runs in-memory client-side). | **High** | `package.json`, `src/pages/builder/model/use-builder-store.ts` |

### 2) Data Stores

| Store | Role | Access layer | Key risk | Evidence |
|-------|------|--------------|----------|----------|
| Zustand State Store | Holds the current active course deck structure during page builder editing sessions. | `src/pages/builder/model/use-builder-store.ts` | Heavy state size could degrade performance; page refresh wipes unsaved modifications. | `package.json` |
| Browser HTML5 Audio | System audio playback for interactive game success/failure indicators. | `src/pages/builder/lib/use-action-runner.ts` | Browser autoplay blocking policies may reject media plays before user clicks. | `use-action-runner.ts:L50` |

### 3) Secrets and Credentials Handling

- **Credential sources**: None. The application is completely local and does not invoke any remote backend databases, third-party APIs, or subscription networks. Thus, no secrets managers or `.env` files are used.
- **Hardcoding checks**: A codebase search reveals zero hardcoded secrets, API endpoints, or user credentials.
- **Rotation or lifecycle notes**: N/A.

### 4) Reliability and Failure Behavior

- **Retry/backoff behavior**: None. Since there are no network connections or HTTP requests, remote network failure modes, connection drops, and backoff rates do not apply.
- **Timeout policy**: N/A.
- **Circuit-breaker or fallback behavior**:
  - HTML5 video components display appropriate standard play controls and fallback loaders.
  - HTML5 audio API play requests catch errors (e.g. if the browser blocks play requests due to user interaction restrictions) to ensure the UI remains fully functional without crashing.

### 5) Observability for Integrations

- **Logging around external calls**: Slide transitions, answers validations, and media play events log trace messages directly to the standard developer browser `console.log()` to simplify debugging.
- **Metrics/tracing coverage**: No external performance tracking, error telemetry, or metric platforms (e.g. Sentry, Datadog) are configured.
- **Missing visibility gaps**: Standard browser debugger serves as the primary tool.

### 6) Evidence

- [package.json](file:///d:/Dev/Work/previewer/package.json)
- [src/pages/builder/lib/use-action-runner.ts](file:///d:/Dev/Work/previewer/src/pages/builder/lib/use-action-runner.ts) (local SDK integration)
- [src/pages/viewer/ui/viewer-page.tsx](file:///d:/Dev/Work/previewer/src/pages/viewer/ui/viewer-page.tsx) (local gameEngine integration)
