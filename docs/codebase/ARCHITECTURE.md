# Kiến trúc Hệ thống (Architecture)

## Các phần cốt lõi (Bắt buộc)

### 1) Phong cách Kiến trúc (Architectural Style)

- **Phong cách chủ đạo**: Feature-Sliced Design (FSD) v2.1.
- **Lý do lựa chọn**: Mã nguồn trong thư mục `src/` được chia thành các phân lớp kiến trúc chính thống (`app`, `pages`, `entities`, `shared`). Các phân lớp tuân thủ cấu trúc phụ thuộc phân cấp nghiêm ngặt: các lớp phía trên có thể import từ các lớp phía dưới, nhưng các lớp phía dưới không bao giờ được phép import từ các lớp phía trên (phụ thuộc một chiều - unidirectional dependency).
- **Các ràng buộc cốt lõi**:
  1. **Quy tắc Import Một chiều**: Lớp dưới (như `shared`) phải hoàn toàn độc lập và không chứa các khái niệm nghiệp vụ từ lớp trên (như `entities` hay `pages`).
  2. **Ranh giới Public API nghiêm ngặt**: Các thành phần trong một slice (ví dụ: `src/pages/builder`) xuất bản (export) giao tiếp công khai của chúng thông qua tệp barrel `index.ts`. Các import chéo slice bắt buộc phải trỏ trực tiếp đến tệp barrel này thay vì import sâu vào các file cấu trúc nội bộ.
  3. **Tách biệt Động cơ Học tập (Decoupled Engines)**: Logic tính toán thời gian lặp lại ngắt quãng (spaced repetition) và chấm điểm kết quả tương tác trò chơi được giao cho thư viện ngoài `broker-core-sdk`. Việc này giúp giữ phần giao diện UI độc lập hoàn toàn với logic tính toán học tập phức tạp.

### 2) Luồng Hoạt động Hệ thống (System Flow)

```text
[index.html]
     │ (Vite Entry Module)
     ▼
[src/main.tsx] ──► [src/app/providers/query-provider.tsx] (React Query provider)
     │         ──► [src/app/providers/theme-provider.tsx] (Global theme context)
     ▼
[src/App.tsx] (Custom router hỗ trợ phục hồi phiên làm việc & bảo vệ tuyến đường)
     ├───► "/login"  ──► [src/pages/login/ui/login-page.tsx] (Cổng xác thực)
     ├───► "/home"   ──► [src/pages/home/ui/HomePage.tsx] (Bảng điều khiển Khóa học/Bài học)
     │                     │
     │                     ├───► "Thiết kế" ────► "/edit?lessonId=..." ──► [src/pages/builder/ui/builder-page.tsx] (Chế độ Editor)
     │                     └───► "Trải nghiệm" ──► "/viewer?lessonId=..." ─► [src/pages/viewer/ui/viewer-page.tsx] (Chế độ Trình chiếu)
     └───► "/viewer" ──► [src/pages/viewer/ui/viewer-page.tsx] (Viewer độc lập)
                             │
                             ▼ (Tải dữ liệu qua React Query)
                         [src/entities/slide/model/queries.ts] (useSlidesQuery)
                             │   ├──► Trực tuyến: REST API (VITE_API_URL)
                             │   └──► Ngoại tuyến: Mock data MOCK_SLIDES dự phòng
                             ▼ (Nhân bản trạng thái để chỉnh sửa trong Builder)
                         [src/pages/builder/model/use-builder-store.ts] (Zustand)
                             │
                             ▼ (Vỏ bọc vẽ phần tử tương tác trên Canvas)
                         [src/pages/builder/ui/canvas/CanvasElement.tsx]
                             │
                             ▼ (Các widget chi tiết từ entities layer)
                         [src/entities/element/ui/*-element.tsx]
                             │
                             ▼ (Đánh giá tương tác sử dụng Core SDK)
                         [broker-core-sdk (learningEngine/gameEngine)]
```

#### Chi tiết các bước trong Luồng Hoạt động:

1. **Khởi tạo và Gắn kết (Entry Mounting)**: Trình duyệt tải `index.html` và chạy `src/main.tsx`. Tệp này khởi tạo React 19 root, bọc ứng dụng trong `<QueryProvider>` và `<ThemeProvider>` và render component gốc `<App />`.
2. **Khôi phục Phiên và Bảo vệ Tuyến đường**: Khi ứng dụng khởi chạy, `App.tsx` kiểm tra xem cookie có chứa refresh token không. Nếu có, nó thực hiện yêu cầu refresh token ngầm (`auth.refresh()`) để khôi phục phiên làm việc và ghi nhận thông tin đăng nhập vào `useAuthStore`.
3. **Điều hướng Tuyến đường (Routing)**: `App.tsx` kiểm tra quyền truy cập dựa trên đường dẫn và trạng thái đăng nhập:
   - `/home` và `/edit` yêu cầu người dùng phải đăng nhập. Người dùng chưa đăng nhập sẽ bị điều hướng về `/login`.
   - `/login` được bảo vệ: người dùng đã đăng nhập sẽ tự động chuyển sang `/home`.
   - `/viewer` có thể truy cập độc lập hoặc kèm theo tham số `lessonId` để trình chiếu trực tiếp bài học.
   - Đường dẫn gốc `/` tự động chuyển tiếp về `/home`.
