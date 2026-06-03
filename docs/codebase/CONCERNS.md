# Các Vấn đề và Rủi ro Kỹ thuật (Codebase Concerns)

## Các phần cốt lõi (Bắt buộc)

### 1) Rủi ro Hàng đầu (Top Risks - Theo thứ tự ưu tiên)

| Mức độ | Vấn đề | Minh chứng | Tác động | Giải pháp đề xuất |
|---|---|---|---|---|
| **Cao** | **Không có kiểm thử tự động (Zero Automated Testing Coverage)** | Không tồn tại bất kỳ gói thư viện kiểm thử tự động hoặc lệnh chạy test nào trong `package.json`. | Dễ phát sinh lỗi hồi quy (regression bugs) khi sửa đổi các hàm xử lý trạng thái store phức tạp hoặc các công thức tính toán tọa độ kéo thả trên canvas. | Khách hàng đã chỉ thị kiểm thử tự động không bắt buộc cho dự án này, do đó vấn đề này tạm thời giữ nguyên. |
| **Trung bình** | **Vi phạm ranh giới phân lớp kiến trúc FSD (Circular Coupling)** | `ViewerPage` (nằm trong lớp `pages`) import trực tiếp component `CanvasElement` từ đường dẫn `src/pages/builder/ui/canvas/CanvasElement`. | Vi phạm nghiêm trọng quy tắc độc lập và một chiều của kiến trúc Feature-Sliced Design (FSD), làm cho lớp trang trình chiếu bị phụ thuộc chặt chẽ vào các cấu trúc nội bộ của trang thiết kế. | Tách logic hiển thị thuần túy của `CanvasElement` thành component dùng chung đặt tại `entities/element` hoặc `shared/ui`. |
| **Trung bình** | **Trùng lặp Logic Xử lý Action (Duplicated Action Dispatching)** | Logic thực thi tương tác `ElementAction` đang được viết lặp lại tại `useActionRunner.ts` và `viewer-page.tsx`. | Hệ thống trở nên mỏng manh và dễ phát sinh lỗi đồng bộ; khi thêm mới hoặc sửa đổi một loại tương tác tương tác, lập trình viên buộc phải cập nhật thủ công nhiều file khác nhau. | Hợp nhất logic thực thi action vào một custom hook duy nhất (ví dụ: `useElementActionRunner`) đặt ở tầng `entities/element` hoặc `shared/lib`. |
| **Thấp** | **Xử lý Clone dữ liệu đồng bộ gây chặn luồng UI (Synchronous Deep-Cloning)** | Thao tác đồng bộ deep-clone nặng bằng lệnh `JSON.parse(JSON.stringify(MOCK_SLIDES))` khi khởi tạo Zustand store. | Tiêu tốn nhiều bộ nhớ RAM và làm chặn (blocking) luồng UI chính của trình duyệt trong quá trình khởi động ứng dụng, dễ gây giật lag trên các thiết bị cấu hình yếu khi tải các bài giảng dung lượng lớn. | Chuyển việc nạp dữ liệu mồi sang một action bất đồng bộ hoặc thay thế bằng cơ chế cập nhật không đột biến (non-mutative) sử dụng shallow copy. |

### 2) Nợ Kỹ thuật (Technical Debt)

Dưới đây là các khoản nợ kỹ thuật quan trọng nhất của dự án:

