# Testing Patterns

## Core Sections (Required)

### 1) Test Stack and Commands

- **Primary test framework**: None configured. The project currently lacks an automated test framework.
- **Assertion/mocking tools**: None.
- **Commands**: None. No testing command scripts are defined in [package.json](file:///d:/Dev/Work/previewer/package.json).

```bash
# No testing suite configured in this workspace.
```

### 2) Test Layout

- **Test file placement pattern**: N/A. No test files exist in the project.
- **Naming convention**: N/A.
- **Setup files and where they run**: N/A.

### 3) Test Scope Matrix

| Scope | Covered? | Typical target | Notes |
|-------|----------|----------------|-------|
| Unit | **No** | Local utility helpers (`src/shared/lib/utils.ts`) | Testing is recommended for core mathematical helpers. |
| Integration | **No** | Interaction action flows (`useActionRunner.ts`, Zustand state store) | Verifying state mutations and spaced-repetition mathematics is recommended. |
| E2E | **No** | High-level course editing and player slideshow flows | Recommended for verifying dragging boundaries and game interactions. |

### 4) Mocking and Isolation Strategy

- **Main mocking approach**: N/A. No testing is configured.
- **Isolation guarantees**: N/A.
- **Common failure mode in tests**: N/A.

### 5) Coverage and Quality Signals

- **Coverage tool + threshold**: None configured.
- **Current reported coverage**: **0%** (entire codebase is untested).
- **Known gaps/flaky areas**: Complete coverage gap. The user has explicitly stated that automated testing is not required for this project.

### 6) Evidence

- [package.json](file:///d:/Dev/Work/previewer/package.json) (absence of `test` commands or testing dependency packages).
