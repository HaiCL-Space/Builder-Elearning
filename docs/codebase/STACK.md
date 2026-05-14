# Technology Stack

## Core Sections (Required)

### 1) Runtime Summary

| Area | Value | Evidence |
|------|-------|----------|
| Primary language | TypeScript | `package.json` |
| Runtime + version | Node.js (via `@types/node` v24.x) | `package.json` |
| Package manager | npm | `package-lock.json` |
| Module/build system | Vite + TypeScript compiler | `package.json` |

### 2) Production Frameworks and Dependencies

| Dependency | Version | Role in system | Evidence |
|------------|---------|----------------|----------|
| React | ^19.2.4 | UI Library | `package.json` |
| Tailwind CSS | ^4.2.1 | CSS Framework | `package.json` |
| Zustand | ^5.0.13 | Global State Management | `package.json` |
| Shadcn UI | ^4.7.0 | Reusable Component CLI | `package.json` |
| Radix UI | ^1.4.3 | Headless UI Primitives | `package.json` |

### 3) Development Toolchain

| Tool | Purpose | Evidence |
|------|---------|----------|
| ESLint | LINT | `package.json` |
| Prettier | FORMAT | `package.json` |
| TypeScript | BUILD/TYPECHECK | `package.json` |

### 4) Key Commands

```bash
npm install
npm run build
npm run typecheck
npm run lint
npm run format
```

### 5) Environment and Config

- Config sources: `vite.config.ts`, `tsconfig.app.json`, `eslint.config.js`
- Required env vars: [TODO]
- Deployment/runtime constraints: Browser-based SPA.

### 6) Evidence

- `package.json`
- `vite.config.ts`
