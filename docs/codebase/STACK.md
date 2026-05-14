# STACK - Công nghệ và Thư viện lõi

Tài liệu này chi tiết hóa toàn bộ các công nghệ, thư viện, framework, công cụ build và cấu hình liên quan của dự án Slide Builder & Interactive Previewer (previewer). Đây là nguồn thông tin chuẩn để các AI khác hiểu rõ môi trường chạy và biên dịch hệ thống.

---

## 1. Công nghệ & Framework chính

*   **Runtime / Environment**: Node.js
*   **Framework chính**: **React 19** (Phiên bản `^19.2.4`)
    *   Sử dụng hoàn toàn React Hooks, Functional Components và cơ chế Rendering hiện đại của React 19 (mặc định tích hợp JSX transform mới).
*   **Ngôn ngữ lập trình**: **TypeScript 5**
    *   Hỗ trợ khai báo kiểu nghiêm ngặt (`strict: true`), cấu hình chia tách giữa môi trường App (`tsconfig.app.json`) và môi trường cấu hình Node (`tsconfig.node.json`).

---

## 2. Công cụ Build và Biên dịch (Build Tooling)

*   **Bundler / Dev Server**: **Vite 7** (Thông qua cấu hình `vite.config.ts`)
    *   Tích hợp plugin `@vitejs/plugin-react` để hỗ trợ Hot Module Replacement (HMR) cho React cực nhanh.
    *   Tích hợp plugin CSS mới `@tailwindcss/vite` để biên dịch trực tiếp Tailwind CSS v4.
*   **TypeScript Configuration**:
    *   Sử dụng cấu hình đa tệp:
        *   `tsconfig.json`: File cấu hình gốc, tham chiếu đến các file con.
        *   `tsconfig.app.json`: Cấu hình biên dịch cho mã nguồn ứng dụng Client chạy trong trình duyệt (bao gồm aliases `@/*` trỏ tới `./src/*`).
        *   `tsconfig.node.json`: Cấu hình biên dịch cho môi trường Node (các file cấu hình như `vite.config.ts`).

---

## 3. Quản lý Giao diện & Styling (UI & Styling)

*   **CSS Framework**: **Tailwind CSS v4**
    *   Sử dụng cú pháp Tailwind v4 mới nhất tích hợp trực tiếp vào tệp `src/index.css` qua lệnh `@import "tailwindcss";`.
    *   Các biến theme CSS được khai báo tùy chỉnh ngay trong `@theme inline` của file CSS để định hình bảng màu (Oklch), bo góc, font chữ hệ thống (`Inter Variable`).
*   **UI Primitives (Radix UI)**:
    *   Sử dụng `@radix-ui` (phiên bản `^1.4.3`) cung cấp các thành phần giao diện không style (headless), đảm bảo khả năng tùy biến cao, hỗ trợ WAI-ARIA tốt (như `Slot` cho tính năng `asChild` trong nút bấm).
*   **Icon Library**: **Lucide React** (`^1.14.0`)
    *   Cung cấp các biểu tượng trực quan dạng SVG linh hoạt (như `Plus`, `X`, `Zap`, `Sparkles`, `Play`).
*   **Style Helpers**:
    *   `clsx` & `tailwind-merge`: Hỗ trợ ghép chuỗi class Tailwind động và giải quyết xung đột ghi đè CSS dễ dàng qua hàm tiện ích `cn(...)`.
    *   `class-variance-authority (cva)`: Quản lý các biến thể (variants) của UI component (ví dụ component `<Button />`).
    *   `tw-animate-css`: Cung cấp các cấu hình animation Tailwind được dựng sẵn.

---

## 4. Công cụ Chất lượng Mã nguồn (Linting & Formatting)

*   **Linter**: **ESLint 9**
    *   Sử dụng cấu hình Flat Config (`eslint.config.js`).
    *   Kế thừa các bộ luật chuẩn: `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
*   **Formatter**: **Prettier**
    *   Cấu hình thông qua `.prettierrc` và `.prettierignore`.
    *   Tích hợp plugin `prettier-plugin-tailwindcss` để tự động sắp xếp thứ tự các class Tailwind đúng chuẩn, nâng cao khả năng bảo trì giao diện.

---

## 5. Thư viện tích hợp ngoài (External Integrations)

*   **@broker/core-sdk**:
    *   Gói SDK cục bộ được cài đặt tại `node_modules/@broker/core-sdk`.
    *   Cung cấp các Engine chấm điểm (`gameEngine`), công cụ Spaced Repetition (`learningEngine`) và toàn bộ hệ thống định nghĩa kiểu dữ liệu (Types) liên quan đến Slide, SlideElement, ElementAction.

---

## Bằng chứng kiểm chứng (Evidence)

*   [package.json](file:///d:/Dev/Work/previewer/package.json): Chứa thông tin chi tiết các phiên bản của `react`, `vite`, `tailwindcss`, `radix-ui`, `lucide-react`.
*   [vite.config.ts](file:///d:/Dev/Work/previewer/vite.config.ts): Chứa thông tin plugin `@tailwindcss/vite` và `@vitejs/plugin-react`.
*   [src/index.css](file:///d:/Dev/Work/previewer/src/index.css): Chứa cấu hình `@import "tailwindcss";` và `@theme inline` của Tailwind v4.
*   [tsconfig.app.json](file:///d:/Dev/Work/previewer/tsconfig.app.json): Chứa cấu hình TypeScript client-side và alias `@/*`.
*   [eslint.config.js](file:///d:/Dev/Work/previewer/eslint.config.js): Định cấu hình ESLint Flat Config và các bộ rule được kích hoạt.
