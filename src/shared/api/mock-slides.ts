import { ACTION_TRIGGERS, ACTION_TYPES, type Slide } from "broker-core-sdk"

export const MOCK_SLIDES: Slide[] = [
  // ==========================================
  // SLIDE 1: GIỚI THIỆU (TEXT + VIDEO + ACTION NEXT)
  // ==========================================
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
        position: { x: 10, y: 10, w: 80, h: 15 },
        style: {
          fontSize: 32,
          fontWeight: "bold",
          textAlign: "center",
          color: "#333",
        },
        enterAnimation: { type: "slide-up", duration: 500, delay: 0 },
        data: {
          content: "Chào mừng đến với Khóa học Tương tác!",
        },
      },
      {
        id: "el-video-intro-1",
        type: "VIDEO",
        position: { x: 20, y: 30, w: 60, h: 50 },
        style: { borderRadius: 8, border: "2px solid #ccc" },
        enterAnimation: { type: "fade-in", duration: 800, delay: 300 },
        data: {
          src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
          autoPlay: false,
          muted: false,
        },
      },
      {
        id: "el-btn-next-1",
        type: "TEXT",
        position: { x: 70, y: 85, w: 20, h: 10 },
        style: {
          backgroundColor: "#007BFF",
          color: "#FFF",
          textAlign: "center",
          borderRadius: 4,
        },
        data: {
          content: "Bắt đầu ->",
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

  // ==========================================
  // SLIDE 2: BÀI TẬP TRẮC NGHIỆM (QUIZ + NÚT SUBMIT RIÊNG LẺ)
  // ==========================================
  {
    id: "slide-quiz-002",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 2,
    elements: [
      {
        id: "el-quiz-math-1",
        type: "QUIZ",
        position: { x: 15, y: 20, w: 70, h: 50 },
        data: {
          question: "Thủ đô của Việt Nam là gì?",
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
        position: { x: 40, y: 80, w: 20, h: 10 },
        style: {
          backgroundColor: "#28a745",
          color: "#FFF",
          textAlign: "center",
          borderRadius: 8,
        },
        data: {
          content: "Kiểm tra đáp án",
        },
        actions: [
          {
            trigger: ACTION_TRIGGERS.ON_CLICK,
            type: ACTION_TYPES.EVALUATE_ANSWER,
            payload: {
              targetElementId: "el-quiz-math-1", // Trỏ đến ID của Quiz để chấm điểm
              conceptId: "concept-geography-vn",
            },
          },
        ],
      },
    ],
  },

  // ==========================================
  // SLIDE 3: TƯƠNG TÁC ĐIỂM NÓNG (HOTSPOT + TOGGLE VISIBILITY)
  // ==========================================
  {
    id: "slide-hotspot-003",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 3,
    elements: [
      {
        id: "el-hotspot-anatomy",
        type: "HOTSPOT",
        position: { x: 10, y: 10, w: 50, h: 80 },
        data: {
          imageUri: "https://example.com/images/human-heart.jpg",
          zones: [
            { id: "zone-right-atrium", xMin: 20, yMin: 30, xMax: 40, yMax: 50 },
            {
              id: "zone-left-ventricle",
              xMin: 60,
              yMin: 60,
              xMax: 80,
              yMax: 80,
            },
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
        position: { x: 65, y: 40, w: 30, h: 20 },
        style: { backgroundColor: "#FFF3CD", color: "#856404", opacity: 0 }, // Mặc định ẩn
        data: {
          content:
            "Chính xác! Đây là Tâm thất trái, nơi bơm máu đi khắp cơ thể.",
        },
      },
    ],
  },

  // ==========================================
  // SLIDE 4: TRÒ CHƠI SẮP XẾP (SORTING)
  // ==========================================
  {
    id: "slide-sorting-004",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 4,
    elements: [
      {
        id: "el-text-instruction-sort",
        type: "TEXT",
        position: { x: 10, y: 10, w: 80, h: 10 },
        style: { fontSize: 24, textAlign: "center" },
        data: {
          content: "Sắp xếp các mốc lịch sử theo trình tự thời gian:",
        },
      },
      {
        id: "el-sorting-history",
        type: "SORTING",
        position: { x: 20, y: 25, w: 60, h: 60 },
        data: {
          items: [
            { id: "evt-1", content: "Chiến thắng Điện Biên Phủ" },
            { id: "evt-2", content: "Nhà nước Âu Lạc ra đời" },
            { id: "evt-3", content: "Giải phóng miền Nam" },
          ],
          correctOrder: ["evt-2", "evt-1", "evt-3"],
        },
      },
    ],
  },

  // ==========================================
  // SLIDE 5: TRÒ CHƠI NỐI TỪ (MATCHING)
  // ==========================================
  {
    id: "slide-matching-005",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 5,
    elements: [
      {
        id: "el-text-instruction-match",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
        data: {
          content: "Nối từ vựng tiếng Anh với nghĩa tương ứng:",
        },
      },
      {
        id: "el-matching-vocab",
        type: "MATCHING",
        position: { x: 10, y: 20, w: 80, h: 70 },
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
        position: { x: 40, y: 90, w: 20, h: 8 },
        style: {
          backgroundColor: "#8b5cf6",
          color: "#FFF",
          textAlign: "center",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        data: {
          content: "Kiểm tra kết quả",
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
    ]
  },
  {
    id: "slide-live-006",
    tenant_id: "tenant-abc",
    course_id: "course-101",
    order: 6,
    elements: [
      {
        id: "el-text-live-title",
        type: "TEXT",
        position: { x: 10, y: 5, w: 80, h: 10 },
        style: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#e11d48" },
        data: {
          content: "🔴 PHÁT TRỰC TIẾP TỪ YOUTUBE",
        },
      },
      {
        id: "el-video-live",
        type: "VIDEO",
        position: { x: 10, y: 20, w: 80, h: 60 },
        style: { borderRadius: 12, border: "4px solid #e11d48", boxShadow: "0 10px 25px -5px rgba(225, 29, 72, 0.3)" },
        data: {
          src: "https://www.youtube.com/watch?v=jfKfPfyJRdk", // Sample Lo-fi live (usually)
          isLive: true,
          autoPlay: true,
          muted: true,
        },
      },
      {
        id: "el-text-live-desc",
        type: "TEXT",
        position: { x: 20, y: 85, w: 60, h: 10 },
        style: { textAlign: "center", fontSize: 14, color: "#64748b" },
        data: {
          content: "Nhấn vào video để xem luồng trực tiếp đang diễn ra.",
        },
      },
    ],
  },
]
