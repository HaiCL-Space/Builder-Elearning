# Cấu trúc Codebase (Codebase Structure)

## Các phần cốt lõi (Bắt buộc)

### 1) Sơ đồ Thư mục Cấp cao (Top-Level Map)

Dưới đây là sơ đồ các thư mục và tệp tin chính của dự án:

| Đường dẫn | Mục đích | Minh chứng |
|------|---------|----------|
| `src/` | Thư mục chứa toàn bộ mã nguồn chính của ứng dụng | Quét thư mục gốc |
| `src/app/` | Khởi tạo ứng dụng: cấu hình khởi tạo (entry bootstrap), giao diện (theme), React Query providers và styles toàn cục | Các import trong `src/main.tsx` |
| `src/pages/` | Các trang giao diện (views) tương ứng với các tuyến đường (routes) của ứng dụng | Các import trong `src/App.tsx` |
| `src/pages/home/` | Trang danh sách khóa học: hiển thị, lọc khóa học/bài học và chuyển hướng sang chế độ Thiết kế hoặc Trải nghiệm | `src/pages/home/ui/HomePage.tsx` |
| `src/pages/builder/` | Trang thiết kế slide tương tác: quản lý danh sách slide, bố cục kéo thả và thay đổi kích thước phần tử trên canvas | `src/pages/builder/ui/builder-page.tsx` |
| `src/pages/viewer//` | Trang trình chiếu và trải nghiệm slide bài học dành cho người học | `src/pages/viewer/ui/viewer-page.tsx` |
| `src/pages/login/` | Trang đăng nhập xác thực người dùng | Các import trong `src/App.tsx` |
| `src/entities/` | Các đối tượng nghiệp vụ (slices): `course` (khóa học), `lesson` (bài học), `slide` (slide), và `element` (phần tử tương tác trên slide) kèm theo các hook truy vấn React Query | `src/entities/element/index.ts` |
| `src/shared/` | Các module chia sẻ dùng chung: xác thực (auth), API REST client, helpers và thiết kế hệ thống giao diện UI dùng chung | `src/shared/ui/button.tsx` |
| `public/` | Thư mục chứa các tài nguyên tĩnh công khai (ví dụ: `vite.svg`) | Quét thư mục gốc |
| `docs/` | Tài liệu kỹ thuật chi tiết của codebase | Quét thư mục gốc |
| `data/` | Chứa dữ liệu văn bản pháp luật tĩnh hoặc tài nguyên mẫu (như luật kinh doanh bất động sản) | Quét thư mục gốc |

### 2) Điểm khởi chạy (Entry Points)

- **Điểm chạy chính của ứng dụng**: `src/main.tsx` - khởi tạo React 19 root, gắn thẻ `<ThemeProvider>` toàn cục, và render component `<App />` làm gốc của toàn bộ ứng dụng.
- **Các điểm chạy phụ (worker/cli/jobs)**: Không có.
- **Cách điểm chạy được kích hoạt**: Được nhúng vào tệp `index.html` thông qua thẻ `<script type="module" src="/src/main.tsx">`, sau đó được Vite biên dịch và khởi chạy khi trình duyệt tải trang.

### 3) Ranh giới Module (Module Boundaries)

Dự án áp dụng chặt chẽ kiến trúc Feature-Sliced Design (FSD) v2.1 với các phân vùng nhiệm vụ rõ ràng:

| Phân vùng (Layer) | Những gì thuộc về đây | Những gì KHÔNG được thuộc về đây |
|----------|-------------------|------------------------|
| `app` | Cấu hình toàn cục, providers (`theme-provider.tsx`, `query-provider.tsx`), CSS style toàn cục. | Các component của trang cụ thể, logic quản lý trạng thái nghiệp vụ, API requests. |
| `pages` | Các view lớn tương ứng với các route chính (`HomePage.tsx`, `builder-page.tsx`, `viewer-page.tsx`, `LoginPage.tsx`) để lắp ghép các feature và entity lại với nhau. | Nút bấm giao diện nguyên bản (button style), logic tính toán nghiệp vụ chi tiết của slide element. |
| `entities` | Đối tượng nghiệp vụ bao gồm: slide elements tương tác trong `src/entities/element/ui` (xem danh sách chi tiết bên dưới) và các thực thể (`course`, `lesson`, `slide`) kèm các React Query hook (`queries.ts`). | Trạng thái kéo thả tọa độ trên canvas thiết kế, thanh công cụ bên sidebar, logic điều hướng trang. |
| `shared` | Thành phần UI nguyên bản (`button.tsx`, `card.tsx`), bộ slide dữ liệu giả lập (`mock-slides.ts`), thư viện helper (`utils.ts`), helper xác thực (`shared/auth`), REST API client (`shared/api/api.ts`). | Định dạng layout của canvas thiết kế, logic quyết định điều hướng các trang lớn. |

