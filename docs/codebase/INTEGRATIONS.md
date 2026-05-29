# External Integrations

## Core Sections (Required)

### 1) Integration Inventory

| System | Type (API/DB/Queue/etc) | Purpose | Auth model | Criticality | Evidence |
|--------|---------------------------|---------|------------|-------------|----------|
| REST API Backend | **REST API Connection** | Manages authentication, courses catalog, lessons lists, and slide layouts | Stateless JWT Token (Access token in memory; Refresh token in Cookie) | **High** | `src/shared/api/api.ts`, `.env` |
| `broker-core-sdk` | **Local NPM Dependency** | Provides unified TypeScript schemas and core validation/spaced-repetition learning engines. | None (runs fully locally in the browser). | **High** | `package.json`, `src/pages/builder/lib/use-action-runner.ts` |
| `Zustand` | **In-memory Client Store** | Manages current slide deck modifications, canvas item layout coordinates, slide order arrays, and user interaction alerts. | None (runs in-memory client-side). | **High** | `package.json`, `src/pages/builder/model/use-builder-store.ts`, `src/shared/auth/auth-store.ts` |

### 2) Data Stores

| Store | Role | Access layer | Key risk | Evidence |
|-------|------|--------------|----------|----------|
| Zustand State Store | Holds active slide deck edits (`useBuilderStore`) and user tokens/profile (`useAuthStore`) in memory. | `src/pages/builder/model/use-builder-store.ts`, `src/shared/auth/auth-store.ts` | State size could degrade performance; page refresh wipes unsaved modifications if offline backup fails. | `package.json` |
| Browser Local Storage | Stores local slide backups under key `previewer_slides_backup_${lessonId}` when the REST API fails to save layouts. | `src/entities/slide/model/queries.ts` | Size limits (typically 5MB); potential storage corruption or manual clearing by the user. | `queries.ts:L85` |
| Browser Cookies | Stores the session refresh token (`refreshToken`) for automatic silent REST session restoration on boot. | `src/shared/auth/auth.ts` | Cookie expiration or clearing logs out the user; CSRF risks if SameSite rules are ignored (mitigated by Lax/Strict). | `auth.ts:L30` |
| Browser HTML5 Audio | System audio playback for interactive game success/failure indicators. | `src/pages/builder/lib/use-action-runner.ts` | Browser autoplay blocking policies may reject media plays before user clicks. | `use-action-runner.ts` |

### 3) Secrets and Credentials Handling

- **Credential sources**: Loaded from `.env` via `VITE_API_URL` which configures backend paths (defaults to `http://localhost:8001/v1`).
- **Authorization Flow**: User submits credentials to `/auth/login`. The server returns an access token, refresh token, and user profile. The access token is stored in `useAuthStore` memory and is automatically injected as a `Bearer` token by `api.ts`.
- **Session Lifecycle**: The refresh token is saved in a cookie with explicit maximum age. The client background scheduler (`scheduleTokenRefresh` in `auth.ts`) triggers `/auth/refresh-token` 30 seconds before expiration to renew tokens.
- **Hardcoding checks**: Checked. All endpoint secrets are dynamically mapped via Vite `import.meta.env` properties.

### 4) Reliability and Failure Behavior

- **Retry/backoff behavior**: TanStack Query is configured with `retry: 1` for queries to limit loading blockages while gracefully failing over to mock data.
- **Timeout/Latency Simulation**: Slide saving simulation includes a 600ms latency buffer during offline fallbacks to provide natural spinner feedback.
- **Circuit-breaker or fallback behavior**:
  - **Data Queries Failover**: If `/courses`, `/lessons`, or `/slides` requests fail, the application logs warning alerts and falls back to static seed data (`MOCK_COURSES`, `MOCK_LESSONS`, `MOCK_SLIDES`), keeping the viewer fully functional.
  - **Save Failover**: If saving design layouts to `/lessons/:id/slides` fails, the system catches the error, triggers an offline warning trace, and writes the design state to `localStorage` under `previewer_slides_backup_${lessonId}`, guaranteeing the user's progress is never lost.
  - **Audio Fallbacks**: Audio plays catch browser autoplay block rules to prevent UI crash freezes.

### 5) Observability for Integrations

- **Logging around external calls**: Login flows, silent refreshes, queries, database syncs, and offline local fallbacks are fully traced using detailed `console.log` / `console.warn` console prints.
- **Metrics/telemetry coverage**: No remote telemetry engines are connected. Standard browser developer tools provide developer visibility.

### 6) Evidence

- [package.json](file:///d:/Dev/Work/previewer/package.json)
- [src/pages/builder/lib/use-action-runner.ts](file:///d:/Dev/Work/previewer/src/pages/builder/lib/use-action-runner.ts) (local SDK integration)
- [src/pages/viewer/ui/viewer-page.tsx](file:///d:/Dev/Work/previewer/src/pages/viewer/ui/viewer-page.tsx) (local gameEngine integration)
