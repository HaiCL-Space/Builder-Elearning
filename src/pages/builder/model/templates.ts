import type {
  BuilderElement,
  ElementTypeItem,
} from "@/pages/builder/model/types"
import {
  Type,
  Video,
  HelpCircle,
  MousePointerClick,
  ArrowUpDown,
  Link2,
  Sparkles,
  PenTool,
  ArrowLeftRight,
  Timer,
  SpellCheck,
  Grid3X3,
  GitFork,
  Tag,
} from "lucide-react"

export const ELEMENT_TYPES: ElementTypeItem[] = [
  { type: "TEXT", label: "Văn bản", icon: Type, category: "basic" },
  { type: "VIDEO", label: "Video", icon: Video, category: "basic" },
  { type: "QUIZ", label: "Trắc nghiệm", icon: HelpCircle, category: "quiz" },
  {
    type: "HOTSPOT",
    label: "Điểm nóng",
    icon: MousePointerClick,
    category: "interactive",
  },
  {
    type: "SORTING",
    label: "Sắp xếp",
    icon: ArrowUpDown,
    category: "interactive",
  },
  { type: "MATCHING", label: "Nối từ", icon: Link2, category: "interactive" },
  {
    type: "MEMORY_CARD",
    label: "Lật thẻ",
    icon: Sparkles,
    category: "interactive",
  },
  { type: "FILL_BLANK", label: "Điền từ", icon: PenTool, category: "quiz" },
  {
    type: "SWIPE",
    label: "Vuốt thẻ",
    icon: ArrowLeftRight,
    category: "interactive",
  },
  {
    type: "TIMED_SPRINT",
    label: "Sprint nhanh",
    icon: Timer,
    category: "quiz",
  },
  {
    type: "WORD_SCRAMBLE",
    label: "Ghép chữ",
    icon: SpellCheck,
    category: "interactive",
  },
  { type: "CROSSWORD", label: "Ô chữ", icon: Grid3X3, category: "interactive" },
  {
    type: "BRANCHING",
    label: "Rẽ nhánh",
    icon: GitFork,
    category: "interactive",
  },
  {
    type: "LABEL_IMAGE",
    label: "Nhãn ảnh",
    icon: Tag,
    category: "interactive",
  },
]

export const ELEMENT_TEMPLATES: Record<string, Partial<BuilderElement>> = {
  TEXT: {
    type: "TEXT",
    style: {
      fontSize: 24,
      color: "#333",
      backgroundColor: "transparent",
      textAlign: "center",
    },
    data: { content: "Văn bản mới" },
  },
  VIDEO: {
    type: "VIDEO",
    style: { borderRadius: 8 },
    data: { src: "", poster: "" },
  },
  QUIZ: {
    type: "QUIZ",
    style: {
      backgroundColor: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
    },
    data: {
      question: "Câu hỏi mới?",
      options: [
        { id: "opt-1", content: "Lựa chọn A" },
        { id: "opt-2", content: "Lựa chọn B" },
      ],
      correctId: "opt-1",
    },
  },
  HOTSPOT: {
    type: "HOTSPOT",
    style: { border: "2px dashed #cbd5e1", borderRadius: 8 },
    data: { imageUri: "", zones: [], correctZoneId: "" },
  },
  SORTING: {
    type: "SORTING",
    style: {
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
    },
    data: { items: [], correctOrder: [] },
  },
  MATCHING: {
    type: "MATCHING",
    style: {
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
    },
    data: { leftColumn: [], rightColumn: [], correctPairs: [] },
  },
  MEMORY_CARD: {
    type: "MEMORY_CARD",
    style: {
      backgroundColor: "#f8fafc",
      border: "1px solid #cbd5e1",
      borderRadius: 12,
    },
    data: {
      cards: [
        { id: "mc-1", value: "Quả táo" },
        { id: "mc-2", value: "Quả chuối" },
      ],
    },
  },
  FILL_BLANK: {
    type: "FILL_BLANK",
    style: {
      backgroundColor: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: 12,
    },
    data: {
      question: "Trái đất quay quanh Mặt trời mất ___ ngày.",
      correctAnswers: ["365", "366"],
      caseSensitive: false,
    },
  },
  SWIPE: {
    type: "SWIPE",
    style: {
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
    },
    data: {
      statement: "Trái Đất có hình phẳng phẳng.",
      correctDirection: "left",
    },
  },
  TIMED_SPRINT: {
    type: "TIMED_SPRINT",
    style: {
      backgroundColor: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
    },
    data: {
      question: "Công thức hóa học của nước là gì?",
      options: [
        { id: "ts-1", content: "CO2" },
        { id: "ts-2", content: "H2O" },
      ],
      correctId: "ts-2",
      duration: 10,
    },
  },
  WORD_SCRAMBLE: {
    type: "WORD_SCRAMBLE",
    style: {
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: 12,
    },
    data: {
      scrambledWord: "AMELPP",
      correctWord: "APPLE",
      caseSensitive: false,
    },
  },
  CROSSWORD: {
    type: "CROSSWORD",
    style: {
      backgroundColor: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
    },
    data: {
      gridRows: 5,
      gridCols: 5,
      clues: [
        {
          id: "clue-1",
          number: 1,
          question: "Hành tinh chúng ta đang sống?",
          answer: "EARTH",
          row: 0,
          col: 0,
          direction: "across",
        },
        {
          id: "clue-2",
          number: 2,
          question: "Trái nghĩa với đen?",
          answer: "WHITE",
          row: 2,
          col: 0,
          direction: "across",
        },
        {
          id: "clue-3",
          number: 3,
          question: "Ngôn ngữ lập trình web phổ biến?",
          answer: "HTML",
          row: 0,
          col: 3,
          direction: "down",
        },
      ],
      caseSensitive: false,
    },
  },
  BRANCHING: {
    type: "BRANCHING",
    style: {
      backgroundColor: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 16,
    },
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
  },
  LABEL_IMAGE: {
    type: "LABEL_IMAGE",
    style: {
      backgroundColor: "#ffffff",
      border: "1px solid #cbd5e1",
      borderRadius: 16,
    },
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
  },
}
