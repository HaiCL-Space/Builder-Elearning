# Quy ước Lập trình (Coding Conventions)

## Các phần cốt lõi (Bắt buộc)

### 1) Quy tắc Đặt tên (Naming Rules)

| Thành phần | Quy tắc | Ví dụ | Minh chứng |
|---|---|---|---|
| React Components | **PascalCase** | `CanvasElement.tsx`, `CustomAlertDialog.tsx` | `src/pages/builder/ui/canvas/` |
| Thư mục / Slices | **kebab-case** | `theme-provider`, `builder-utils` | `src/app/providers/`, `src/shared/lib/` |
| Hàm và Hooks | **camelCase** | `useActionRunner()`, `handleAction()` | `src/pages/builder/lib/use-action-runner.ts` |
| Kiểu dữ liệu / Interfaces | **PascalCase** | `BuilderElement`, `BuilderState` | `src/pages/builder/model/types.ts` |
| Hằng số / Tập cấu hình | **UPPER_SNAKE_CASE** | `MOCK_SLIDES`, `THEME_BACKGROUNDS` | `src/shared/api/mock-slides.ts` |

### 2) Định dạng Code và Linter (Formatting and Linting)

- **Công cụ định dạng (Formatter)**: Prettier. Cấu hình thông qua tệp [.prettierrc](file:///d:/Dev/Work/previewer/.prettierrc):
  - Không sử dụng dấu chấm phẩy cuối dòng (`semi: false`).
  - Sử dụng dấu nháy kép tiêu chuẩn (`singleQuote: false`).
  - Khoảng cách lùi dòng là 2 dấu cách (`tabWidth: 2`).
  - Độ dài tối đa của dòng code là 80 ký tự (`printWidth: 80`).
  - Sử dụng plugin `prettier-plugin-tailwindcss` để tự động sắp xếp class Tailwind.
  - Định rõ đường dẫn tệp stylesheet chứa các biến lớp Tailwind: `"tailwindStylesheet": "src/app/styles/index.css"`.
- **Công cụ kiểm tra lỗi tĩnh (Linter)**: ESLint. Cấu hình thông qua tệp [eslint.config.js](file:///d:/Dev/Work/previewer/eslint.config.js):
  - Mở rộng các tập quy tắc flat config khuyến nghị dành cho JS (`js.configs.recommended`), TS (`tseslint.configs.recommended`), và React (`reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`).
- **Các quy tắc nghiêm ngặt được áp dụng**: Bắt buộc tuân thủ thứ tự khai báo React Hook, cấm ép kiểu `any` tùy ý, và yêu cầu khai báo rõ ràng kiểu dữ liệu nghiêm ngặt trong TypeScript.
- **Các câu lệnh vận hành**:
  - `npm run format` (tự động định dạng toàn bộ các tệp tin `.ts`, `.tsx` bằng Prettier).
  - `npm run lint` (quét lỗi và cảnh báo linter thông qua ESLint).
  - `npm run typecheck` (chạy trình biên dịch tsc kiểm tra lỗi kiểu dữ liệu).

### 3) Quy ước Import và Phân tách Module (Import and Module Conventions)

- **Thứ tự/Nhóm các lệnh import**: Tuân thủ chuẩn ES imports. Các thư viện CSS toàn cục và React core được khai báo trên cùng, tiếp theo là các đường dẫn import tuyệt đối bắt đầu bằng alias `@/`, và cuối cùng là các file layout tương đối cục bộ.
- **Quy định sử dụng Alias path**: Đường dẫn alias tuyệt đối `@/` trỏ tới `src/` là bắt buộc đối với tất cả các import liên lớp (ví dụ: `@/shared/ui/button`). Nghiêm cấm sử dụng import tương đối sâu (ví dụ: `../../shared/ui`) khi vượt qua ranh giới giữa các lớp kiến trúc.
- **Quy tắc xuất bản Public API (Barrel policy)**: Áp dụng tệp entry `index.ts` ở cấp độ ngoài cùng của các slices và segments. Các thư mục bên ngoài khi cần tương tác với slice chỉ được phép import thông qua tệp `index.ts` công khai này thay vì chọc sâu vào các file cấu trúc nội bộ của slice.

### 4) Quy ước Ghi log và Xử lý Lỗi (Error and Logging Conventions)

- **Chiến lược xử lý lỗi theo từng phân lớp**:
  - **Tầng gọi API**: Các truy vấn REST được bọc trong khối `try/catch` của TanStack Query (`queries.ts`). Khi kết nối bị lỗi hoặc server offline, hệ thống sẽ ghi log cảnh báo (`console.warn`) và tự động trả về các tập dữ liệu giả lập mẫu (`MOCK_COURSES`, `MOCK_LESSONS`, `MOCK_SLIDES`) để đảm bảo ứng dụng không bị lỗi ngắt quãng và vẫn chạy offline bình thường.
  - **Tầng tương tác UI**: Các thao tác trình duyệt có độ rủi ro (như kích hoạt phát âm thanh `audio.play()`) được bọc trong các promise `.catch()` để ghi log lỗi ngầm vào console thay vì gây treo luồng UI.
  - **Tầng xác thực Form/Quiz**: Trả lời câu hỏi thiếu thông tin hoặc sai định dạng sẽ kích hoạt modal cảnh báo UI (`setAlert` trong builder store hoặc `setActiveAlert` trong viewer page) thay vì sinh ra lỗi runtime phá hỏng ứng dụng.
- **Tự động tiêm Token JWT (JWT Auto-Injection)**: Mọi yêu cầu gọi API thông qua REST client `api.ts` đều đi qua bộ lọc chặn (interceptors) để lấy `accessToken` từ bộ nhớ của `useAuthStore` và tự động đính kèm vào tiêu đề `Authorization: Bearer <token>`.
- **Phong cách ghi log**: Các thao tác hệ thống (chuyển slide, nộp bài kiểm tra tương tác, làm mới phiên đăng nhập ngầm, nhấn hotspot, v.v.) được ghi nhận rõ ràng vào console trình duyệt thông qua `console.log()` để lập trình viên dễ dàng theo dõi và debug cục bộ. Dự án hiện chưa tích hợp nền tảng thu thập nhật ký tập trung bên thứ ba nào.
- **Quy định bảo mật dữ liệu nhạy cảm**: Mật khẩu và token chỉ truyền qua các kênh TLS an toàn. Refresh token được lưu trong Cookie và cấu hình cờ `SameSite=Lax` cùng cờ `Secure` trên môi trường production; Access token chỉ được duy trì trong bộ nhớ tạm thời của Zustand store để hạn chế tối đa rủi ro tấn công XSS.

### 5) Quy ước Kiểm thử (Testing Conventions)

- **Quy tắc đặt tên file/Thư mục test**: Không áp dụng. Dự án hiện chưa thiết lập bộ công cụ test tự động.
- **Chiến lược mock dữ liệu trong test**: Không áp dụng.
- **Kỳ vọng độ bao phủ kiểm thử (Coverage)**: Không áp dụng.

### 6) Minh chứng (Evidence)

- [eslint.config.js](file:///d:/Dev/Work/previewer/eslint.config.js)
- [.prettierrc](file:///d:/Dev/Work/previewer/.prettierrc)
- [tsconfig.app.json](file:///d:/Dev/Work/previewer/tsconfig.app.json) (Cấu hình kiểm tra kiểu dữ liệu nghiêm ngặt)
- [src/pages/builder/lib/use-action-runner.ts](file:///d:/Dev/Work/previewer/src/pages/builder/lib/use-action-runner.ts) (Cơ chế try/catch khi phát nhạc tương tác)
- [src/entities/element/index.ts](file:///d:/Dev/Work/previewer/src/entities/element/index.ts) (Tệp barrel file mẫu của lớp entities)