4. **Đồng bộ Dữ liệu qua TanStack Query**: Các thực thể dữ liệu nghiệp vụ (`course`, `lesson`, `slide`) được tải bằng các custom hook truy vấn (`useCoursesQuery`, `useLessonsQuery`, `useSlidesQuery`). Nếu server REST API (`VITE_API_URL` cấu hình trong `.env`) hoạt động, hệ thống sẽ lấy dữ liệu thực tế từ cơ sở dữ liệu; ngược lại, hệ thống sẽ ghi cảnh báo ra console và fallback sang dữ liệu mock tĩnh (`MOCK_COURSES`, `MOCK_LESSONS`, `MOCK_SLIDES`).
5. **Khởi tạo Trạng thái và Đồng bộ Canvas (State Bootstrapping & Canvas Sync)**:
   - Tại `<HomePage />`, các khóa học được tải qua `useCoursesQuery` và bài học được tải qua `useLessonsQuery(courseId)`. Việc thao tác khóa học sử dụng các mutation hooks (`useCreateCourseMutation`, `useUpdateCourseMutation`, `useDeleteCourseMutation`).
   - Tại `<BuilderPage />`, danh sách slide được lấy qua `useSlidesQuery(lessonId)`. Sau đó, slide được deep-clone vào Zustand store (`useBuilderStore`) để thực hiện các thao tác chỉnh sửa kéo thả tọa độ mà không làm biến đổi cache của React Query.
   - Khi lưu slide, hệ thống gọi `useSaveSlidesMutation`. Nếu lưu thất bại do mất kết nối API, ứng dụng sẽ tạo độ trễ giả lập 600ms và lưu một bản dự phòng an toàn vào `localStorage` của trình duyệt dưới khóa `previewer_slides_backup_{lessonId}` để bảo vệ tiến trình của người dùng.
   - Tại `<ViewerPage />`, slides được hiển thị trực tiếp từ cache hoặc mock data.
6. **Vẽ giao diện Canvas (Canvas Rendering)**: Các phần tử trên slide được truyền qua `CanvasElement.tsx` để điều phối hiển thị các widget nghiệp vụ tương ứng nằm ở `entities/element/ui` (matching, sorting, crossword, swipe, memory card, quiz, hotspot, branching, v.v.) để hiển thị trên màn hình.
7. **Kích hoạt Hành động và Đánh giá qua SDK (Action Dispatching & SDK Evaluation)**: Các tương tác tạo ra các khối lệnh `ElementAction`. Action runner thực thi các hành động này (ví dụ: `EVALUATE_ANSWER`), sử dụng `gameEngine` và `learningEngine` từ `broker-core-sdk` để chấm điểm câu trả lời và tính toán chu kỳ lặp lại ngắt quãng, sau đó cập nhật thông tin phản hồi lên popup `<CustomAlertDialog />`.

### 3) Phân chia Trách nhiệm Phân lớp (Layer/Module Responsibilities)

| Phân lớp | Quản lý | Không được phép quản lý | Minh chứng |
|---|---|---|---|
| `src/app/` | Khởi chạy ứng dụng (`index.css`), gắn kết React VDOM ban đầu, các component phân phối context toàn cục (`theme-provider.tsx`, `query-provider.tsx`). | Bố cục trang cụ thể, quy tắc nghiệp vụ chi tiết, các cuộc gọi API, các bộ quản lý trạng thái. | `src/app/providers/theme-provider.tsx`, `src/app/providers/query-provider.tsx` |
| `src/pages/` | Điều phối bố cục toàn trang (trang danh sách khóa học `/home`, trang thiết kế slide `/edit`, trang trình diễn `/viewer`), xử lý hành vi kéo thả và điều chỉnh kích thước phần tử trên canvas, bảng điều khiển thiết kế slide và thanh sidebar. | Các thành phần giao diện nguyên bản (UI primitives), logic trò chơi chi tiết của slide element. | `src/pages/home/ui/HomePage.tsx`, `src/pages/builder/ui/builder-page.tsx`, `src/pages/viewer/ui/viewer-page.tsx` |
| `src/entities/` | Các slice nghiệp vụ cụ thể (`course`, `lesson`, `slide`, `element`), chứa các React Query hooks (`queries.ts`) hoặc component hiển thị phần tử tương tác (`quiz-element.tsx`, `matching-element.tsx`, v.v.). | Đường kẻ lưới canvas, trạng thái sắp xếp slide bên sidebar, bố cục tổng thể của trang. | `src/entities/element/index.ts`, `src/entities/course/model/queries.ts` |
| `src/shared/` | Các component UI nguyên bản dùng chung (`button.tsx`, `card.tsx`), dữ liệu mock mẫu (`mock-slides.ts`), các helper dùng chung (`utils.ts`), cấu trúc xác thực trung tâm (`shared/auth/`), REST client (`shared/api/api.ts`). | Định dạng chỉnh sửa cụ thể của trang thiết kế, giao diện hiển thị trò chơi riêng biệt của từng element. | `src/shared/ui/button.tsx`, `src/shared/lib/utils.ts` |

