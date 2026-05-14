# STRUCTURE - Cấu trúc thư mục và Tập tin dự án

Tài liệu này cung cấp một bản đồ chi tiết về cấu trúc thư mục, các điểm khởi chạy ứng dụng (entrypoints) và quy luật phân bổ tệp tin của dự án `previewer`.

---

## 1. Sơ đồ cây thư mục tổng quan

Dưới đây là sơ đồ tổ chức thư mục của dự án:

```text
previewer/
├── .agents/                    # [Hệ thống] Chứa các cấu hình kỹ năng và tài nguyên cho AI agents
├── docs/                       # Tài liệu hướng dẫn phát triển hệ thống
│   └── codebase/               # [MỚI] Bộ tài liệu phân tích dự án cho AI đọc
├── node_modules/               # Thư viện ngoài cài đặt từ npm (Bao gồm @broker/core-sdk)
├── public/                     # Tài nguyên tĩnh không qua compile (logo, assets, etc.)
└── src/                        # Thư mục mã nguồn chính (Source Code)
    ├── components/             # Chứa toàn bộ React Components của ứng dụng
    │   ├── builder/            # Canvas Trình soạn thảo Slide thiết kế trực quan
    │   │   ├── canvas/         # Các thành phần vẽ canvas, khung resize, thước đo, overlays
    │   │   ├── sidebar/        # Các bảng Inspector/Editor cấu hình chi tiết cho từng loại Element
    │   │   ├── LeftSidebar.tsx # Quản lý danh sách slide, thêm/nhân bản slide, toolbox phần tử
    │   │   ├── RightSidebar.tsx# Trình điều phối Inspector (chuyển đổi Tabs Design / Animation / Action)
    │   │   ├── Canvas.tsx      # Khung vẽ trung tâm (Render lưới tọa độ, tỷ lệ khung hình)
    │   │   ├── fields.tsx      # Các UI Fields cơ bản dùng trong Sidebar (TextField, NumberField, etc.)
    │   │   ├── templates.ts    # Mẫu dữ liệu khởi tạo mặc định cho từng loại Element
    │   │   └── types.ts        # Định nghĩa kiểu dữ liệu nội bộ của Builder
    │   ├── elements/           # Thành phần hiển thị thực tế tương tác của từng loại phần tử Slide
    │   │   ├── text-element.tsx     # Renderer phần tử chữ (TEXT)
    │   │   ├── video-element.tsx    # Renderer phần tử video (VIDEO)
    │   │   ├── quiz-element.tsx     # Renderer phần tử trắc nghiệm (QUIZ)
    │   │   ├── hotspot-element.tsx  # Renderer phần tử vùng chạm ảnh (HOTSPOT)
    │   │   ├── sorting-element.tsx  # Renderer phần tử kéo thả sắp xếp (SORTING)
    │   │   ├── matching-element.tsx # Renderer phần tử ghép cặp từ khóa (MATCHING)
    │   │   └── index.ts             # Điểm Export tập trung của các Elements
    │   ├── ui/                 # Thành phần giao diện dùng chung (Shadcn UI + Radix)
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── label.tsx
    │   │   └── radio-group.tsx
    │   ├── slide-preview.tsx   # Trình xem trước Slide độc lập (Standalone Previewer)
    │   └── theme-provider.tsx  # Provider quản lý Dark Mode và lưu trạng thái vào LocalStorage
    ├── lib/                    # Các tệp thư viện và hàm tiện ích dùng chung
    │   ├── mock-slides.ts      # Dữ liệu slides giả lập phong phú để hiển thị/test
    │   └── utils.ts            # Hàm cn(...) kết hợp clsx và tailwind-merge
    ├── App.tsx                 # Thành phần bọc chính của ứng dụng (Renders <SlideBuilder />)
    ├── index.css               # Cấu hình Tailwind CSS v4, font chữ và các biến theme toàn cục
    └── main.tsx                # Điểm khởi chạy chính - Mount ứng dụng vào HTML DOM
├── components.json             # File cấu hình tích hợp thư viện Shadcn UI
├── eslint.config.js            # Cấu hình kiểm tra lỗi tĩnh ESLint (Flat Config)
├── index.html                  # Khung trang HTML tĩnh gốc của Single Page Application
├── package.json                # Quản lý danh sách thư viện phụ thuộc và scripts chạy dự án
├── tsconfig.json               # Cấu hình gốc TypeScript
├── tsconfig.app.json           # Cấu hình TypeScript cho ứng dụng Client
├── tsconfig.node.json          # Cấu hình TypeScript cho tệp cấu hình Node
└── vite.config.ts              # Cấu hình Bundler Vite và bí danh đường dẫn @/*
```

