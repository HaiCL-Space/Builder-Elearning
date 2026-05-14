# INTEGRATIONS - Tích hợp hệ thống và SDK bên ngoài

Tài liệu này cung cấp chi tiết về các điểm tích hợp bên ngoài, thư viện SDK lõi, API tiêu thụ và các hệ thống phụ trợ mà dự án `previewer` đang liên kết chặt chẽ.

---

## 1. Tích hợp Lõi với `@broker/core-sdk`

Đây là tích hợp quan trọng nhất của hệ thống. Ứng dụng hoạt động dựa trên bộ thư viện chuẩn hóa `@broker/core-sdk` được cài đặt trực tiếp trong môi trường npm cục bộ (`node_modules/@broker/core-sdk`).

### Các thành phần tích hợp chính:

*   **Hệ thống Định nghĩa Kiểu (TypeScript Types & Contracts)**:
    *   Hầu hết các kiểu dữ liệu sử dụng trong ứng dụng đều được import từ SDK này nhằm đảm bảo tính đồng bộ dữ liệu.
    *   *Các kiểu tiêu biểu*: `Slide` (đại diện cho một slide), `SlideElement` (mô hình phần tử), `ElementAction` (hành động tương tác), `MultipleChoiceData` (dữ liệu quiz), `SortingData`, `MatchingData`, `HotspotData`.
*   **Công cụ Chấm điểm và Xử lý Trò chơi (`gameEngine`)**:
    *   Được import trực tiếp tại `src/components/builder/index.tsx`.
    *   Dùng để đánh giá câu trả lời của học viên khi chạy thử slide ở chế độ tương tác (Interactive Play Mode) hoặc kiểm tra tính đúng đắn của một lượt nộp bài.
*   **Động cơ Học tập Lặp lại Ngắt quãng (`learningEngine`)**:
    *   Cung cấp các thuật toán Spaced Repetition (SRS) để tối ưu hóa việc ôn tập cho người học (như `calculateNextReview` và `checkMastery`).
    *   Giúp chấm điểm quá trình, tính toán độ thành thục (mastery) và đề xuất lượt học tiếp theo dựa trên kết quả thực hiện các slide câu hỏi/trò chơi tương tác.

---

## 2. Tích hợp Giao diện (Shadcn UI & Radix UI Primitives)

Màn hình thiết kế và xem trước sử dụng kết hợp giữa Radix UI Primitives (headless components) và Shadcn UI để tạo ra các component chất lượng cao, dễ tùy biến:

*   **Tích hợp `components.json`**:
    *   File cấu hình ở thư mục gốc chứa các cài đặt cấu trúc thư mục của shadcn: alias `@/*` trỏ tới `src`, thư mục chứa components dùng chung `src/components`, thư mục chứa các hàm tiện ích `src/lib/utils.ts`.
    *   Cấu hình này hỗ trợ cài đặt tự động các component shadcn mới mà không làm gãy kiến trúc dự án.
*   **Radix UI**:
    *   Tích hợp `@radix-ui/react-radio-group` và các gói radix khác để xây dựng nền tảng tương tác trắc nghiệm mượt mà, đầy đủ tính năng accessible và bàn phím.
    *   Tích hợp thư viện `@radix-ui/react-slot` hỗ trợ tính năng chuyển đổi thẻ linh hoạt (`asChild`) trong `<Button />`.

---

## 3. Tích hợp Bundler & CSS (Vite 7 + Tailwind CSS v4)

Kiến trúc biên dịch sử dụng công nghệ mới nhất để tối ưu hóa hiệu năng render giao diện:

*   **`@tailwindcss/vite`**:
    *   Hoạt động như một Vite plugin biên dịch trực tiếp ở mức độ compiler thay vì chạy một bộ sinh CSS (postcss) riêng lẻ. Điều này giúp đẩy tốc độ HMR lên tối đa.
*   **Import CSS động**:
    *   Tích hợp `@fontsource-variable/inter` giúp hệ thống nạp font Inter Variable chất lượng cao, tối ưu hóa kích thước tải trang nhờ chỉ tải các ký tự cần thiết.

---

## 4. Tích hợp Tài nguyên Ngoài (External Media & Asset Sources)

Ứng dụng hỗ trợ liên kết động với các nguồn tài nguyên đa phương tiện ngoài:

*   **Video Element**: Chấp nhận mọi luồng video trực tiếp dạng tệp tin từ xa (Ví dụ: `.mp4` từ CDN hoặc máy chủ học tập SaaS).
*   **Image Hotspot**: Cho phép tải ảnh nền canvas tùy biến từ các địa chỉ URL ngoài, ánh xạ tọa độ tuyệt đối (%) của các vùng chạm (Hotspot zones) lên trên bức ảnh đó.

---

## Bằng chứng kiểm chứng (Evidence)

*   [node_modules/@broker/core-sdk/package.json](file:///d:/Dev/Work/previewer/node_modules/@broker/core-sdk/package.json): Xác thực sự tồn tại của thư viện SDK cục bộ.
*   [components.json](file:///d:/Dev/Work/previewer/components.json): Khai báo cấu hình tích hợp Shadcn UI.
*   [src/components/builder/index.tsx](file:///d:/Dev/Work/previewer/src/components/builder/index.tsx): Chứa lệnh import cụ thể `import { learningEngine, gameEngine } from "@broker/core-sdk"`.
*   [vite.config.ts](file:///d:/Dev/Work/previewer/vite.config.ts): Import trực tiếp plugin `tailwindcss` và `react`.
