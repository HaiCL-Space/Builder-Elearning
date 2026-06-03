# Công nghệ Sử dụng (Technology Stack)

## Các phần cốt lõi (Bắt buộc)

### 1) Tóm tắt Runtime (Runtime Summary)

| Lĩnh vực | Giá trị | Minh chứng (Evidence) |
|------|-------|----------|
| Ngôn ngữ chính | TypeScript v5.9.3 | `package.json` |
| Runtime & phiên bản | Node.js (thông qua `@types/node` v24.12.0) | `package.json` |
| Trình quản lý gói | npm v10+ (có `package-lock.json` v3) | `package-lock.json` |
| Hệ thống module/build | Vite v7.3.1 + Trình biên dịch TypeScript (`tsc`) | `package.json` |

### 2) Thư viện và Khung phát triển Production (Production Frameworks and Dependencies)

Dưới đây là danh sách các thư viện chính chạy trên môi trường production:

| Thư viện | Phiên bản | Vai trò trong hệ thống | Minh chứng |
|------------|---------|----------------|----------|
| React | ^19.2.4 | Thư viện giao diện chính (UI Core) | `package.json` |
| Tailwind CSS | ^4.2.1 | Framework định dạng CSS utility-first | `package.json` |
| @tailwindcss/vite | ^4.2.1 | Tích hợp và biên dịch Tailwind CSS với Vite | `package.json` |
| Zustand | ^5.0.13 | Quản lý trạng thái client toàn cục (Client Global State Store) | `package.json` |
| @tanstack/react-query | ^5.100.14 | Tải, lưu và đồng bộ dữ liệu từ server (Server State Management) | `package.json` |
| broker-core-sdk | ^1.0.7 | Thư viện lõi chứa logic trò chơi giáo dục tương tác và công cụ học tập | `package.json` |
| framer-motion | ^12.38.0 | Hiệu ứng chuyển động, kéo thả và thay đổi kích thước trên canvas | `package.json` |
| Radix UI | ^1.4.3 | Các thành phần giao diện không giao diện (headless) hỗ trợ khả năng tiếp cận (Accessibility) | `package.json` |
| Lucide React | ^1.14.0 | Bộ icon vector gọn nhẹ, sắc nét | `package.json` |
| Shadcn UI | ^4.7.0 | Bộ khung thành phần giao diện tái sử dụng dựa trên registry | `package.json` |
| tw-animate-css | ^1.4.0 | Thư viện hỗ trợ các vi chuyển động CSS | `package.json` |

### 3) Công cụ Phát triển (Development Toolchain)

| Công cụ | Mục đích | Minh chứng |
|------|---------|----------|
| ESLint v9.39.4 | Kiểm tra lỗi tĩnh và tiêu chuẩn mã nguồn | `package.json`, `eslint.config.js` |
| Prettier v3.8.1 | Tự động định dạng mã nguồn và sắp xếp class Tailwind | `package.json`, `.prettierrc` |
| TypeScript v5.9.3 | Ràng buộc kiểu dữ liệu tĩnh nghiêm ngặt và quản lý các tham chiếu dự án | `package.json`, `tsconfig.json` |
| Vite v7.3.1 | Máy chủ phát triển local hỗ trợ Hot Module Replacement (HMR) & đóng gói production | `package.json`, `vite.config.ts` |

### 4) Các Câu lệnh Chính (Key Commands)

```bash
# Cài đặt các thư viện/dependency
npm install

# Khởi chạy máy chủ phát triển Vite local
npm run dev

# Kiểm tra lỗi tĩnh với ESLint
npm run lint

# Định dạng lại code bằng Prettier
npm run format

# Kiểm tra kiểu dữ liệu TypeScript
npm run typecheck

# Biên dịch mã nguồn cho môi trường production
npm run build

# Xem thử bản build production tại máy local
npm run preview
```

### 5) Môi trường và Cấu hình (Environment and Config)

- **Nguồn cấu hình**: `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `.prettierrc`, `components.json`.
- **Biến môi trường bắt buộc**: `VITE_API_URL` (xác định endpoint của REST API, ví dụ `http://localhost:8001/v1` để kết nối với server backend; tự động fallback về dữ liệu mock nếu không kết nối được). Được tải qua tệp cấu hình `.env`.
- **Ràng buộc triển khai/runtime**: Ứng dụng Single Page Application (SPA) chạy hoàn toàn trên client-side. Yêu cầu trình duyệt hiện đại hỗ trợ JavaScript. Kết nối với các endpoint REST API backend nếu hoạt động, tự động fallback về mock data được lưu trữ cục bộ.

### 6) Minh chứng (Evidence)

- [package.json](file:///d:/Dev/Work/previewer/package.json)
- [package-lock.json](file:///d:/Dev/Work/previewer/package-lock.json)
- [vite.config.ts](file:///d:/Dev/Work/previewer/vite.config.ts)
- [tsconfig.app.json](file:///d:/Dev/Work/previewer/tsconfig.app.json)
- [.env](file:///d:/Dev/Work/previewer/.env)