---

## 2. Các điểm khởi chạy cốt lõi (Core Entrypoints)

*   **`index.html`**: Điểm neo duy nhất của ứng dụng. Chứa thẻ `<div id="root"></div>` và tải tệp khởi chạy `/src/main.tsx`.
*   **`src/main.tsx`**: Khởi tạo React Root, nạp tệp CSS toàn cục (`src/index.css`), bọc ứng dụng trong `<StrictMode>` và render thành phần `<App />` vào DOM.
*   **`src/index.css`**: Định nghĩa toàn bộ nền tảng style của dự án:
    *   Nhập tệp CSS Tailwind v4, animations, shadcn style và font Inter.
    *   Khai báo biến màu Oklch động cho cả hai chế độ Light và Dark Mode.
    *   Áp dụng các định dạng mặc định cho thẻ HTML cơ bản qua `@layer base`.
*   **`src/App.tsx`**: Đóng vai trò là App Component gốc, render thành phần chính `<SlideBuilder />` nằm trong `src/components/builder/index.tsx` để hiển thị không gian làm việc.

---

## 3. Quy luật phân phối Component (Component Architecture Patterns)

Ứng dụng chia tách rạch ròi giữa 2 loại Component:

1.  **Builder Components (`src/components/builder/`)**:
    *   Chỉ phục vụ cho giao diện thiết kế (soạn thảo), quản lý tọa độ tuyệt đối (%), xử lý kéo thả (drag), đổi kích thước (resize), chỉnh sửa thuộc tính của các phần tử và quản lý phân trang slide.
    *   Được phân tách nhỏ thành `canvas/` (vẽ lưới, hiển thị guidelines căn chỉnh khi kéo thả) và `sidebar/` (các panel nhập liệu nội dung).
2.  **Element Components (`src/components/elements/`)**:
    *   Được thiết kế theo nguyên lý Single Responsibility. Mỗi tệp chỉ render và xử lý logic tương tác của **một** loại Element duy nhất (Ví dụ: `quiz-element.tsx` hiển thị câu hỏi và danh sách các lựa chọn).
    *   Được tái sử dụng ở cả 2 chế độ:
        *   **Editing Mode**: Render tĩnh bên trong một khung wrapper kéo thả (`CanvasElement.tsx`).
        *   **Interactive Play Mode**: Render độc lập có đầy đủ tương tác hoàn chỉnh (chọn trắc nghiệm, nộp bài, kéo thả mốc thời gian, nối cặp).

---

## Bằng chứng kiểm chứng (Evidence)

*   [src/main.tsx](file:///d:/Dev/Work/previewer/src/main.tsx): Điểm neo và tải tệp CSS chính.
*   [src/App.tsx](file:///d:/Dev/Work/previewer/src/App.tsx): Mount trực tiếp thành phần `<SlideBuilder />`.
*   [src/components/elements/index.ts](file:///d:/Dev/Work/previewer/src/components/elements/index.ts): Export tập trung cho các Interactive Elements.
*   [src/components/builder/index.tsx](file:///d:/Dev/Work/previewer/src/components/builder/index.tsx): Chứa toàn bộ luồng quản lý logic trung tâm của màn hình biên tập thiết kế.
