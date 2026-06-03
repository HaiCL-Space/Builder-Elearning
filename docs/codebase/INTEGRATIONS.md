# Tích hợp Hệ thống Bên ngoài (External Integrations)

## Các phần cốt lõi (Bắt buộc)

### 1) Danh mục Tích hợp (Integration Inventory)

| Hệ thống | Loại tích hợp | Mục đích | Mô hình xác thực | Mức độ quan trọng | Minh chứng |
|---|---|---|---|---|---|
| REST API Backend | **Kết nối REST API** | Quản lý xác thực, danh mục khóa học, bài giảng và bố cục các slide | Token JWT không trạng thái (Access token trong bộ nhớ store; Refresh token lưu trong Cookie) | **Cao** | `src/shared/api/api.ts`, `.env` |
| `broker-core-sdk` | **Thư viện cài đặt cục bộ (NPM)** | Cung cấp các định nghĩa kiểu dữ liệu (Schemas) TypeScript dùng chung và các động cơ xác thực kết quả học tập/chu kỳ lặp lại ngắt quãng | Không có (chạy hoàn toàn cục bộ trên trình duyệt client) | **Cao** | `package.json`, `src/pages/builder/lib/use-action-runner.ts` |
| `Zustand` | **Bộ nhớ lưu trữ Client (In-memory Store)** | Quản lý các sửa đổi của slide hiện tại, tọa độ canvas thiết kế, danh sách slide và các popup cảnh báo tương tác | Không có (chạy trực tiếp trên RAM của trình duyệt client) | **Cao** | `package.json`, `src/pages/builder/model/use-builder-store.ts`, `src/shared/auth/auth-store.ts` |

### 2) Các Kho lưu trữ Dữ liệu (Data Stores)

| Kho lưu trữ | Vai trò | Tầng truy cập | Rủi ro chính | Minh chứng |
|---|---|---|---|---|
| Zustand State Store | Duy trì trạng thái sửa đổi slide hiện tại (`useBuilderStore`) và thông tin đăng nhập/profile người dùng (`useAuthStore`) trong bộ nhớ RAM tạm thời. | `src/pages/builder/model/use-builder-store.ts`, `src/shared/auth/auth-store.ts` | Dung lượng dữ liệu lớn có thể gây giật màn hình; F5 trình duyệt sẽ xóa sạch dữ liệu chưa lưu nếu cơ chế sao lưu ngoại tuyến gặp lỗi. | `package.json` |
| Trình duyệt Local Storage | Lưu trữ bản sao lưu slide ngoại tuyến dưới khóa `previewer_slides_backup_${lessonId}` khi REST API gặp lỗi không lưu được slide. | `src/entities/slide/model/queries.ts` | Giới hạn dung lượng (thông thường là 5MB); nguy cơ dữ liệu bị hỏng hoặc người dùng xóa sạch cache trình duyệt. | `queries.ts:L85` |
| Cookies của Trình duyệt | Lưu trữ refresh token (`refreshToken`) dùng để tự động thiết lập lại phiên làm việc REST API ngầm khi mở lại ứng dụng. | `src/shared/auth/auth.ts` | Cookie hết hạn hoặc bị xóa sẽ bắt buộc người dùng đăng nhập lại; rủi ro CSRF nếu không cấu hình cờ SameSite (hiện đã giảm thiểu bằng SameSite=Lax/Strict). | `auth.ts:L30` |
| Bộ phát HTML5 Audio | Phát âm thanh phản hồi khi học viên chọn câu trả lời Đúng/Sai trong slide tương tác. | `src/pages/builder/lib/use-action-runner.ts` | Chính sách chặn tự động phát (Autoplay block policies) của trình duyệt sẽ từ chối phát âm thanh nếu người dùng chưa tương tác click vào trang. | `use-action-runner.ts` |

### 3) Quản lý Thông tin Bảo mật và Đăng nhập (Secrets and Credentials Handling)

