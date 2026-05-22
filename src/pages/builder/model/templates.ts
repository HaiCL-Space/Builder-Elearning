import type { BuilderElement, ElementTypeItem } from "@/pages/builder/model/types"
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
} from "lucide-react"

export const ELEMENT_TYPES: ElementTypeItem[] = [
  { type: "TEXT", label: "Văn bản", icon: Type },
  { type: "VIDEO", label: "Video", icon: Video },
  { type: "QUIZ", label: "Trắc nghiệm", icon: HelpCircle },
  { type: "HOTSPOT", label: "Điểm nóng", icon: MousePointerClick },
  { type: "SORTING", label: "Sắp xếp", icon: ArrowUpDown },
  { type: "MATCHING", label: "Nối từ", icon: Link2 },
  { type: "MEMORY_CARD", label: "Lật thẻ", icon: Sparkles },
  { type: "FILL_BLANK", label: "Điền từ", icon: PenTool },
  { type: "SWIPE", label: "Vuốt thẻ", icon: ArrowLeftRight },
  { type: "TIMED_SPRINT", label: "Sprint nhanh", icon: Timer },
  { type: "WORD_SCRAMBLE", label: "Ghép chữ", icon: SpellCheck },
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
}
