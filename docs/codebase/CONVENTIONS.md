# CONVENTIONS - Quy chuẩn viết mã nguồn (Coding Standard & Conventions)

Tài liệu này định nghĩa tất cả các quy tắc, phong cách lập trình (Coding styles), quy ước đặt tên và tiêu chuẩn kỹ thuật bắt buộc phải tuân thủ khi chỉnh sửa hoặc viết mã nguồn mới cho dự án `previewer`. Các AI phát triển dự án sau này PHẢI đọc kỹ và tuân thủ tuyệt đối bộ quy tắc dưới đây.

---

## 1. Kiến trúc Thành phần (Architecture & Component Standards)

*   **Chỉ sử dụng Functional Components và React Hooks**: Tuyệt đối không sử dụng Class Components.
*   **Nguyên lý Đơn Nhiệm (Single Responsibility Principle - SRP)**: 
    *   Mỗi component chỉ làm đúng một việc duy nhất.
    *   Nếu dung lượng một tệp component vượt quá **150 dòng mã**, bắt buộc phải đề xuất tách nhỏ thành các sub-components hoặc trích xuất logic nghiệp vụ phức tạp ra các **Custom Hooks** riêng biệt.
*   **Tách biệt logic nghiệp vụ (Logic Separation)**:
    *   Tách biệt triệt để phần xử lý dữ liệu/state/gọi API khỏi phần giao diện hiển thị (UI JSX).
    *   Sử dụng Custom Hooks để đóng gói các logic xử lý phức tạp, các lời gọi API hay các hàm biến đổi dữ liệu.

---

## 2. Quy tắc Đặt tên (Naming Conventions)

*   **Tệp tin và Component**: Sử dụng **PascalCase** cho cả tên tệp và tên hàm thành phần (Ví dụ: `UserProfile.tsx`, `SlideBuilder.tsx`, `CanvasElement.tsx`).
*   **Biến, Props và Hàm**: Sử dụng **camelCase** (Ví dụ: `selectedElementId`, `currentSlide`, `onUpdateData`).
*   **Biến Logic (Booleans)**: Bắt buộc sử dụng tiền tố **`is`**, **`has`**, hoặc **`should`** để biểu thị giá trị logic (Ví dụ: `isInteractiveMode`, `hasAccess`, `shouldRenderGrid`).
*   **Hàm xử lý Sự kiện (Event Handlers)**:
    *   Sử dụng tiền tố **`handle`** cho các hàm trực tiếp xử lý sự kiện trong chính thành phần đó (Ví dụ: `handleDragStart`, `handleDeleteElement`).
    *   Sử dụng tiền tố **`on`** cho các callback được truyền từ component cha qua props xuống component con (Ví dụ: `onUpdateStyle`, `onSelectElement`).

---

## 3. Tiêu chuẩn TypeScript (TypeScript Standards)

*   **Không sử dụng kiểu `any`**:
    *   Tuyệt đối cấm sử dụng kiểu `any` trong toàn bộ dự án.
    *   Nếu kiểu dữ liệu là động hoặc chưa xác định rõ, sử dụng `unknown` kết hợp với kiểm tra kiểu (Type Guards) hoặc sử dụng các lớp đối tượng Generics thích hợp.
*   **Định nghĩa tường minh Interface/Type**:
    *   Mọi component có Props hoặc State đều phải khai báo Interface hoặc Type rõ ràng để hỗ trợ kiểm tra kiểu tĩnh và autocompletion trên IDE (Ví dụ: `interface CanvasProps { ... }`).
    *   Kế thừa tối đa các định nghĩa kiểu có sẵn từ thư viện gốc `@broker/core-sdk` thông qua các lệnh import cụ thể.

---

## 4. Quản lý Props & State (Props & State Management)

*   **Destructuring Props**: Luôn luôn giải nén props trực tiếp ngay trong chữ ký hàm của component (function signature) thay vì đọc gián tiếp từ tham số.
    ```tsx
    // CHUẨN:
    export function LeftSidebar({ slides, activeSlideId, onSelectSlide }: LeftSidebarProps) { ... }
    ```
