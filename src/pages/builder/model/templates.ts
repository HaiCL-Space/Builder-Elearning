import type { BuilderElement, ElementTypeItem } from "@/pages/builder/model/types"
import {
  Type,
  Video,
  HelpCircle,
  MousePointerClick,
  ArrowUpDown,
  Link2,
} from "lucide-react"

export const ELEMENT_TYPES: ElementTypeItem[] = [
  { type: "TEXT", label: "Văn bản", icon: Type },
  { type: "VIDEO", label: "Video", icon: Video },
  { type: "QUIZ", label: "Trắc nghiệm", icon: HelpCircle },
  { type: "HOTSPOT", label: "Điểm nóng", icon: MousePointerClick },
  { type: "SORTING", label: "Sắp xếp", icon: ArrowUpDown },
  { type: "MATCHING", label: "Nối từ", icon: Link2 },
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
}