- **Nguồn cấp thông tin bí mật**: Địa chỉ URL của REST API được cấu hình thông qua biến môi trường `VITE_API_URL` (mặc định trỏ về `http://localhost:8001/v1` nếu không có cấu hình khác).
- **Luồng Xác thực**: Người dùng nhập tài khoản/mật khẩu và gửi tới `/auth/login`. Server phản hồi kèm access token, refresh token và profile người dùng. Access token được lưu trong bộ nhớ tạm thời của `useAuthStore` và tự động đính kèm vào header `Authorization: Bearer <token>` thông qua middleware của REST client `api.ts`.
- **Chu kỳ Phiên làm việc**: Refresh token được lưu trong cookie trình duyệt với cấu hình thời gian sống rõ ràng. Client thiết lập một tác vụ hẹn giờ ngầm (`scheduleTokenRefresh` trong `auth.ts`) để gửi yêu cầu làm mới token `/auth/refresh-token` trước khi token hiện tại hết hạn 30 giây.
- **Kiểm tra ghi cứng mật khẩu (Hardcoding Check)**: Đã kiểm tra. Toàn bộ các địa chỉ API endpoint và cấu hình môi trường đều được ánh xạ động qua biến môi trường Vite `import.meta.env` thay vì ghi trực tiếp vào mã nguồn.

### 4) Độ tin cậy và Xử lý khi Gặp lỗi (Reliability and Failure Behavior)

- **Hành vi thử lại/Độ trễ lùi (Retry/Backoff)**: TanStack Query được cấu hình thử lại 1 lần duy nhất (`retry: 1`) khi tải dữ liệu để tránh làm treo ứng dụng quá lâu, sau đó lập tức kích hoạt fallback để chuyển sang hiển thị dữ liệu mock tĩnh.
- **Giả lập Trễ lưu trữ (Latency Simulation)**: Khi API lưu slide bị lỗi và hệ thống chuyển sang lưu dự phòng ngoại tuyến, ứng dụng cố tình tạo một khoảng trễ giả lập 600ms để hiển thị vòng xoay spinner tự nhiên trên giao diện người dùng.
- **Cơ chế Dự phòng (Circuit-breaker / Fallback)**:
  - **Dự phòng Tải dữ liệu**: Khi các API lấy dữ liệu khóa học `/courses`, bài giảng `/lessons`, hoặc slide `/slides` gặp lỗi, ứng dụng sẽ in cảnh báo ra console và lấy nguồn dữ liệu mẫu tĩnh (`MOCK_COURSES`, `MOCK_LESSONS`, `MOCK_SLIDES`) để giao diện trình chiếu bài giảng hoạt động bình thường offline.
  - **Dự phòng Lưu trữ**: Khi tác vụ lưu thiết kế slide tới `/lessons/:id/slides` gặp lỗi (mất mạng hoặc lỗi server), hệ thống bắt lỗi này, hiển thị thông báo cảnh báo lưu ngoại tuyến lên UI, và ghi đè dữ liệu thiết kế vào `localStorage` của trình duyệt dưới khóa `previewer_slides_backup_${lessonId}`, đảm bảo tiến trình thiết kế của giáo viên không bao giờ bị mất.
  - **Dự phòng Âm thanh**: Logic gọi audio được bọc catch để tránh làm treo ứng dụng React khi gặp chính sách bảo mật trình duyệt chặn autoplay.

### 5) Khả năng Giám sát Tích hợp (Observability for Integrations)

- **Ghi nhật ký cuộc gọi ngoài (Logging)**: Mọi sự kiện đăng nhập, cập nhật token ngầm, truy vấn dữ liệu, lưu dữ liệu và kích hoạt cơ chế fallback ngoại tuyến đều được in chi tiết ra màn hình console của trình duyệt bằng các hàm `console.log` / `console.warn` phục vụ việc gỡ lỗi nhanh.
- **Hệ thống Đo lường tập trung (Telemetry)**: Dự án hiện tại chạy độc lập và không kết nối với bất kỳ nền tảng phân tích hay đo lường từ xa nào (như Sentry hay Google Analytics). Việc theo dõi hiệu năng và lỗi hoàn toàn dựa trên Developer Tools của trình duyệt.

### 6) Minh chứng (Evidence)

- [package.json](file:///d:/Dev/Work/previewer/package.json)
- [src/pages/builder/lib/use-action-runner.ts](file:///d:/Dev/Work/previewer/src/pages/builder/lib/use-action-runner.ts) (Tích hợp SDK đánh giá kết quả tại chỗ)
- [src/pages/viewer/ui/viewer-page.tsx](file:///d:/Dev/Work/previewer/src/pages/viewer/ui/viewer-page.tsx) (Tích hợp Động cơ Game cục bộ)
