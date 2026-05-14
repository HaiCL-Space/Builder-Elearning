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
} from "lucide-react"
import { ELEMENT_TYPES } from "@/pages/builder/model/templates"
import type { Slide } from "@broker/core-sdk"

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
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <PanelLeft className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Thành phần Slide
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ELEMENT_TYPES.map((et) => (
                <button
                  key={et.type}
                  onClick={() => onAddElement(et.type)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-sm"
                >
                  <et.icon className="h-5.5 w-5.5 text-slate-600 group-hover:text-blue-600" />
                  <span className="text-[11px] font-semibold text-slate-700">
                    {et.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