| Khoản nợ | Nguyên nhân tồn tại | Vị trí ảnh hưởng | Rủi ro nếu bỏ qua | Giải pháp đề xuất/Đã xử lý |
|---|---|---|---|---|
| **Đã giải quyết: Component SlidePreview bị thừa (Dead Code)** | Được loại bỏ hoàn toàn trong đợt dọn dẹp mã nguồn gần đây. | `src/entities/slide` | *Không còn rủi ro* (Đã xóa để giải phóng hơn 430 dòng code trùng lặp/thừa). | Dọn dẹp hoàn tất. Đã xóa các lệnh export liên quan. |
| **Đã giải quyết: Lệch đường dẫn Stylesheet của Tailwind** | Đã căn chỉnh cấu hình đồng nhất trong đợt dọn dẹp gần đây. | `components.json`, `.prettierrc` | *Không còn rủi ro* (Đã trỏ chính xác về tệp stylesheet thực tế `src/app/styles/index.css`). | Đã đồng bộ cấu hình. Cơ chế tự động sắp xếp class Tailwind của Prettier hoạt động tốt. |
| **Đã giải quyết: Hàm tiện ích `uid()` bị trùng lặp** | Được loại bỏ hoàn toàn trong đợt dọn dẹp mã nguồn gần đây. | `src/shared/lib/builder-utils.ts` | *Không còn rủi ro* (Đã hợp nhất và chỉ sử dụng một hàm `uid()` duy nhất định nghĩa tại `src/shared/lib/utils.ts`). | Đã xóa định nghĩa hàm thừa và cập nhật các import liên quan. |

### 3) Rủi ro về Bảo mật (Security Concerns)

| Rủi ro bảo mật | Phân loại OWASP | Minh chứng | Giải pháp giảm thiểu hiện tại | Điểm hạn chế (Gap) |
|---|---|---|---|---|
| **Người dùng có thể vượt qua kiểm tra kết quả trò chơi** | Client-Side Security Controls | Toàn bộ logic `gameEngine` và `learningEngine` đều chạy trực tiếp trên trình duyệt của người dùng. | Rủi ro thấp vì hiện tại ứng dụng hoạt động dưới dạng bản demo trình diễn học tập tĩnh. | Học viên am hiểu kỹ thuật có thể mở F12 Console để can thiệp biến trạng thái JavaScript nhằm vượt qua các bài kiểm tra hoặc đánh giá. |
| **Refresh Token lưu trữ ở Cookie không có cờ HttpOnly** | Broken Authentication / Sensitive Data Exposure | Cookie refresh token được ghi từ mã nguồn phía client sử dụng lệnh `document.cookie` tại `auth.ts`. | Access token được lưu trữ nghiêm ngặt trong bộ nhớ tạm thời Zustand store (`useAuthStore`). | Nếu ứng dụng gặp lỗ hổng XSS, kẻ tấn công có thể đọc cookie này bằng mã độc chạy ở client do cookie do JavaScript tạo không thể mang cờ `HttpOnly`. |

### 4) Vấn đề về Hiệu năng và Khả năng Mở rộng (Performance and Scaling Concerns)

| Vấn đề hiệu năng | Minh chứng | Biểu hiện hiện tại | Rủi ro khi mở rộng | Giải pháp cải tiến |
|---|---|---|---|---|
| **Tệp dữ liệu Mock tĩnh quá lớn (Monolithic Mock Data)** | Tệp `mock-slides.ts` có dung lượng tới **47.3KB** và chứa hơn 1100 dòng code dữ liệu tĩnh viết cứng. | Kích thước file lớn gây khó khăn cho lập trình viên khi cần đọc, chỉnh sửa hoặc bảo trì nội dung bài giảng. | Khi thêm nhiều bài học mới hoặc chèn dữ liệu media phong phú, tệp tin này sẽ phình to quá mức gây chậm quá trình biên dịch và khởi chạy IDE. | Phân tách nội dung bài học thành các tệp JSON tĩnh riêng biệt và thực hiện tải động (dynamic fetching) khi cần thiết. |
| **Re-render liên tục khi cập nhật Zustand store** | Zustand store lưu trữ cả dữ liệu trạng thái slide lẫn các hàm cập nhật tọa độ kéo thả phần tử. | Việc thay đổi tọa độ kéo thả liên tục kích hoạt re-render diện rộng toàn bộ canvas. | Kéo thả phần tử trên các slide chứa hàng chục widget phức tạp sẽ gây ra hiện tượng giật lag khung hình và phản hồi UI bị chậm trễ. | Áp dụng cơ chế lắng nghe có chọn lọc (Zustand selectors, ví dụ: `useBuilderStore(state => state.draggingId)`) để giới hạn phạm vi re-render. |

