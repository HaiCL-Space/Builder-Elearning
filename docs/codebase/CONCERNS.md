# CONCERNS - Rủi ro, Nợ kỹ thuật và Khuyến nghị phát triển

Tài liệu này vạch rõ các rủi ro hệ thống hiện hữu (Risks), nợ kỹ thuật (Technical Debt), các điểm nghẽn hiệu năng (Performance Hotspots) và đưa ra các khuyến nghị cải tiến kiến trúc cho dự án `previewer`.

---

## 1. Nợ kỹ thuật lớn nhất (Primary Technical Debt)

*   **Tệp tin trạng thái quá tải (Fat State File)**:
    *   *Trạng thái*: **ĐÃ GIẢI QUYẾT** 🌟
    *   *Chi tiết*: Trước đây, tệp [src/components/builder/index.tsx](file:///d:/Dev/Work/previewer/src/components/builder/index.tsx) vượt quá **640 dòng mã**, gánh vác quá nhiều vai trò. Hiện tại, toàn bộ quản lý trạng thái đã được chuyển giao cho **Zustand Store** cục bộ giúp rút gọn tệp tin xuống còn **425 dòng** có tổ chức, dễ bảo trì.
*   **Chưa tích hợp kiểm thử cục bộ (No Local Automated Tests)**:
    *   *Trạng thái*: **SƠ KHỞI (Đã có kế hoạch tích hợp)** ⚠️
    *   Ứng dụng hoàn toàn dựa vào việc kiểm thử thủ công (manual verification) thông qua tệp dữ liệu giả lập `mock-slides.ts` trên trình duyệt.
    *   *Khuyến nghị*: Sớm thực thi lộ trình cài đặt **Vitest** đã được định hình tại tài liệu [TESTING.md](file:///d:/Dev/Work/previewer/docs/codebase/TESTING.md).

---

## 2. Điểm nghẽn hiệu năng (Performance Hotspots)

*   **Hiệu năng Re-render trên Canvas**:
    *   *Trạng thái*: **ĐÃ GIẢI QUYẾT** ⚡
    *   *Chi tiết*: Trước đây, mọi thay đổi tọa độ nhỏ nhất đều re-render lại toàn bộ màn hình. Bằng cách tích hợp **Zustand**, chúng ta đã cô lập phạm vi cập nhật trạng thái (Fine-grained state updates) giúp tăng hiệu năng phản hồi UI cực lớn.
    *   *Khuyến nghị thêm*: Có thể sử dụng thêm `React.memo` cho các Element tĩnh (`text-element`, `video-element`) để tối ưu hóa triệt để chu kỳ render nếu props của chúng hoàn toàn không thay đổi.

---

## 3. Rủi ro về Logic & Tính toán Tọa độ (Coordinate Calculation Risks)

*   **Tính toán tỷ lệ phần trăm (%) tương đối trên Canvas**:
    *   Mọi tọa độ định vị (`x`, `y`, `width`, `height`) đều được lưu trữ dưới dạng số thực biểu thị tỷ lệ phần trăm (0 - 100) so với khung Canvas mẹ (theo chuẩn của SDK). Việc chuyển đổi từ pixel thực tế (nhận được từ sự kiện drag của chuột) sang tỷ lệ % này được tính toán thủ công dựa trên chiều rộng và chiều cao đo được bằng hàm `getBoundingClientRect()` của thẻ DOM Canvas mẹ.
    *   *Rủi ro*: Nếu kích thước màn hình trình duyệt bị thay đổi đột ngột (Resize cửa sổ), hoặc khi zoom trang web, kích thước pixel của Canvas thay đổi có thể dẫn tới sai lệch nhỏ về tính toán định vị hoặc tính toán guidelines căn thẳng hàng bị lệch vài pixel.

---

## 4. Rủi ro liên kết Thư viện SDK cục bộ (Local SDK Dependency Risk)

*   **Gói `@broker/core-sdk`**:
    *   Hiện đang được phát triển song song và tham chiếu trực tiếp trong thư mục `node_modules` cục bộ. Việc thiếu cơ chế quản lý phiên bản rõ ràng (như npm link hoặc monorepo workspace) có thể dẫn tới sự không đồng bộ về kiểu dữ liệu (TypeScript Types) giữa SDK và Previewer nếu SDK được cập nhật bởi một nhóm phát triển khác mà không cập nhật lại Previewer.

---

## Bằng chứng kiểm chứng (Evidence)

*   [src/components/builder/index.tsx](file:///d:/Dev/Work/previewer/src/components/builder/index.tsx): Chứa hơn 640 dòng mã quản lý hàng chục handler sự kiện khác nhau, là nguồn phát sinh re-render toàn màn hình lớn nhất.
*   [package.json](file:///d:/Dev/Work/previewer/package.json): Không có thư viện quản lý state chuyên dụng nào ngoài React hooks mặc định.
*   [src/components/builder/canvas/CanvasElement.tsx](file:///d:/Dev/Work/previewer/src/components/builder/canvas/CanvasElement.tsx): Thực hiện lắng nghe sự kiện kéo rê của chuột (`onMouseDown`) để tính toán tọa độ tương đối theo thời gian thực.