#### Danh sách 15 Slide Elements trong `src/entities/element/ui/`:
Mỗi slide element tương ứng với một loại tương tác giáo dục cụ thể và được phân chia thành các component chuyên biệt:
1. `branching-element.tsx`: Xử lý kịch bản tương tác rẽ nhánh lựa chọn hướng đi.
2. `crossword-element.tsx`: Trò chơi giải đố ô chữ tương tác.
3. `fill-blank-element.tsx`: Câu hỏi điền vào chỗ trống.
4. `hotspot-element.tsx`: Tương tác click vào các vùng điểm nóng trên hình ảnh.
5. `label-image-element.tsx`: Trò chơi dán nhãn chú thích lên hình ảnh.
6. `matching-element.tsx`: Trò chơi nối các cặp từ tương thích ở cột trái và phải.
7. `memory-card-element.tsx`: Trò chơi thẻ nhớ lật mặt ghi nhớ thông tin.
8. `quiz-element.tsx`: Câu hỏi trắc nghiệm một hoặc nhiều lựa chọn.
9. `sorting-element.tsx`: Trò chơi sắp xếp các sự kiện/thứ tự theo trình tự thời gian hoặc logic.
10. `swipe-element.tsx`: Tương tác vuốt sang trái/phải để chọn đúng/sai.
11. `text-element.tsx`: Phần tử hiển thị văn bản tĩnh thông thường.
12. `timed-sprint-element.tsx`: Trò chơi chạy đua thời gian trả lời nhanh đúng/sai.
13. `video-element.tsx`: Phần tử phát video bài giảng tương tác.
14. `word-scramble-element.tsx`: Trò chơi sắp xếp các chữ cái hoặc từ bị xáo trộn.
15. `element-preview.tsx`: Thành phần điều phối trung tâm hiển thị element tương ứng với type nhận được.

### 4) Quy tắc Đặt tên và Tổ chức (Naming and Organization Rules)

- **Quy tắc đặt tên file**: Dùng **PascalCase** cho các tệp React Component (ví dụ: `CanvasElement.tsx`, `CourseDialog.tsx`), dùng **kebab-case** cho các tệp chứa logic, utilities, và custom hooks (ví dụ: `use-builder-store.ts`, `builder-utils.ts`).
- **Quy tắc tổ chức thư mục**: Tuân thủ nghiêm ngặt phương pháp Feature-Sliced Design (FSD), phân tách các thư mục theo Layers (`app`, `pages`, `entities`, `shared`), Slices và Segments.
- **Quy định về đường dẫn import**: Bắt buộc sử dụng alias `@/` trỏ trực tiếp đến thư mục `src/` đối với các import liên lớp (ví dụ: `import { uid } from "@/shared/lib/utils"`). Quy định này được cấu hình trong `tsconfig.json` và `vite.config.ts`. Nghiêm cấm việc import vòng (circular imports) hoặc import nhảy cấp từ lớp dưới lên lớp trên (ví dụ: `shared` không được import từ `pages`).

### 5) Minh chứng (Evidence)

- [vite.config.ts](file:///d:/Dev/Work/previewer/vite.config.ts) (Cấu hình alias path `@/`)
- [tsconfig.app.json](file:///d:/Dev/Work/previewer/tsconfig.app.json) (Cấu hình bao đóng các file nguồn)
- [src/App.tsx](file:///d:/Dev/Work/previewer/src/App.tsx) (Lắp ghép và điều hướng các trang)
- [src/main.tsx](file:///d:/Dev/Work/previewer/src/main.tsx) (Khởi chạy ứng dụng)
- [src/entities/element/ui/](file:///d:/Dev/Work/previewer/src/entities/element/ui/) (Thư mục chứa 15 slide elements tương tác)
