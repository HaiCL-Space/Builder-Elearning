import { ACTION_TRIGGERS, ACTION_TYPES, type Slide } from "broker-core-sdk"

export const MOCK_SLIDES: Slide[] = [
  // =========================================================================
  // SLIDE 1: GIỚI THIỆU CHUNG (THEME DARK)
  // =========================================================================
  {
    id: "slide-bds-intro",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 1,
    config: { aspectRatio: "16:9", theme: "dark" },
    elements: [
      {
        id: "el-text-title-1",
        type: "TEXT",
        position: { x: 10, y: 15, w: 80, h: 22 },
        style: {
          fontSize: 32,
          textAlign: "center",
          color: "#fbbf24", // Gold color for dark theme
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 800, delay: 0 },
        exitAnimation: { type: "fade-in", duration: 300, delay: 0 },
        data: {
          content: "LUẬT KINH DOANH BẤT ĐỘNG SẢN 2023",
        },
      },
      {
        id: "el-text-subtitle-1",
        type: "TEXT",
        position: { x: 10, y: 38, w: 80, h: 16 },
        style: {
          fontSize: 18,
          textAlign: "center",
          color: "#ffffff",
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 0.9,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 800, delay: 200 },
        exitAnimation: { type: "fade-in", duration: 300, delay: 0 },
        data: {
          content:
            "Đề cương bài học chuyên sâu về cột mốc hoàn thiện thể chế & chuyên nghiệp hóa thị trường",
        },
      },
      {
        id: "el-text-info-1",
        type: "TEXT",
        position: { x: 15, y: 56, w: 70, h: 10 },
        style: {
          fontSize: 14,
          textAlign: "center",
          color: "#94a3b8", // Muted slate-400
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 0.8,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 800, delay: 400 },
        exitAnimation: { type: "fade-in", duration: 300, delay: 0 },
        data: {
          content:
            "Hiệu lực thi hành: Từ ngày 01/08/2024 (Sửa đổi bổ sung bởi Luật số 43/2024/QH15)",
        },
      },
      {
        id: "el-btn-next-1",
        type: "TEXT",
        position: { x: 38, y: 72, w: 24, h: 10 },
        style: {
          backgroundColor: "#d97706", // warm amber-600
          color: "#ffffff",
          fontSize: 15,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "bounce", duration: 600, delay: 600 },
        data: {
          content: "Bắt đầu khóa học ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 2: NGUYÊN TẮC HOẠT ĐỘNG & KHÁI NIỆM (THEME LIGHT)
  // =========================================================================
  {
    id: "slide-bds-principles",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 2,
    config: { aspectRatio: "16:9", theme: "light" },
    elements: [
      {
        id: "el-text-title-2",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#1e3a8a", // Navy color for light theme
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "1. KHÁI NIỆM CỐT LÕI & NGUYÊN TẮC TỐI CAO",
        },
      },
      {
        id: "el-text-info-2",
        type: "TEXT",
        position: { x: 10, y: 16, w: 80, h: 22 },
        style: {
          fontSize: 13,
          color: "#334155",
          backgroundColor: "#f1f5f9",
          borderRadius: 12,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "fade-in", duration: 600, delay: 150 },
        data: {
          content:
            "• Kinh doanh BĐS: Hoạt động bỏ vốn để tạo lập nhà ở, công trình xây dựng, quyền sử dụng đất đã có hạ tầng kỹ thuật trong dự án nhằm mục đích tìm kiếm lợi nhuận.\n• 3 Nguyên tắc (Điều 4): (1) Công khai, minh bạch; (2) Tự do thỏa thuận không vi phạm điều cấm của luật; (3) BĐS đưa vào kinh doanh phải đủ điều kiện luật định.",
        },
      },
      {
        id: "el-quiz-principles",
        type: "QUIZ",
        position: { x: 10, y: 40, w: 80, h: 40 },
        style: {
          borderRadius: 12,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "slide-up", duration: 600, delay: 300 },
        data: {
          question:
            "Điểm thay đổi đột phá thể hiện sự tôn trọng tự do ý chí trong nguyên tắc hoạt động kinh doanh BĐS của Luật 2023 là gì?",
          options: [
            {
              id: "opt-a",
              content:
                "Chuyển từ 'không trái quy định pháp luật' sang 'không vi phạm điều cấm của luật'",
            },
            {
              id: "opt-b",
              content:
                "Bắt buộc mọi giao dịch nhà đất phải thực hiện qua sàn giao dịch tập trung",
            },
            {
              id: "opt-c",
              content:
                "Cho phép doanh nghiệp tự do kinh doanh ngoài phạm vi quốc phòng, an ninh mà không cần bất kỳ điều kiện gì",
            },
          ],
          correctId: "opt-a",
        },
      },
      {
        id: "el-btn-submit-2",
        type: "TEXT",
        position: { x: 30, y: 84, w: 18, h: 9 },
        style: {
          backgroundColor: "#10b981", // emerald-500
          color: "#ffffff",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "bounce", duration: 500, delay: 450 },
        data: {
          content: "Kiểm tra đáp án",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.EVALUATE_ANSWER,
            payload: {
              targetElementId: "el-quiz-principles",
              conceptId: "concept-law-principles",
            },
          },
        ],
      },
      {
        id: "el-btn-next-2",
        type: "TEXT",
        position: { x: 52, y: 84, w: 18, h: 9 },
        style: {
          backgroundColor: "#2563eb", // blue-600
          color: "#ffffff",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 500 },
        data: {
          content: "Tiếp theo ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 3: NĂNG LỰC TÀI CHÍNH CHỦ ĐẦU TƯ (THEME SUNSET)
  // =========================================================================
  {
    id: "slide-bds-finance",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 3,
    config: { aspectRatio: "16:9", theme: "sunset" },
    elements: [
      {
        id: "el-text-title-3",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#7c2d12", // orange-950
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "2. NĂNG LỰC TÀI CHÍNH CỦA CHỦ ĐẦU TƯ DỰ ÁN",
        },
      },
      {
        id: "el-text-subtitle-3",
        type: "TEXT",
        position: { x: 10, y: 15, w: 80, h: 8 },
        style: {
          fontSize: 14,
          textAlign: "center",
          color: "#9a3412", // orange-800
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 100 },
        data: {
          content:
            "Ghép nối quy mô sử dụng đất và giới hạn với tỷ lệ vốn chủ sở hữu / đặt cọc tương ứng theo Luật 2023:",
        },
      },
      {
        id: "el-matching-finance",
        type: "MATCHING",
        position: { x: 10, y: 24, w: 80, h: 52 },
        style: {
          borderRadius: 12,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "slide-up", duration: 600, delay: 200 },
        data: {
          leftColumn: [
            { id: "fn-l1", content: "Dự án sử dụng đất quy mô dưới 20 ha" },
            {
              id: "fn-l2",
              content: "Dự án sử dụng đất quy mô từ 20 ha trở lên",
            },
            {
              id: "fn-l3",
              content: "Hạn mức nhận tiền đặt cọc trước khi ký hợp đồng",
            },
          ],
          rightColumn: [
            { id: "fn-r1", content: "Vốn chủ sở hữu tối thiểu 15% tổng vốn" },
            { id: "fn-r2", content: "Tối đa 5% giá bán, cho thuê mua" },
            { id: "fn-r3", content: "Vốn chủ sở hữu tối thiểu 20% tổng vốn" },
          ],
          correctPairs: [
            ["fn-l1", "fn-r3"],
            ["fn-l2", "fn-r1"],
            ["fn-l3", "fn-r2"],
          ],
        },
      },
      {
        id: "el-btn-submit-3",
        type: "TEXT",
        position: { x: 30, y: 79, w: 18, h: 9 },
        style: {
          backgroundColor: "#c2410c", // orange-700
          color: "#ffffff",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "bounce", duration: 500, delay: 350 },
        data: {
          content: "Nộp bài tự động",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.EVALUATE_ANSWER,
            payload: {
              targetElementId: "el-matching-finance",
              conceptId: "concept-law-finance",
            },
          },
        ],
      },
      {
        id: "el-btn-next-3",
        type: "TEXT",
        position: { x: 52, y: 79, w: 18, h: 9 },
        style: {
          backgroundColor: "#2563eb", // blue-600
          color: "#ffffff",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 400 },
        data: {
          content: "Tiếp theo ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 4: TIẾN ĐỘ THANH TOÁN (THEME OCEAN)
  // =========================================================================
  {
    id: "slide-bds-payments",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 4,
    config: { aspectRatio: "16:9", theme: "ocean" },
    elements: [
      {
        id: "el-text-title-4",
        type: "TEXT",
        position: { x: 10, y: 3, w: 80, h: 12 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#0c4a6e", // sky-950
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "3. HẠN MỨC THANH TOÁN BĐS HÌNH THÀNH TRONG TƯƠNG LAI",
        },
      },
      {
        id: "el-text-instr-4",
        type: "TEXT",
        position: { x: 10, y: 15, w: 80, h: 8 },
        style: {
          fontSize: 14,
          color: "#0284c7", // sky-600
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 100 },
        data: {
          content:
            "Kéo thả các sự kiện dưới đây theo đúng trình tự tiến độ thanh toán tối đa của khách hàng từ trước đến sau:",
        },
      },
      {
        id: "el-sorting-payment",
        type: "SORTING",
        position: { x: 15, y: 24, w: 70, h: 55 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "slide-up", duration: 600, delay: 200 },
        data: {
          items: [
            {
              id: "evt-1",
              content:
                "Đặt cọc giữ chỗ khi nhà ở đủ điều kiện kinh doanh (Tối đa 5% giá trị)",
            },
            {
              id: "evt-2",
              content:
                "Thanh toán đợt đầu bao gồm cả tiền đặt cọc đã đóng trước đó (Tối đa 30% giá trị)",
            },
            {
              id: "evt-3",
              content:
                "Thanh toán lũy kế trước khi chủ đầu tư bàn giao nhà ở thương mại (Tối đa 70% giá trị)",
            },
          ],
          correctOrder: ["evt-1", "evt-2", "evt-3"],
        },
      },
      {
        id: "el-btn-next-4",
        type: "TEXT",
        position: { x: 41, y: 85, w: 18, h: 9 },
        style: {
          backgroundColor: "#0284c7", // sky-600
          color: "#ffffff",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 400 },
        data: {
          content: "Tiếp theo ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 5: SIẾT CHẶT PHÂN LÔ BÁN NỀN (THEME NEON)
  // =========================================================================
  {
    id: "slide-bds-subdivision",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 5,
    config: { aspectRatio: "16:9", theme: "neon" },
    elements: [
      {
        id: "el-text-title-5",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#fbbf24", // amber-400
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "4. CẤM PHÂN LÔ BÁN NỀN TẠI 105 ĐÔ THỊ",
        },
      },
      {
        id: "el-text-desc-5",
        type: "TEXT",
        position: { x: 15, y: 16, w: 70, h: 18 },
        style: {
          fontSize: 13,
          color: "#e2e8f0",
          backgroundColor: "rgba(18, 10, 42, 0.6)",
          borderRadius: 12,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 100 },
        data: {
          content:
            "Luật 2023 cấm phân lô, bán nền tại các phường, quận, thành phố thuộc đô thị loại đặc biệt, loại I, loại II và loại III (tổng cộng 105 thành phố, thị xã). Tại các vùng còn lại, đất nền chỉ được bán khi đã hoàn thành xây dựng hạ tầng kỹ thuật đồng bộ và do chủ đầu tư trực tiếp chuyển nhượng.",
        },
      },
      {
        id: "el-swipe-subdivision",
        type: "SWIPE",
        position: { x: 20, y: 33, w: 60, h: 58 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "bounce", duration: 800, delay: 200 },
        data: {
          statement:
            "Hành vi cá nhân tự ý phân lô, tách thửa đất nền để tự do bán không cần lập dự án đầu tư theo quy hoạch ở khu vực nông thôn (đô thị loại IV, V) là được phép theo Luật 2023.",
          correctDirection: "left", // False statement, only official developers of approved projects can sell subdivided plots
        },
      },
      {
        id: "el-btn-next-5",
        type: "TEXT",
        position: { x: 41, y: 92, w: 18, h: 8 },
        style: {
          backgroundColor: "#c084fc", // purple-400
          color: "#090514",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 400 },
        data: {
          content: "Tiếp theo ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 6: CHUYÊN NGHIỆP HÓA MÔI GIỚI (THEME CLASSIC)
  // =========================================================================
  {
    id: "slide-bds-brokerage",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 6,
    config: { aspectRatio: "16:9", theme: "classic" },
    elements: [
      {
        id: "el-text-title-6",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#be123c", // rose-700
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "5. CHUYÊN NGHIỆP HÓA MÔI GIỚI BẤT ĐỘNG SẢN",
        },
      },
      {
        id: "el-text-desc-6",
        type: "TEXT",
        position: { x: 15, y: 16, w: 70, h: 16 },
        style: {
          fontSize: 13,
          color: "#4f4f4f",
          backgroundColor: "#f5f5f5",
          borderRadius: 10,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 100 },
        data: {
          content:
            "Cá nhân hành nghề môi giới bắt buộc phải có chứng chỉ hành nghề và phải làm việc chính quy tại một doanh nghiệp môi giới hoặc sàn giao dịch bất động sản hợp pháp. Cá nhân cấm hành nghề môi giới độc lập tự do như trước.",
        },
      },
      {
        id: "el-fb-brokerage",
        type: "FILL_BLANK",
        position: { x: 15, y: 35, w: 70, h: 42 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "zoom-in", duration: 600, delay: 200 },
        data: {
          question:
            "Theo quy định tài chính mới, lệ phí chính thức cấp Chứng chỉ hành nghề môi giới bất động sản là bao nhiêu đồng? (Ví dụ: 300000)",
          correctAnswers: [
            "300000",
            "300.000",
            "ba trăm nghìn",
            "ba trăm ngàn",
          ],
          caseSensitive: false,
        },
      },
      {
        id: "el-btn-next-6",
        type: "TEXT",
        position: { x: 41, y: 80, w: 18, h: 9 },
        style: {
          backgroundColor: "#be123c", // rose-700
          color: "#ffffff",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 400 },
        data: {
          content: "Tiếp theo ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 7: KHUYẾN NGHỊ THỰC TIỄN & ĐIỂM NÓNG (THEME DARK)
  // =========================================================================
  {
    id: "slide-bds-recommendations",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 7,
    config: { aspectRatio: "16:9", theme: "dark" },
    elements: [
      {
        id: "el-text-title-7",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 8 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#fbbf24", // Gold
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "6. KHUYẾN NGHỊ PHÁP LÝ & ĐIỂM NÓNG THỰC TIỄN",
        },
      },
      {
        id: "el-text-subtitle-7",
        type: "TEXT",
        position: { x: 10, y: 14, w: 80, h: 6 },
        style: {
          fontSize: 14,
          textAlign: "center",
          color: "#94a3b8",
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 100 },
        data: {
          content:
            "Nhấn vào vùng hình ảnh khu bất động sản để hiển thị khuyến nghị chi tiết:",
        },
      },
      {
        id: "el-hotspot-stakeholders",
        type: "HOTSPOT",
        position: { x: 10, y: 22, w: 42, h: 68 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "zoom-in", duration: 600, delay: 200 },
        data: {
          imageUri:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
          zones: [
            { id: "zone-developer", xMin: 5, yMin: 5, xMax: 95, yMax: 95 },
          ],
          correctZoneId: "zone-developer",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.TOGGLE_VISIBILITY,
            payload: {
              targetElementId: "el-feedback-card",
              action: "SHOW",
            },
          },
        ],
      },
      {
        id: "el-feedback-card",
        type: "TEXT",
        position: { x: 54, y: 22, w: 36, h: 68 },
        style: {
          backgroundColor: "#1e293b",
          color: "#f8fafc",
          fontSize: 13,
          borderRadius: 16,
          opacity: 0, // Mặc định ẩn, click hotspot sẽ hiện
          zIndex: 10,
          border: "1px solid #334155",
        },
        enterAnimation: { type: "fade-in", duration: 400, delay: 0 },
        data: {
          content:
            "💡 KHUYẾN NGHỊ THỰC TIỄN:\n\n• CHỦ ĐẦU TƯ: Duy trì tỷ lệ vốn chủ sở hữu đạt chuẩn (15%-20%) theo luật, tuyệt đối không huy động cọc quá 5% trước khi dự án đủ pháp lý kinh doanh.\n\n• NGƯỜI MUA: Cảnh giác pháp lý, luôn kiểm tra sự hiện diện của Thư bảo lãnh nghĩa vụ tài chính từ ngân hàng thương mại trước khi ký hợp đồng và giải ngân tiền.",
        },
      },
      {
        id: "el-btn-next-7",
        type: "TEXT",
        position: { x: 72, y: 92, w: 18, h: 7 },
        style: {
          backgroundColor: "#d97706", // warm amber-600
          color: "#ffffff",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 15,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 600 },
        data: {
          content: "Xem tiếp phóng sự ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 8: VIDEO PHÓNG SỰ BỐI CẢNH BAN HÀNH (THEME OCEAN)
  // =========================================================================
  {
    id: "slide-bds-video",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 8,
    config: { aspectRatio: "16:9", theme: "ocean" },
    elements: [
      {
        id: "el-text-title-8",
        type: "TEXT",
        position: { x: 10, y: 4, w: 80, h: 10 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#0c4a6e", // sky-950
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "7. PHIM TÀI LIỆU: CỘT MỐC PHÁP LÝ BẤT ĐỘNG SẢN 2023",
        },
      },
      {
        id: "el-text-desc-8",
        type: "TEXT",
        position: { x: 15, y: 15, w: 70, h: 8 },
        style: {
          fontSize: 14,
          textAlign: "center",
          color: "#0284c7", // sky-600
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 100 },
        data: {
          content:
            "Xem phóng sự ngắn dưới đây để nắm rõ bối cảnh hoàn thiện thể chế & chuyên nghiệp hóa thị trường:",
        },
      },
      {
        id: "el-video-documentary",
        type: "VIDEO",
        position: { x: 15, y: 25, w: 70, h: 54 },
        style: {
          borderRadius: 12,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "zoom-in", duration: 800, delay: 200 },
        data: {
          src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          autoPlay: false,
          muted: false,
          loop: false,
          controls: true,
          isLive: false,
        },
      },
      {
        id: "el-btn-next-8",
        type: "TEXT",
        position: { x: 41, y: 84, w: 18, h: 9 },
        style: {
          backgroundColor: "#0284c7", // sky-600
          color: "#ffffff",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 400 },
        data: {
          content: "Tiếp theo ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 9: TRÒ CHƠI LẬT THẺ PHÂN LOẠI HỢP ĐỒNG (THEME LIGHT)
  // =========================================================================
  {
    id: "slide-bds-memory",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 9,
    config: { aspectRatio: "16:9", theme: "light" },
    elements: [
      {
        id: "el-text-title-9",
        type: "TEXT",
        position: { x: 10, y: 0, w: 80, h: 10 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#1e3a8a", // Navy
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "8. TRÒ CHƠI LẬT THẺ: HỆ THỐNG HỢP ĐỒNG ĐIỀU 44",
        },
      },
      {
        id: "el-text-subtitle-9",
        type: "TEXT",
        position: { x: 10, y: 7, w: 80, h: 8 },
        style: {
          fontSize: 14,
          textAlign: "center",
          color: "#4b5563",
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 100 },
        data: {
          content:
            "Lật các thẻ dưới đây để tìm cặp loại hợp đồng mẫu tương đồng theo quy định pháp luật mới:",
        },
      },
      {
        id: "el-memory-contracts",
        type: "MEMORY_CARD",
        position: { x: 26, y: 14, w: 47, h: 71 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "zoom-in", duration: 600, delay: 200 },
        data: {
          cards: [
            { id: "c-1", value: "HĐ Mua bán nhà ở" },
            { id: "c-2", value: "HĐ Môi giới BĐS" },
            { id: "c-3", value: "HĐ Chuyển nhượng dự án" },
          ],
        },
      },
      {
        id: "el-btn-next-9",
        type: "TEXT",
        position: { x: 41, y: 88, w: 18, h: 9 },
        style: {
          backgroundColor: "#2563eb", // blue-600
          color: "#ffffff",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 400 },
        data: {
          content: "Tiếp theo ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 10: CHẠY ĐUA THỜI GIAN: ĐIỀU KIỆN MUA NHÀ Ở XÃ HỘI (THEME SUNSET)
  // =========================================================================
  {
    id: "slide-bds-sprint",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 10,
    config: { aspectRatio: "16:9", theme: "sunset" },
    elements: [
      {
        id: "el-text-title-10",
        type: "TEXT",
        position: { x: 10, y: 4, w: 80, h: 10 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#7c2d12", // orange-950
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "9. SPRINT NHANH: ĐIỀU KIỆN MUA NHÀ Ở XÃ HỘI",
        },
      },
      {
        id: "el-sprint-social-housing",
        type: "TIMED_SPRINT",
        position: { x: 15, y: 16, w: 70, h: 66 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "bounce", duration: 600, delay: 200 },
        data: {
          question:
            "Theo Nghị định 100/2024/NĐ-CP, trần thu nhập của cả vợ và chồng đã kết hôn để đủ điều kiện mua nhà ở xã hội là bao nhiêu?",
          options: [
            {
              id: "sprint-opt-1",
              content: "Tổng thu nhập ≤ 15 triệu đồng / tháng",
            },
            {
              id: "sprint-opt-2",
              content: "Tổng thu nhập ≤ 20 triệu đồng / tháng",
            },
            {
              id: "sprint-opt-3",
              content: "Tổng thu nhập ≤ 30 triệu đồng / tháng",
            },
            {
              id: "sprint-opt-4",
              content: "Tổng thu nhập ≤ 40 triệu đồng / tháng",
            },
          ],
          correctId: "sprint-opt-3",
          duration: 20,
        },
      },
      {
        id: "el-btn-next-10",
        type: "TEXT",
        position: { x: 41, y: 86, w: 18, h: 9 },
        style: {
          backgroundColor: "#c2410c", // orange-700
          color: "#ffffff",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 400 },
        data: {
          content: "Tiếp theo ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 11: GHÉP CHỮ PHÁP LÝ: NGUYÊN TẮC TỐI CAO (THEME NEON)
  // =========================================================================
  {
    id: "slide-bds-scramble",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 11,
    config: { aspectRatio: "16:9", theme: "neon" },
    elements: [
      {
        id: "el-text-title-11",
        type: "TEXT",
        position: { x: 10, y: 4, w: 80, h: 10 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#fbbf24", // amber-400
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "10. GHÉP CHỮ PHÁP LÝ: NGUYÊN TẮC TỐI CAO",
        },
      },
      {
        id: "el-text-subtitle-11",
        type: "TEXT",
        position: { x: 10, y: 15, w: 80, h: 8 },
        style: {
          fontSize: 14,
          textAlign: "center",
          color: "#cbd5e1",
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 100 },
        data: {
          content:
            "Sắp xếp các chữ cái xáo trộn dưới đây để tạo thành từ khóa chỉ nguyên tắc điều phối tối cao của Luật 2023:",
        },
      },
      {
        id: "el-scramble-principle",
        type: "WORD_SCRAMBLE",
        position: { x: 15, y: 25, w: 70, h: 52 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "bounce", duration: 800, delay: 200 },
        data: {
          scrambledWord: "HABHCNIM",
          correctWord: "MINHBACH",
          caseSensitive: false,
        },
      },
      {
        id: "el-btn-next-11",
        type: "TEXT",
        position: { x: 41, y: 82, w: 18, h: 9 },
        style: {
          backgroundColor: "#c084fc", // purple-400
          color: "#090514",
          fontSize: 13,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 400 },
        data: {
          content: "Tiếp theo ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },
  // =========================================================================
  // SLIDE 12: TRÒ CHƠI Ô CHỮ PHÁP LÝ (THEME NEON)
  // =========================================================================
  {
    id: "slide-bds-crossword",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 12,
    config: { aspectRatio: "16:9", theme: "neon" },
    elements: [
      {
        id: "el-text-title-12",
        type: "TEXT",
        position: { x: 10, y: 3, w: 80, h: 10 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#fbbf24", // Gold
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "11. THỬ THÁCH: Ô CHỮ PHÁP LÝ BẤT ĐỘNG SẢN",
        },
      },
      {
        id: "el-crossword-game",
        type: "CROSSWORD",
        position: { x: 15, y: 15, w: 70, h: 72 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "zoom-in", duration: 600, delay: 200 },
        data: {
          gridRows: 5,
          gridCols: 5,
          clues: [
            {
              id: "clue-1",
              number: 1,
              question: "Văn bản pháp lý cao nhất điều chỉnh hoạt động kinh doanh bất động sản (VD: ... Kinh doanh Bất động sản 2023)?",
              answer: "LUAT",
              row: 0,
              col: 2,
              direction: "down",
            },
            {
              id: "clue-2",
              number: 2,
              question: "Tính chất hợp pháp, tuân thủ đúng quy định của Nhà nước đối với dự án bất động sản (... lý dự án)?",
              answer: "PHAP",
              row: 2,
              col: 0,
              direction: "across",
            },
            {
              id: "clue-3",
              number: 3,
              question: "Tài sản thuộc nhóm bất động sản có quy mô sử dụng dưới hoặc trên 20 ha quy định tại Điều 4 (... nền, ... dự án)?",
              answer: "DAT",
              row: 3,
              col: 0,
              direction: "across",
            },
            {
              id: "clue-4",
              number: 4,
              question: "Khoản tiền phải nộp cho Nhà nước khi thực hiện các thủ tục cấp chứng chỉ hành nghề môi giới bất động sản (... cấp chứng chỉ)?",
              answer: "PHI",
              row: 2,
              col: 3,
              direction: "down",
            },
          ],
          caseSensitive: false,
        },
      },
      {
        id: "el-btn-next-12",
        type: "TEXT",
        position: { x: 41, y: 89, w: 18, h: 8 },
        style: {
          backgroundColor: "#c084fc", // purple-400
          color: "#090514",
          fontSize: 12,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 400 },
        data: {
          content: "Tiếp theo ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },
  // =========================================================================
  // SLIDE 13: KỊCH BẢN RẼ NHÁNH SỰ CỐ (THEME DARK)
  // =========================================================================
  {
    id: "slide-bds-branching",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 13,
    config: { aspectRatio: "16:9", theme: "dark" },
    elements: [
      {
        id: "el-text-title-13",
        type: "TEXT",
        position: { x: 10, y: 3, w: 80, h: 10 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#f59e0b", // Amber
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "12. KỊCH BẢN RẼ NHÁNH: XỬ LÝ SỰ CỐ MÁY CHỦ",
        },
      },
      {
        id: "el-branching-game",
        type: "BRANCHING",
        position: { x: 15, y: 15, w: 70, h: 72 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "zoom-in", duration: 600, delay: 200 },
        data: {
          startNodeId: "node-start",
          nodes: [
            {
              id: "node-start",
              title: "Khởi đầu kịch bản",
              content:
                "Bạn đang gặp sự cố trên máy chủ sản phẩm, bạn sẽ làm gì đầu tiên?",
              choices: [
                {
                  id: "choice-1",
                  text: "Kiểm tra log của hệ thống",
                  nextNodeId: "node-logs",
                },
                {
                  id: "choice-2",
                  text: "Khởi động lại máy chủ ngay lập tức",
                  nextNodeId: "node-reboot",
                },
              ],
            },
            {
              id: "node-logs",
              title: "Xem Logs",
              content:
                "Logs chỉ ra có sự cố rò rỉ bộ nhớ từ một commit gần đây. Bạn sẽ làm gì?",
              choices: [
                {
                  id: "choice-3",
                  text: "Rollback commit gần nhất",
                  nextNodeId: "node-rollback",
                },
                {
                  id: "choice-4",
                  text: "Bỏ qua và tiếp tục theo dõi",
                  nextNodeId: "node-reboot",
                },
              ],
            },
            {
              id: "node-rollback",
              title: "Rollback thành công!",
              content:
                "Hệ thống hoạt động bình thường trở lại. Bạn đã giải quyết sự cố tuyệt vời!",
              choices: [],
              isSuccessEnd: true,
            },
            {
              id: "node-reboot",
              title: "Khởi động thất bại",
              content:
                "Hệ thống bị sập hoàn toàn và dữ liệu chưa được sao lưu bị mất.",
              choices: [],
              isFailureEnd: true,
            },
          ],
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.EVALUATE_ANSWER,
            payload: {
              targetElementId: "el-branching-game",
              conceptId: "concept-bds-branching",
            },
          },
        ],
      },
      {
        id: "el-btn-next-13",
        type: "TEXT",
        position: { x: 41, y: 89, w: 18, h: 8 },
        style: {
          backgroundColor: "#f59e0b",
          color: "#ffffff",
          fontSize: 12,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 400 },
        data: {
          content: "Tiếp theo ➔",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { direction: "NEXT" },
          },
        ],
      },
    ],
  },
  // =========================================================================
  // SLIDE 14: TRÒ CHƠI DÁN NHÃN ĐỊA GIỚI (THEME SUNSET)
  // =========================================================================
  {
    id: "slide-bds-labelimage",
    tenant_id: "tenant-demo",
    course_id: "course-bds",
    order: 14,
    config: { aspectRatio: "16:9", theme: "sunset" },
    elements: [
      {
        id: "el-text-title-14",
        type: "TEXT",
        position: { x: 10, y: 3, w: 80, h: 10 },
        style: {
          fontSize: 24,
          textAlign: "center",
          color: "#7c2d12", // orange-950
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "13. THỬ THÁCH: DÁN NHÃN ĐỊA GIỚI TỰ NHIÊN",
        },
      },
      {
        id: "el-labelimage-game",
        type: "LABEL_IMAGE",
        position: { x: 15, y: 15, w: 70, h: 72 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "zoom-in", duration: 600, delay: 200 },
        data: {
          imageUri:
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60",
          labels: [
            { id: "lbl-sky", content: "Bầu trời" },
            { id: "lbl-lake", content: "Hồ nước" },
            { id: "lbl-mountain", content: "Ngọn núi" },
          ],
          zones: [
            {
              id: "zone-sky",
              xMin: 5,
              yMin: 5,
              xMax: 95,
              yMax: 30,
              correctLabelId: "lbl-sky",
            },
            {
              id: "zone-mountain",
              xMin: 20,
              yMin: 35,
              xMax: 80,
              yMax: 65,
              correctLabelId: "lbl-mountain",
            },
            {
              id: "zone-lake",
              xMin: 5,
              yMin: 70,
              xMax: 95,
              yMax: 95,
              correctLabelId: "lbl-lake",
            },
          ],
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.EVALUATE_ANSWER,
            payload: {
              targetElementId: "el-labelimage-game",
              conceptId: "concept-bds-labelimage",
            },
          },
        ],
      },
      {
        id: "el-btn-finish-14",
        type: "TEXT",
        position: { x: 41, y: 89, w: 18, h: 8 },
        style: {
          backgroundColor: "#c2410c", // orange-700
          color: "#ffffff",
          fontSize: 12,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 400 },
        data: {
          content: "Quay lại từ đầu ↺",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.NAVIGATE_SLIDE,
            payload: { targetSlideId: "slide-bds-intro" },
          },
        ],
      },
    ],
  },
]
