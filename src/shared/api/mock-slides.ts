import { ACTION_TRIGGERS, ACTION_TYPES, type Slide } from "broker-core-sdk"

export const MOCK_SLIDES: Slide[] = [
  // =========================================================================
  // SLIDE 1: GIỚI THIỆU (TEXT + VIDEO + ACTION NEXT) - THEME LIGHT
  // =========================================================================
  {
    id: "slide-intro-001",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 1,
    config: { aspectRatio: "16:9", theme: "light" },
    elements: [
      {
        id: "el-text-title-1",
        type: "TEXT",
        position: { x: 10, y: 8, w: 80, h: 16 },
        style: {
          fontSize: 34,
          textAlign: "center",
          color: "#1e293b", // slate-800
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 600, delay: 0 },
        exitAnimation: { type: "fade-in", duration: 300, delay: 0 },
        data: {
          content: "Chào mừng đến với Khóa học Tương tác Thế hệ mới!",
        },
      },
      {
        id: "el-video-intro-1",
        type: "VIDEO",
        position: { x: 15, y: 28, w: 70, h: 48 },
        style: {
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "zoom-in", duration: 800, delay: 200 },
        exitAnimation: { type: "fade-in", duration: 400, delay: 0 },
        data: {
          src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
          autoPlay: false,
          muted: false,
          loop: true,
        },
      },
      {
        id: "el-btn-next-1",
        type: "TEXT",
        position: { x: 40, y: 82, w: 20, h: 10 },
        style: {
          backgroundColor: "#2563eb", // blue-600
          color: "#ffffff",
          fontSize: 16,
          textAlign: "center",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 400 },
        data: {
          content: "Bắt đầu bài học ->",
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
  // SLIDE 2: BÀI TẬP TRẮC NGHIỆM (QUIZ + NÚT SUBMIT RIÊNG LẺ) - THEME DARK
  // =========================================================================
  {
    id: "slide-quiz-002",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 2,
    config: { aspectRatio: "16:9", theme: "dark" },
    elements: [
      {
        id: "el-text-quiz-title",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 26,
          textAlign: "center",
          color: "#f8fafc", // slate-50
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 0 },
        data: {
          content: "🤔 CÂU HỎI TRẮC NGHIỆM LỊCH SỬ",
        },
      },
      {
        id: "el-quiz-math-1",
        type: "QUIZ",
        position: { x: 15, y: 18, w: 70, h: 56 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "slide-up", duration: 700, delay: 150 },
        data: {
          question: "Thủ đô của Việt Nam là thành phố nào?",
          options: [
            { id: "opt-1", content: "Thành phố Hồ Chí Minh" },
            { id: "opt-2", content: "Hà Nội" },
            { id: "opt-3", content: "Đà Nẵng" },
            { id: "opt-4", content: "Huế" },
          ],
          correctId: "opt-2",
        },
      },
      {
        id: "el-btn-submit-quiz",
        type: "TEXT",
        position: { x: 40, y: 78, w: 20, h: 9 },
        style: {
          backgroundColor: "#10b981", // emerald-500
          color: "#ffffff",
          fontSize: 15,
          textAlign: "center",
          borderRadius: 12,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "bounce", duration: 600, delay: 300 },
        data: {
          content: "Kiểm tra đáp án",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.EVALUATE_ANSWER,
            payload: {
              targetElementId: "el-quiz-math-1",
              conceptId: "concept-geography-vn",
            },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 3: TƯƠNG TÁC ĐIỂM NÓNG (HOTSPOT + TOGGLE VISIBILITY) - THEME SUNSET
  // =========================================================================
  {
    id: "slide-hotspot-003",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 3,
    config: { aspectRatio: "16:9", theme: "sunset" },
    elements: [
      {
        id: "el-text-hotspot-title",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 26,
          textAlign: "center",
          color: "#7c2d12", // orange-950
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 0 },
        data: {
          content: "🫀 KHÁM PHÁ CẤU TRÚC GIẢI PHẪU TIM",
        },
      },
      {
        id: "el-text-hotspot-subtitle",
        type: "TEXT",
        position: { x: 15, y: 15, w: 70, h: 6 },
        style: {
          fontSize: 15,
          textAlign: "center",
          color: "#9a3412", // orange-800
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 100 },
        data: {
          content: "Nhấn trực tiếp vào vùng Tâm thất trái trên mô hình để xem thông tin chi tiết.",
        },
      },
      {
        id: "el-hotspot-anatomy",
        type: "HOTSPOT",
        position: { x: 15, y: 24, w: 42, h: 64 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "zoom-in", duration: 600, delay: 200 },
        data: {
          imageUri: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=600&q=80",
          zones: [
            { id: "zone-right-atrium", xMin: 20, yMin: 25, xMax: 45, yMax: 48 },
            { id: "zone-left-ventricle", xMin: 50, yMin: 52, xMax: 82, yMax: 85 },
          ],
          correctZoneId: "zone-left-ventricle",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.TOGGLE_VISIBILITY,
            payload: {
              targetElementId: "el-feedback-text",
              action: "SHOW",
            },
          },
        ],
      },
      {
        id: "el-feedback-text",
        type: "TEXT",
        position: { x: 60, y: 35, w: 26, h: 42 },
        style: {
          backgroundColor: "#ffedd5", // orange-100
          color: "#9a3412", // orange-800
          fontSize: 16,
          textAlign: "center",
          borderRadius: 16,
          opacity: 0, // Mặc định ẩn
          zIndex: 8,
        },
        enterAnimation: { type: "fade-in", duration: 400, delay: 0 },
        data: {
          content: "🎉 Chính xác!\n\nĐây chính là Tâm thất trái (Left Ventricle), buồng tim có thành dày nhất chịu trách nhiệm bơm máu giàu oxy đi nuôi khắp cơ thể.",
        },
      },
    ],
  },

  // =========================================================================
  // SLIDE 4: TRÒ CHƠI SẮP XẾP (SORTING + NÚT NGHE NHẠC LỆNH) - THEME OCEAN
  // =========================================================================
  {
    id: "slide-sorting-004",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 4,
    config: { aspectRatio: "16:9", theme: "ocean" },
    elements: [
      {
        id: "el-text-instruction-sort",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 26,
          textAlign: "center",
          color: "#0c4a6e", // sky-950
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "📅 SẮP XẾP TIẾN TRÌNH LỊCH SỬ VIỆT NAM",
        },
      },
      {
        id: "el-text-audio-hint",
        type: "TEXT",
        position: { x: 25, y: 16, w: 18, h: 8 },
        style: {
          backgroundColor: "#e0f2fe", // sky-100
          color: "#0369a1", // sky-700
          fontSize: 13,
          textAlign: "center",
          borderRadius: 12,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 200 },
        data: {
          content: "🎵 Nghe nhạc nền",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.PLAY_MEDIA,
            payload: {
              mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
              loop: false,
            },
          },
        ],
      },
      {
        id: "el-text-instruction-sub",
        type: "TEXT",
        position: { x: 45, y: 17, w: 30, h: 6 },
        style: {
          fontSize: 14,
          color: "#0284c7", // sky-600
          backgroundColor: "transparent",
          textAlign: "left",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 250 },
        data: {
          content: "Kéo thả các sự kiện dưới đây theo đúng trình tự lịch sử từ trước đến sau:",
        },
      },
      {
        id: "el-sorting-history",
        type: "SORTING",
        position: { x: 15, y: 26, w: 70, h: 62 },
        style: {
          borderRadius: 20,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "slide-up", duration: 700, delay: 300 },
        data: {
          items: [
            { id: "evt-1", content: "Chiến thắng Điện Biên Phủ vang dội năm châu (1954)" },
            { id: "evt-2", content: "Nhà nước Âu Lạc được thành lập bởi An Dương Vương" },
            { id: "evt-3", content: "Giải phóng hoàn toàn miền Nam, thống nhất đất nước (1975)" },
          ],
          correctOrder: ["evt-2", "evt-1", "evt-3"],
        },
      },
    ],
  },

  // =========================================================================
  // SLIDE 5: TRÒ CHƠI NỐI TỪ (MATCHING) - THEME NEON
  // =========================================================================
  {
    id: "slide-matching-005",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 5,
    config: { aspectRatio: "16:9", theme: "neon" },
    elements: [
      {
        id: "el-text-instruction-match",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 26,
          textAlign: "center",
          color: "#a855f7", // purple-500
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "bounce", duration: 600, delay: 0 },
        data: {
          content: "⚡ THỬ THÁCH NỐI TỪ VỰNG ANH - VIỆT",
        },
      },
      {
        id: "el-matching-vocab",
        type: "MATCHING",
        position: { x: 10, y: 18, w: 80, h: 62 },
        style: {
          borderRadius: 16,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "slide-up", duration: 800, delay: 150 },
        data: {
          leftColumn: [
            { id: "en-1", content: "Apple" },
            { id: "en-2", content: "Banana" },
            { id: "en-3", content: "Cat" },
          ],
          rightColumn: [
            { id: "vi-1", content: "Con Mèo" },
            { id: "vi-2", content: "Quả Táo" },
            { id: "vi-3", content: "Quả Chuối" },
          ],
          correctPairs: [
            ["en-1", "vi-2"],
            ["en-2", "vi-3"],
            ["en-3", "vi-1"],
          ],
        },
      },
      {
        id: "el-btn-submit-matching",
        type: "TEXT",
        position: { x: 40, y: 83, w: 20, h: 9 },
        style: {
          backgroundColor: "#c084fc", // purple-400
          color: "#090514",
          fontSize: 15,
          textAlign: "center",
          borderRadius: 12,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "zoom-in", duration: 500, delay: 350 },
        data: {
          content: "Nộp bài tự động",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.EVALUATE_ANSWER,
            payload: {
              targetElementId: "el-matching-vocab",
              conceptId: "concept-vocab-en",
            },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // SLIDE 6: PHÁT TRỰC TIẾP TỪ YOUTUBE - THEME CLASSIC
  // =========================================================================
  {
    id: "slide-live-006",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 6,
    config: { aspectRatio: "16:9", theme: "classic" },
    elements: [
      {
        id: "el-text-live-title",
        type: "TEXT",
        position: { x: 10, y: 6, w: 80, h: 10 },
        style: {
          fontSize: 26,
          textAlign: "center",
          color: "#be123c", // rose-700
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "🔴 PHÁT TRỰC TIẾP TÀI LIỆU HỌC TẬP",
        },
      },
      {
        id: "el-video-live",
        type: "VIDEO",
        position: { x: 15, y: 18, w: 70, h: 54 },
        style: {
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "zoom-in", duration: 800, delay: 200 },
        data: {
          src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          isLive: true,
          autoPlay: true,
          muted: true,
          loop: false,
        },
      },
      {
        id: "el-text-live-desc",
        type: "TEXT",
        position: { x: 15, y: 76, w: 70, h: 18 },
        style: {
          textAlign: "center",
          fontSize: 14,
          color: "#4f4f4f",
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 600, delay: 450 },
        data: {
          content: "Luồng video đang được phát trực tiếp tự động với chế độ không tiếng để tránh gây phiền nhiễu. Bạn có thể bật âm thanh hoặc phóng to màn hình bằng thanh điều khiển phía trên.",
        },
      },
    ],
  },

  // =========================================================================
  // SLIDE 7: TRÒ CHƠI LẬT THẺ NHỚ (MEMORY CARD) - THEME LIGHT
  // =========================================================================
  {
    id: "slide-memory-007",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 7,
    config: { aspectRatio: "16:9", theme: "light" },
    elements: [
      {
        id: "el-text-memory-title",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 26,
          textAlign: "center",
          color: "#312e81", // indigo-950
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 0 },
        data: {
          content: "🧠 THỬ THÁCH TRÍ NHỚ TÌM CẶP TỪ ĐỒNG NGHĨA",
        },
      },
      {
        id: "el-memory-cards-game",
        type: "MEMORY_CARD",
        position: { x: 15, y: 18, w: 70, h: 72 },
        style: {
          borderRadius: 20,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "slide-up", duration: 800, delay: 200 },
        data: {
          cards: [
            { id: "c1", value: "Happy" },
            { id: "c2", value: "Glad" },
            { id: "c3", value: "Sad" },
            { id: "c4", value: "Unhappy" },
          ],
        },
      },
    ],
  },

  // =========================================================================
  // SLIDE 8: ĐIỀN VÀO CHỖ TRỐNG (FILL BLANK) - THEME DARK
  // =========================================================================
  {
    id: "slide-fill-blank-008",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 8,
    config: { aspectRatio: "16:9", theme: "dark" },
    elements: [
      {
        id: "el-text-fb-title",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 26,
          textAlign: "center",
          color: "#bae6fd", // sky-200
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 0 },
        data: {
          content: "✍️ KIỂM TRA HIỂU BIẾT THIÊN VĂN HỌC",
        },
      },
      {
        id: "el-fill-blank-science",
        type: "FILL_BLANK",
        position: { x: 15, y: 20, w: 70, h: 64 },
        style: {
          borderRadius: 24,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "zoom-in", duration: 600, delay: 150 },
        data: {
          question: "Hành tinh nào nằm ở vị trí gần Mặt trời nhất trong Hệ Mặt trời?",
          correctAnswers: ["Sao Thủy", "Mercury", "sao thủy", "mercury"],
          caseSensitive: false,
        },
      },
    ],
  },

  // =========================================================================
  // SLIDE 9: QUẸT THẺ ĐÚNG/SAI (SWIPE) - THEME NEON
  // =========================================================================
  {
    id: "slide-swipe-009",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 9,
    config: { aspectRatio: "16:9", theme: "neon" },
    elements: [
      {
        id: "el-text-swipe-title",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 26,
          textAlign: "center",
          color: "#fbbf24", // amber-400
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 0 },
        data: {
          content: "⚡ THỬ THÁCH QUYẾT ĐỊNH ĐÚNG / SAI NHANH",
        },
      },
      {
        id: "el-swipe-geography",
        type: "SWIPE",
        position: { x: 25, y: 18, w: 50, h: 70 },
        style: {
          borderRadius: 24,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "bounce", duration: 800, delay: 200 },
        data: {
          statement: "Thành phố Sydney là thủ đô chính thức của nước Úc.",
          correctDirection: "left", // False statement (Canberra is the capital)
        },
      },
    ],
  },

  // =========================================================================
  // SLIDE 10: BẤT NGỜ THỜI GIAN (TIMED SPRINT) - THEME SUNSET
  // =========================================================================
  {
    id: "slide-sprint-010",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 10,
    config: { aspectRatio: "16:9", theme: "sunset" },
    elements: [
      {
        id: "el-text-sprint-title",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 26,
          textAlign: "center",
          color: "#991b1b", // red-800
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 0 },
        data: {
          content: "🔥 CHẠY ĐUA CÙNG THỜI GIAN: TOÁN HỌC NHANH",
        },
      },
      {
        id: "el-sprint-math",
        type: "TIMED_SPRINT",
        position: { x: 18, y: 18, w: 64, h: 70 },
        style: {
          borderRadius: 24,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "slide-up", duration: 700, delay: 150 },
        data: {
          question: "Kết quả chính xác của phép tính sau đây: 7 x 8 - 9 = ?",
          options: [
            { id: "ts-opt1", content: "45" },
            { id: "ts-opt2", content: "47" },
            { id: "ts-opt3", content: "49" },
          ],
          correctId: "ts-opt2",
          duration: 10,
        },
      },
    ],
  },

  // =========================================================================
  // SLIDE 11: GHÉP CHỮ (WORD SCRAMBLE) - THEME OCEAN
  // =========================================================================
  {
    id: "slide-scramble-011",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 11,
    config: { aspectRatio: "16:9", theme: "ocean" },
    elements: [
      {
        id: "el-text-scramble-title",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: {
          fontSize: 26,
          textAlign: "center",
          color: "#581c87", // purple-900
          backgroundColor: "transparent",
          borderRadius: 0,
          opacity: 1,
          zIndex: 10,
        },
        enterAnimation: { type: "fade-in", duration: 500, delay: 0 },
        data: {
          content: "🔤 THỬ THÁCH GIẢI MÃ CHỮ CÁI XÁO TRỘN",
        },
      },
      {
        id: "el-scramble-vocab",
        type: "WORD_SCRAMBLE",
        position: { x: 15, y: 20, w: 70, h: 64 },
        style: {
          borderRadius: 24,
          opacity: 1,
          zIndex: 5,
        },
        enterAnimation: { type: "zoom-in", duration: 600, delay: 200 },
        data: {
          scrambledWord: "NLOODN",
          correctWord: "LONDON",
          caseSensitive: false,
        },
      },
    ],
  },
]