*   **Giá trị mặc định cho Props**: Sử dụng cú pháp gán mặc định của ES6 ngay trong phần destructuring, tuyệt đối không dùng thuộc tính lỗi thời `defaultProps`.
*   **Hạn chế Prop Drilling**: Tuyệt đối không truyền props sâu quá **3 cấp**. Nếu cần truyền sâu hơn, đề xuất tái cấu trúc dữ liệu hoặc áp dụng các giải pháp quản lý trạng thái như React Context API hoặc thư viện lightweight như Zustand.
*   **Cập nhật State bằng Functional Update**: Luôn sử dụng cú pháp cập nhật functional update khi state mới phụ thuộc trực tiếp vào giá trị state cũ để tránh các lỗi bất đồng bộ.
    ```tsx
    // CHUẨN:
    setCount(prev => prev + 1);
    ```
*   **Giới hạn phạm vi State**: Giữ cho state ở cấp độ cục bộ (local state) sâu nhất có thể để ngăn chặn hiện tượng re-render dư thừa cho các component cha không liên quan.

---

## 5. Tiêu chuẩn JSX và Sạch mã (JSX & Code Cleanliness)

*   **Tránh các toán tử ba ngôi (ternary operators) lồng nhau**:
    *   Tuyệt đối không viết các toán tử 3 ngôi lồng nhau phức tạp bên trong khối lệnh return JSX.
    *   Hãy tính toán trước các giá trị phái sinh hoặc gán các khối JSX con vào các biến điều kiện bên trên khối lệnh return.
*   **Sử dụng React Fragment `<> ... </>`**: Thay thế các thẻ bao bọc dư thừa như `<div>` bằng React Fragment để giảm độ sâu của cây DOM trình duyệt, trừ khi thẻ `<div>` đó thực sự mang nhiệm vụ thiết kế style hay bố cục layout.
*   **Không sử dụng Array Index làm Key**:
    *   Khi render danh sách mảng (`map()`), luôn luôn sử dụng một thuộc tính ID duy nhất và ổn định để làm khóa `key`.
    *   Tuyệt đối không sử dụng index của vòng lặp làm `key` cho các danh sách động có khả năng thay đổi số lượng, sắp xếp lại hoặc xóa bớt phần tử.
*   **Áp dụng Early Returns (Trả về sớm)**:
    *   Xử lý các điều kiện lỗi, trạng thái rỗng hoặc trạng thái loading ngay đầu hàm bằng cơ chế Early Return để tránh các cấu trúc rẽ nhánh `if-else` lồng nhau sâu trong JSX chính.
*   **Tối ưu hóa hiệu năng đúng lúc**: Chỉ sử dụng `useMemo` và `useCallback` khi có kiểm chứng rõ ràng về cải thiện hiệu năng đo đạc được, hoặc để duy trì tính toàn vẹn tham chiếu (referential integrity) cho mảng phụ thuộc (dependency array) của các hook khác. Không lạm dụng bừa bãi.
*   **Dọn dẹp mã nguồn trước khi commit**:
    *   Tuyệt đối không để lại các dòng lệnh `console.log(...)` dư thừa.
    *   Loại bỏ hoàn toàn các đoạn mã bị comment không sử dụng hoặc các thư viện import dư thừa (Unused imports).

---

## Bằng chứng kiểm chứng (Evidence)

*   [src/components/builder/index.tsx](file:///d:/Dev/Work/previewer/src/components/builder/index.tsx): Tuân thủ nghiêm ngặt Early Return, không có Class component, gán key ổn định (element.id).
*   [src/components/ui/button.tsx](file:///d:/Dev/Work/previewer/src/components/ui/button.tsx): Khai báo kiểu TypeScript rõ ràng, destructuring props đầy đủ, sử dụng CVA sạch sẽ.
*   [eslint.config.js](file:///d:/Dev/Work/previewer/eslint.config.js): Cấu hình ESLint bắt lỗi chặt chẽ, đặc biệt là các quy tắc về React Hooks (`reactHooks.configs.flat.recommended`).
