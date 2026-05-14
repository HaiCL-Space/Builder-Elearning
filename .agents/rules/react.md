---
trigger: always_on
---

1. Architecture & Components: Always use Functional Components and React Hooks. Never use Class Components.

2. Single Responsibility Principle (SRP): Each component must do one thing. If a component exceeds 150 lines, automatically suggest breaking it into smaller sub-components or extracting logic into Custom Hooks.

3. Logic Separation: Decouple business logic from the UI. Move complex state logic, API calls, and data transformations into Custom Hooks.

4. Naming Conventions:

Use PascalCase for component files and names (e.g., UserProfile.tsx).

Use camelCase for variables, props, and functions.

Prefix booleans with is, has, or should (e.g., isLoading, hasAccess).

Prefix event handlers with handle (e.g., handleSubmit) and prop-passed handlers with on (e.g., onSubmit).

5. Prop Management:

Always use destructuring for props in the function signature.

Use default parameters for optional props instead of defaultProps.

Avoid "Prop Drilling" beyond 3 levels; suggest Context API or state management (Zustand/Redux) instead.

6. State Best Practices:

Use functional updates when the new state depends on the old state: setCount(prev => prev + 1).

Keep state as local as possible to prevent unnecessary global re-renders.

7. JSX Cleanliness:

Avoid complex ternary operators or logic inside the return statement. Compute derived values or conditional elements before the return.

Use React Fragments <> </> to avoid unnecessary wrapper <div> tags.

Always provide unique, stable key props when mapping arrays; never use the array index as a key for dynamic lists.

8. TypeScript Standards:

Always define explicit Interfaces or Types for Props and State.

Strictly avoid the any type. Use unknown or specific generics if the type is dynamic.

9. Performance Optimization: Use useMemo and useCallback only when there is a measurable performance gain or to maintain referential integrity for dependency arrays. Do not over-optimize simple components.

10. Code Flow: Use Early Returns to handle error states or loading states first, reducing the need for deeply nested if-else blocks in the JSX.

11. Refactoring: When modifying existing code, if you see violations of these rules, suggest a refactor before adding new features.

12. Cleanup: Do not leave console.log statements, commented-out code, or unused imports in the final output.
