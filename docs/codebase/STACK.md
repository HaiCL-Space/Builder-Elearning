# Technology Stack

## Core Sections (Required)

### 1) Runtime Summary

| Area | Value | Evidence |
|------|-------|----------|
| Primary language | TypeScript v5.9.3 | `package.json` |
| Runtime + version | Node.js (via `@types/node` v24.12.0) | `package.json` |
| Package manager | npm v10+ (lockfile v3 present) | `package-lock.json` |
| Module/build system | Vite v7.3.1 + TypeScript Compiler (`tsc`) | `package.json` |

### 2) Production Frameworks and Dependencies

List only high-impact production dependencies (frameworks, data, transport, auth).

| Dependency | Version | Role in system | Evidence |
|------------|---------|----------------|----------|
| React | ^19.2.4 | UI library core | `package.json` |
| Tailwind CSS | ^4.2.1 | Utility-first CSS styling framework | `package.json` |
| @tailwindcss/vite | ^4.2.1 | Tailwind CSS compilation and Vite integration | `package.json` |
| Zustand | ^5.0.13 | Client global state management store | `package.json` |
| @tanstack/react-query | ^5.100.14 | Robust server state fetching, caching, and synchronization | `package.json` |
| broker-core-sdk | ^1.0.7 | Interactive educational game & learning engines | `package.json` |
| framer-motion | ^12.38.0 | Fluid canvas drag, resize, and element animations | `package.json` |
| Radix UI | ^1.4.3 | Headless accessible UI primitives | `package.json` |
| Lucide React | ^1.14.0 | Clean vector iconography library | `package.json` |
| Shadcn UI | ^4.7.0 | Registry-based reusable UI component framework | `package.json` |
| tw-animate-css | ^1.4.0 | CSS micro-animations utility | `package.json` |

### 3) Development Toolchain

| Tool | Purpose | Evidence |
|------|---------|----------|
| ESLint v9.39.4 | Source linting and code quality rules | `package.json`, `eslint.config.js` |
| Prettier v3.8.1 | Uniform code style and Tailwind sorting | `package.json`, `.prettierrc` |
| TypeScript v5.9.3 | Strict static typing and project references | `package.json`, `tsconfig.json` |
| Vite v7.3.1 | Hot Module Replacement (HMR) local server & bundler | `package.json`, `vite.config.ts` |

### 4) Key Commands

```bash
# Install dependencies
npm install

# Run local Vite development server
npm run dev

# Run ESLint validation
npm run lint

# Format code with Prettier
npm run format

# Run TypeScript typechecker
npm run typecheck

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### 5) Environment and Config

- **Config sources**: `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `.prettierrc`, `components.json`
- **Required env vars**: `VITE_API_URL` (defines the REST API endpoint, e.g. `http://localhost:8001/v1` for remote backend communication; defaults to local fallback if server is offline). Loaded via `.env` file.
- **Deployment/runtime constraints**: Completely client-side Single Page Application (SPA). Requires a modern browser with Javascript support. Connects to backend REST API endpoints if active, falling back automatically to local mock storage.

### 6) Evidence

- [package.json](file:///d:/Dev/Work/previewer/package.json)
- [package-lock.json](file:///d:/Dev/Work/previewer/package-lock.json)
- [vite.config.ts](file:///d:/Dev/Work/previewer/vite.config.ts)
- [tsconfig.app.json](file:///d:/Dev/Work/previewer/tsconfig.app.json)
- [.env](file:///d:/Dev/Work/previewer/.env)
