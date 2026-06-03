# Quy trình Kiểm thử (Testing Patterns)

## Các phần cốt lõi (Bắt buộc)

### 1) Công cụ và Câu lệnh Kiểm thử (Test Stack and Commands)

- **Khung kiểm thử chủ đạo**: Không có. Dự án hiện tại không cấu hình bất kỳ công cụ hoặc khung kiểm thử tự động nào.
- **Thư viện Mocking / Khẳng định (Assertion)**: Không có.
- **Các câu lệnh vận hành**: Không có. Không có câu lệnh script chạy test nào được định nghĩa trong tệp [package.json](file:///d:/Dev/Work/previewer/package.json).

```bash
# Không có bộ công cụ kiểm thử tự động nào được thiết lập trong dự án này.
```

### 2) Bố cục Mã nguồn Kiểm thử (Test Layout)

- **Quy tắc tổ chức tệp kiểm thử**: Không áp dụng. Không có tệp tin test nào tồn tại trong mã nguồn dự án.
- **Quy tắc đặt tên file test**: Không áp dụng.
- **Các tệp tin thiết lập chạy test**: Không áp dụng.

### 3) Ma trận Phạm vi Kiểm thử (Test Scope Matrix)

| Phạm vi kiểm thử | Có bao phủ không? | Đối tượng kiểm thử thông thường | Ghi chú |
|---|---|---|---|
| Đơn vị (Unit) | **Không** | Các hàm xử lý tiện ích cục bộ (`src/shared/lib/utils.ts`) | Khuyến nghị nên viết test đơn vị cho các thuật toán tính toán nghiệp vụ cốt lõi. |
| Tích hợp (Integration) | **Không** | Luồng xử lý hành động tương tác (`useActionRunner.ts`, Zustand state store) | Khuyến nghị nên viết test tích hợp để kiểm tra đột biến trạng thái store và các thuật toán tính lặp lại ngắt quãng. |
| Hệ thống (E2E) | **Không** | Luồng thiết kế bài giảng hoàn chỉnh và luồng trình chiếu của người học | Khuyến nghị nên kiểm tra tự động các thao tác kéo thả xác định tọa độ và tương tác trò chơi thực tế. |

### 4) Chiến lược Cô lập và Mock dữ liệu (Mocking and Isolation Strategy)

- **Phương pháp mock chủ yếu**: Không áp dụng. Không thiết lập môi trường test.
- **Đảm bảo tính cô lập dữ liệu**: Không áp dụng.
- **Các lỗi thường gặp trong kiểm thử**: Không áp dụng.

### 5) Chỉ số Chất lượng và Độ bao phủ (Coverage and Quality Signals)

- **Công cụ đo coverage và ngưỡng yêu cầu**: Không có.
- **Tỷ lệ bao phủ kiểm thử hiện tại**: **0%** (Toàn bộ mã nguồn dự án chưa được bao phủ bởi bất kỳ bài kiểm tra tự động nào).
- **Các khoảng trống/vùng kiểm thử không ổn định**: Trống hoàn toàn. Khách hàng đã đưa ra định hướng chính thức rằng kiểm thử tự động không phải là một yêu cầu bắt buộc của dự án tại thời điểm hiện tại.

### 6) Minh chứng (Evidence)

- [package.json](file:///d:/Dev/Work/previewer/package.json) (Không tồn tại các gói thư viện kiểm thử tự động hoặc lệnh chạy test).
