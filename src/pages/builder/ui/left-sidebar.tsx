import { useState } from "react"
import {
  Layers,
  LayoutGrid,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  PanelLeft,
  Search,
  X,
} from "lucide-react"
import { ELEMENT_TYPES } from "@/pages/builder/model/templates"
import type { ElementCategory } from "@/pages/builder/model/types"
import type { Slide } from "broker-core-sdk"

const CATEGORY_CONFIG: Record<
  ElementCategory,
  { label: string; badgeColor: string; headerColor: string }
> = {
  basic: {
    label: "Cơ bản",
    badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
    headerColor: "text-blue-600",
  },
  quiz: {
    label: "Câu hỏi & Luyện tập",
    badgeColor: "bg-amber-50 text-amber-600 border-amber-100",
    headerColor: "text-amber-600",
  },
  interactive: {
    label: "Tương tác & Trò chơi",
    badgeColor: "bg-purple-50 text-purple-600 border-purple-100",
    headerColor: "text-purple-600",
  },
}

interface LeftSidebarProps {
  slides: Slide[]
  currentSlideIndex: number
  onSelectSlide: (index: number) => void
  onAddSlide: () => void
  onDeleteSlide: (index: number) => void
  onDuplicateSlide: (index: number) => void
  onMoveSlide: (index: number, direction: "up" | "down") => void
  onAddElement: (type: string) => void
}

export function LeftSidebar({
  slides,
  currentSlideIndex,
  onSelectSlide,
  onAddSlide,
  onDeleteSlide,
  onDuplicateSlide,
  onMoveSlide,
  onAddElement,
}: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<"slides" | "elements">("slides")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Tab Header */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-1">
        <button
          onClick={() => setActiveTab("slides")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition ${
            activeTab === "slides"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:bg-slate-150 hover:text-slate-900"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Danh sách Slide ({slides.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("elements")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition ${
            activeTab === "elements"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-600 hover:bg-slate-150 hover:text-slate-900"
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>Thành phần</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "slides" ? (
          <div className="space-y-4 p-3">
            {/* Slide Action Row */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lộ trình Slide
              </span>
              <button
                onClick={onAddSlide}
                className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
              >
                <Plus className="h-3.5 w-3.5" />
                Thêm Slide
              </button>
            </div>

            {/* Slide List */}
            <div className="space-y-2">
              {slides.map((slide, index) => {
                const isSelected = index === currentSlideIndex
                const elementCounts = slide.elements.reduce(
                  (acc, el) => {
                    acc[el.type] = (acc[el.type] || 0) + 1
                    return acc
                  },
                  {} as Record<string, number>
                )

                return (
                  <div
                    key={slide.id || index}
                    onClick={() => onSelectSlide(index)}
                    className={`group relative flex cursor-pointer flex-col rounded-lg border p-2.5 transition ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {/* Thumbnail representation */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">
                        Slide {index + 1}
                      </span>
                      {/* Control buttons (visible on hover or if selected) */}
                      <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                        <button
                          title="Lên"
                          disabled={index === 0}
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveSlide(index, "up")
                          }}
                          className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          title="Xuống"
                          disabled={index === slides.length - 1}
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveSlide(index, "down")
                          }}
                          className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                        <button
                          title="Nhân bản"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDuplicateSlide(index)
                          }}
                          className="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          title="Xóa"
                          disabled={slides.length <= 1}
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteSlide(index)
                          }}
                          className="rounded p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Small visual of slide content types */}
                    <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-slate-400">
                      {slide.elements.length === 0 ? (
                        <span>Slide trống</span>
                      ) : (
                        Object.entries(elementCounts).map(([type, count]) => (
                          <span
                            key={type}
                            className="rounded bg-slate-100 px-1 py-0.2 font-medium text-slate-600"
                          >
                            {type}: {count}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-3">
            {/* Header */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <PanelLeft className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Thành phần Slide
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                <Search className="h-3.5 w-3.5 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm thành phần..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-7 text-xs outline-none transition focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Grouped & Filtered Elements */}
            <div className="space-y-4">
              {(() => {
                const filteredElements = ELEMENT_TYPES.filter((et) =>
                  et.label.toLowerCase().includes(searchQuery.toLowerCase())
                )

                if (filteredElements.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                      <span className="text-xs text-slate-400">
                        Không tìm thấy thành phần nào khớp với "{searchQuery}"
                      </span>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-2 text-xs font-semibold text-blue-500 hover:text-blue-600 underline"
                      >
                        Xóa tìm kiếm
                      </button>
                    </div>
                  )
                }

                const categories = ["basic", "quiz", "interactive"] as const

                return categories.map((cat) => {
                  const elementsInCat = filteredElements.filter(
                    (et) => et.category === cat
                  )
                  if (elementsInCat.length === 0) return null

                  const config = CATEGORY_CONFIG[cat]

                  return (
                    <div key={cat} className="space-y-2">
                      {/* Category Title */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${config.headerColor}`}
                        >
                          {config.label}
                        </span>
                        <span
                          className={`rounded-full border px-1.5 py-0.2 text-[9px] font-semibold leading-none ${config.badgeColor}`}
                        >
                          {elementsInCat.length}
                        </span>
                        <div className="h-px flex-1 bg-slate-100" />
                      </div>

                      {/* Element Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {elementsInCat.map((et) => (
                          <button
                            key={et.type}
                            onClick={() => onAddElement(et.type)}
                            className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition-all hover:scale-[1.03] active:scale-[0.98] duration-150 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-sm"
                          >
                            <et.icon className="h-5.5 w-5.5 text-slate-600 transition-colors group-hover:text-blue-600" />
                            <span className="text-[11px] font-semibold text-slate-700 transition-colors group-hover:text-blue-700">
                              {et.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
