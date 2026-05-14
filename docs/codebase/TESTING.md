# TESTING - Quy trình và Kế hoạch kiểm thử (Testing Guide)

Tài liệu này trình bày chi tiết về hiện trạng kiểm thử (Testing status) của dự án `previewer`, hướng dẫn giả lập dữ liệu (mocking) và cung cấp một lộ trình (blueprint) để tích hợp bộ chạy thử nghiệm (test runner) vào ứng dụng trong tương lai.

---

## 1. Hiện trạng Kiểm thử (Current Testing State)

> [!NOTE]
> Dự án `previewer` hiện đang ở giai đoạn phát triển giao diện thiết kế trực quan ban đầu và **CHƯA cài đặt bộ chạy kiểm thử tự động trực tiếp** (như Jest hoặc Vitest) trong tệp `package.json`.

### Các điểm cần lưu ý:
*   **Mã nguồn ứng dụng**: Chưa có thư mục chứa mã kiểm thử (như `__tests__` hoặc `*.test.tsx`).
*   **@broker/core-sdk**: Có tích hợp sẵn công cụ kiểm thử **Vitest** (`"test": "vitest"`) để kiểm soát chất lượng của các bộ động cơ `gameEngine` và `learningEngine`. Do đó, logic nghiệp vụ cốt lõi đã được kiểm thử an toàn ở cấp độ SDK.

---

## 2. Hướng dẫn Giả lập Dữ liệu (Mocking Guide)

Để phục vụ phát triển độc lập và chạy thử giao diện một cách trực quan, hệ thống dựa vào một tệp mock slide cực kỳ chi tiết tại [src/lib/mock-slides.ts](file:///d:/Dev/Work/previewer/src/lib/mock-slides.ts). 

### Cấu trúc dữ liệu Mock:
*   Mảng dữ liệu giả lập chứa danh sách các Slide đa dạng, giúp kiểm chứng đầy đủ hiển thị và tương tác của toàn bộ các loại phần tử:
    1.  **Slide 1**: Kiểm thử phần tử Chữ (`TEXT`), Video (`VIDEO`) tự động chạy và Trắc nghiệm (`QUIZ`).
    2.  **Slide 2**: Kiểm thử tính năng tương tác Vùng Chạm (`HOTSPOT`) trên ảnh nền bản đồ, liên kết sự kiện chuyển slide động.
    3.  **Slide 3**: Kiểm thử tương tác Kéo Thả Sắp Xếp (`SORTING`) mốc thời gian lịch sử.
    4.  **Slide 4**: Kiểm thử trò chơi Ghép Cặp Từ Vựng (`MATCHING`) kết hợp hai cột trái/phải độc lập.

---

## 3. Lộ trình tích hợp Kiểm thử tự động (Testing Blueprint)

Khi có yêu cầu thiết lập kiểm thử tự động, lập trình viên hoặc AI nên thực hiện theo các bước chuẩn sau:

### Bước 1: Cài đặt các thư viện phụ thuộc (Dev Dependencies)
Khởi chạy lệnh cài đặt Vitest và React Testing Library:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

### Bước 2: Cập nhật cấu hình `vite.config.ts`
Bổ sung cấu hình môi trường test `jsdom`:
```typescript
import { defineConfig } from "vitest/config" // sử dụng defineConfig từ vitest để có kiểu gõ tốt hơn

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
})
```

### Bước 3: Tạo tệp Setup kiểm thử `src/test/setup.ts`
```typescript
import "@testing-library/jest-dom"
```

### Bước 4: Viết Test mẫu cho một Element Component (`src/components/elements/__tests__/text-element.test.tsx`)
```tsx
import { render, screen } from "@testing-library/react"
import { vi, describe, it, expect } from "vitest"
import TextElement from "../text-element"

describe("TextElement Component", () => {
  const mockElement = {
    id: "el-1",
    type: "TEXT" as const,
    position: { x: 10, y: 10, width: 50, height: 20 },
    data: { content: "Xin chào thế giới!" },
  }

  it("hiển thị đúng nội dung văn bản truyền vào", () => {
    const handleClick = vi.fn()
    render(
      <TextElement
        element={mockElement}
        baseStyle={{}}
        handleClick={handleClick}
      />
    )

    expect(screen.getByText("Xin chào thế giới!")).toBeInTheDocument()
  })
})
```

---

## Bằng chứng kiểm chứng (Evidence)

*   [package.json](file:///d:/Dev/Work/previewer/package.json): Xác thực phần `devDependencies` và `scripts` không chứa cấu hình test runner cục bộ.
*   [node_modules/@broker/core-sdk/package.json](file:///d:/Dev/Work/previewer/node_modules/@broker/core-sdk/package.json): Chứa cấu hình devDependencies `"vitest": "^4.1.5"` và lệnh test `"test": "vitest"`.
*   [src/lib/mock-slides.ts](file:///d:/Dev/Work/previewer/src/lib/mock-slides.ts): Tệp mock slides phong phú dùng để kiểm thử thủ công trực quan toàn bộ các tính năng tương tác của ứng dụng.