### 5) Các Vùng Code Dễ Lỗi và Có Tần Suất Thay Đổi Cao (Fragile/High-Churn Areas)

Dựa trên dữ liệu git history thu thập mới nhất, dưới đây là các tệp nguồn có tần suất thay đổi lớn nhất trong vòng 90 ngày qua:

| Tệp tin nguồn | Lý do dễ lỗi / thay đổi nhiều | Tần suất (Git commit) | Chiến lược can thiệp an toàn |
|---|---|---|---|
| `src/shared/api/mock-slides.ts` | Chứa toàn bộ dữ liệu bài học mẫu phục vụ demo khóa học Luật Kinh doanh Bất động sản Việt Nam. | **12 lần thay đổi** | Giữ cấu trúc dữ liệu dưới dạng JSON tĩnh rõ ràng; thực hiện chạy typecheck đối chiếu kiểu dữ liệu với `broker-core-sdk`. |
| `src/pages/builder/ui/canvas/CanvasElement.tsx` | Điều khiển tọa độ canvas thiết kế, các điểm mốc thay đổi kích thước, bản đồ vùng hotspot và trạng thái tương tác. | **12 lần thay đổi** | Tách nhỏ các component con bổ trợ (như `ResizeHandles`, `DeleteButton`) ra các tệp riêng biệt; khai báo kiểu prop-types chặt chẽ. |
| `src/pages/builder/ui/builder-page.tsx` | Component đóng vai trò điều phối chính cho trang thiết kế, quản lý các sidebar, canvas và các mutation lưu dữ liệu. | **11 lần thay đổi** | Module hóa các phân vùng giao diện và bảng điều khiển; đảm bảo đồng bộ hóa trạng thái an toàn. |
| `src/pages/builder/model/use-builder-store.ts` | Quản lý các mutation trạng thái phức tạp trong Zustand store, từ tọa độ dragging, resize đến CRUD slide. | **10 lần thay đổi** | Ghi tài liệu giải thích rõ ràng cho mọi hành động thay đổi trạng thái; áp dụng mô hình cập nhật không đột biến (immutable updates). |
| `src/entities/element/ui/element-preview.tsx` | Bộ điều phối trung tâm để định tuyến hiển thị các widget tương tác nghiệp vụ tương ứng. | **9 lần thay đổi** | Đảm bảo cấu trúc switch-case tường minh; yêu cầu mọi widget con tuân thủ một chuẩn interface Props thống nhất. |

### 6) Các câu hỏi cần làm rõ với người dùng `[ASK USER]`

1. **[ASK USER]** Chúng ta có nên tách logic hiển thị và bố cục của `CanvasElement` ra khỏi slice `pages/builder` đưa vào tầng dùng chung `entities/element` để giải quyết triệt để rủi ro liên kết vòng (circular coupling) của kiến trúc FSD không?
2. **[ASK USER]** Bạn có muốn chúng tôi tách một custom hook chung `useElementActionRunner` để hợp nhất các bộ xử lý gửi nhận action đang bị trùng lặp trong `useActionRunner.ts` và `viewer-page.tsx` không?

### 7) Minh chứng (Evidence)

- Lệnh kiểm tra kiểu dữ liệu `npm run typecheck` thành công hoàn toàn.
- Không còn bất kỳ khai báo hay tham chiếu nào tới component đã xóa `SlidePreviewApp` hay hàm tiện ích trùng lặp `uid()`.
- Xác nhận các đường dẫn stylesheet của Tailwind hoạt động chính xác trong cấu hình định dạng Prettier.
- Kết quả quét cấu trúc codebase được cập nhật mới nhất tại [codebase-scan.txt](file:///d:/Dev/Work/previewer/docs/codebase/.codebase-scan.txt).