### 4) Các Mẫu Thiết kế Tái sử dụng (Reused Patterns)

| Mẫu thiết kế | Nơi áp dụng | Mục đích tồn tại |
|---|---|---|
| **Zustand Central Store** | `src/pages/builder/model/use-builder-store.ts` | Đóng vai trò là nguồn dữ liệu duy nhất (single source of truth) cho trình biên tập slide, đồng bộ hóa các đầu vào của sidebar, vị trí canvas, các hành động CRUD slide và trạng thái UI hiện tại. |
| **Command Pattern (Actions)** | `src/pages/builder/lib/use-action-runner.ts`, `src/pages/viewer/ui/viewer-page.tsx` | Biểu diễn các tương tác của người học (chuyển slide, phát nhạc, chấm điểm câu hỏi, bật/tắt hiển thị phần tử) dưới dạng các đối tượng `ElementAction` được tuần tự hóa (serialized) để thực thi đồng nhất bất kể trang đang hiển thị là trang thiết kế hay trình chiếu. |
| **Provider/Context Pattern** | `src/app/providers/theme-provider.tsx` | Phân phối chủ đề giao diện toàn cục (sáng, tối, sunset, ocean) xuống toàn bộ cây React để các phần tử con nằm sâu bên dưới có thể phản hồi lập tức khi thay đổi giao diện. |

### 5) Các Rủi ro Kiến trúc Đã xác định (Known Architectural Risks)

1. **Trùng lặp Logic Xử lý Action (Duplicate Action Dispatching Logic)**: Cùng một logic xử lý tương tác (`executeAction` trong `viewer-page.tsx`, `SlidePreviewApp` trong `slide-preview.tsx` và `useActionRunner.ts` trong `builder/lib`) đang bị sao chép và triển khai ở nhiều nơi. Điều này tạo ra rủi ro không đồng bộ: khi thêm một loại action mới, lập trình viên buộc phải cập nhật mã nguồn thủ công ở ba tệp khác nhau.
2. **Rủi ro Hiệu năng do Deep-Cloning dữ liệu (State Mutability Risk via JSON cloning)**: Zustand store thực hiện tác vụ đồng bộ deep-clone nặng bằng lệnh `JSON.parse(JSON.stringify(MOCK_SLIDES))` khi khởi chạy. Với những bài giảng có hàng trăm slide và phần tử phức tạp, thao tác chặn luồng chính (blocking) này sẽ làm giảm hiệu năng khởi động ứng dụng và gây giật khung hình (frame drops).
3. **Vi phạm Ranh giới FSD giữa Pages và Builder (Circular / Violation Risk)**: Component `ViewerPage` trong tầng `pages` đang import trực tiếp `CanvasElement` từ `src/pages/builder/ui/canvas/CanvasElement`. Trong kiến trúc FSD tiêu chuẩn, việc import chéo giữa các slice cùng một tầng là không được khuyến khích; component hiển thị canvas chung nên được tách ra và đưa vào tầng `entities` hoặc `shared` để giảm thiểu liên kết chặt chẽ (tight coupling).

### 6) Minh chứng (Evidence)

- [src/App.tsx](file:///d:/Dev/Work/previewer/src/App.tsx) (Bộ định tuyến điều hướng tùy chỉnh)
- [src/pages/builder/model/use-builder-store.ts](file:///d:/Dev/Work/previewer/src/pages/builder/model/use-builder-store.ts) (Zustand state store)
- [src/pages/builder/lib/use-action-runner.ts](file:///d:/Dev/Work/previewer/src/pages/builder/lib/use-action-runner.ts) (Bộ điều phối action dạng command)
- [src/pages/viewer/ui/viewer-page.tsx](file:///d:/Dev/Work/previewer/src/pages/viewer/ui/viewer-page.tsx) (Trang trình chiếu và điều phối action)
- [src/entities/element/ui/element-preview.tsx](file:///d:/Dev/Work/previewer/src/entities/element/ui/element-preview.tsx) (Bộ định hướng hiển thị slide elements)
