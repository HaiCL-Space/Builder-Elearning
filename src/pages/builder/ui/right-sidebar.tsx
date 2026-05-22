import { useState } from "react"
import { SlidersHorizontal, Trash2, Sparkles, Zap } from "lucide-react"
import type { BuilderElement } from "@/pages/builder/model/types"
import type { Slide } from "broker-core-sdk"
import { NumberField } from "@/shared/ui/fields"

// Import sub-components from sidebar/ folder
import { TextEditor } from "./sidebar/TextEditor"
import { VideoEditor } from "./sidebar/VideoEditor"
import { QuizEditor } from "./sidebar/QuizEditor"
import { MatchingEditor } from "./sidebar/MatchingEditor"
import { SortingEditor } from "./sidebar/SortingEditor"
import { HotspotEditor } from "./sidebar/HotspotEditor"
import { MemoryCardEditor } from "./sidebar/MemoryCardEditor"
import { FillBlankEditor } from "./sidebar/FillBlankEditor"
import { SwipeEditor } from "./sidebar/SwipeEditor"
import { TimedSprintEditor } from "./sidebar/TimedSprintEditor"
import { WordScrambleEditor } from "./sidebar/WordScrambleEditor"
import { AnimationTab } from "./sidebar/AnimationTab"
import { ActionTab } from "./sidebar/ActionTab"

import type { ElementAction } from "broker-core-sdk"

export function RightSidebar({
  selectedElement,
  slides,
  currentSlide,
  onUpdatePosition,
  onUpdateStyle,
  onUpdateData,
  onDeleteSelected,
  onUpdateActions,
  onUpdateAnimations,
}: {
  selectedElement: BuilderElement | null
  slides: Slide[]
  currentSlide: Slide
  onUpdatePosition: (patch: Partial<BuilderElement["position"]>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
  onUpdateData: (patch: Record<string, unknown>) => void
  onDeleteSelected: () => void
  onUpdateActions?: (actions: ElementAction[]) => void
  onUpdateAnimations?: (patch: { enterAnimation?: BuilderElement["enterAnimation"]; exitAnimation?: BuilderElement["exitAnimation"] }) => void
}) {
  const [sidebarTab, setSidebarTab] = useState<"design" | "animation" | "action">("design")

  return (
    <aside className="flex w-80 flex-shrink-0 flex-col border-l border-slate-200 bg-white shadow-xs">
      {/* Sidebar Header */}
      <div className="flex flex-col border-b border-slate-200">
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-100">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Thuộc tính
          </h3>
        </div>

        {/* Sidebar Tabs */}
        {selectedElement && (
          <div className="flex p-1 gap-0.5 bg-white">
            <button
              onClick={() => setSidebarTab("design")}
              className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-bold rounded-md transition ${
                sidebarTab === "design"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="h-3 w-3" />
              Thiết kế
            </button>
            <button
              onClick={() => setSidebarTab("animation")}
              className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-bold rounded-md transition ${
                sidebarTab === "animation"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              Hiệu ứng
            </button>
            <button
              onClick={() => setSidebarTab("action")}
              className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-bold rounded-md transition ${
                sidebarTab === "action"
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Zap className="h-3 w-3" />
              Hành động
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedElement ? (
          <div className="space-y-5 p-4">
            {/* =========================================================================
                TAB 1: THIẾT KẾ & DỮ LIỆU CỐT LÕI
                ========================================================================= */}
            {sidebarTab === "design" && (
              <>
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Loại phần tử
                  </label>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">
                    {selectedElement.type}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Vị trí & Kích thước (%)
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    <NumberField
                      label="Trục X"
                      value={selectedElement.position.x}
                      onChange={(v) => onUpdatePosition({ x: v })}
                    />
                    <NumberField
                      label="Trục Y"
                      value={selectedElement.position.y}
                      onChange={(v) => onUpdatePosition({ y: v })}
                    />
                    <NumberField
                      label="Chiều rộng"
                      value={selectedElement.position.w}
                      onChange={(v) => onUpdatePosition({ w: v })}
                    />
                    <NumberField
                      label="Chiều cao"
                      value={selectedElement.position.h}
                      onChange={(v) => onUpdatePosition({ h: v })}
                    />
                  </div>
                </div>

                {/* DỰ LIỆU CỤ THỂ TỪNG LOẠI PHẦN TỬ */}
                {selectedElement.type === "TEXT" && (
                  <TextEditor
                    selectedElement={selectedElement}
                    onUpdateData={onUpdateData}
                    onUpdateStyle={onUpdateStyle}
                  />
                )}

                {selectedElement.type === "VIDEO" && (
                  <VideoEditor
                    selectedElement={selectedElement}
                    onUpdateData={onUpdateData}
                  />
                )}

                {selectedElement.type === "QUIZ" && (
                  <QuizEditor
                    selectedElement={selectedElement}
                    onUpdateData={onUpdateData}
                    onUpdateStyle={onUpdateStyle}
                  />
                )}

                {selectedElement.type === "SORTING" && (
                  <SortingEditor
                    selectedElement={selectedElement}
                    onUpdateData={onUpdateData}
                  />
                )}

                {selectedElement.type === "MATCHING" && (
                  <MatchingEditor
                    selectedElement={selectedElement}
                    onUpdateData={onUpdateData}
                  />
                )}

                {selectedElement.type === "HOTSPOT" && (
                  <HotspotEditor
                    selectedElement={selectedElement}
                    onUpdateData={onUpdateData}
                    onUpdateStyle={onUpdateStyle}
                  />
                )}

                {selectedElement.type === "MEMORY_CARD" && (
                  <MemoryCardEditor
                    selectedElement={selectedElement}
                    onUpdateData={onUpdateData}
                    onUpdateStyle={onUpdateStyle}
                  />
                )}

                {selectedElement.type === "FILL_BLANK" && (
                  <FillBlankEditor
                    selectedElement={selectedElement}
                    onUpdateData={onUpdateData}
                    onUpdateStyle={onUpdateStyle}
                  />
                )}

                {selectedElement.type === "SWIPE" && (
                  <SwipeEditor
                    selectedElement={selectedElement}
                    onUpdateData={onUpdateData}
                    onUpdateStyle={onUpdateStyle}
                  />
                )}

                {selectedElement.type === "TIMED_SPRINT" && (
                  <TimedSprintEditor
                    selectedElement={selectedElement}
                    onUpdateData={onUpdateData}
                    onUpdateStyle={onUpdateStyle}
                  />
                )}

                {selectedElement.type === "WORD_SCRAMBLE" && (
                  <WordScrambleEditor
                    selectedElement={selectedElement}
                    onUpdateData={onUpdateData}
                    onUpdateStyle={onUpdateStyle}
                  />
                )}

                {/* --- CHỈNH SỬA HIỂN THỊ CHUNG --- */}
                <div className="space-y-3.5 border-t border-slate-100 pt-3.5">
                  <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Hiển thị nâng cao
                  </label>
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <label className="text-xs font-semibold text-slate-600">Độ mờ (Opacity)</label>
                    {(() => {
                      const opacityVal =
                        selectedElement.style &&
                        (selectedElement.style as Record<string, any>).opacity !== undefined
                          ? parseFloat(String((selectedElement.style as Record<string, any>).opacity))
                          : 1
                      const safeOpacity = isNaN(opacityVal) ? 1 : opacityVal
                      return (
                        <>
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.05}
                            value={safeOpacity}
                            onChange={(e) =>
                              onUpdateStyle({
                                opacity: parseFloat(e.target.value),
                              })
                            }
                            className="flex-1 accent-blue-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                          />
                          <span className="w-8 text-right text-[11px] font-bold text-slate-600 tabular-nums">
                            {safeOpacity.toFixed(2)}
                          </span>
                        </>
                      )
                    })()}
                  </div>
                  <NumberField
                    label="Z-Index (Độ cao chồng xếp)"
                    value={Number(
                      ((
                        selectedElement.style as unknown as {
                          zIndex?: number | string
                        }
                      )?.zIndex as number | string) ?? 0
                    )}
                    onChange={(v) => onUpdateStyle({ zIndex: v })}
                  />
                </div>

                <button
                  onClick={onDeleteSelected}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" /> Xóa thành phần
                </button>
              </>
            )}

            {/* =========================================================================
                TAB 2: HIỆU ỨNG CHUYỂN ĐỘNG (ANIMATION)
                ========================================================================= */}
            {sidebarTab === "animation" && (
              <AnimationTab
                selectedElement={selectedElement}
                onUpdateAnimations={onUpdateAnimations}
              />
            )}

            {/* =========================================================================
                TAB 3: TƯƠNG TÁC HÀNH ĐỘNG (ACTION)
                ========================================================================= */}
            {sidebarTab === "action" && (
              <ActionTab
                selectedElement={selectedElement}
                slides={slides}
                currentSlide={currentSlide}
                onUpdateActions={onUpdateActions}
              />
            )}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center px-6 text-center text-sm text-slate-400 leading-relaxed font-medium">
            Chọn một thành phần trên canvas để bắt đầu tùy chỉnh
          </div>
        )}
      </div>
    </aside>
  )
}

export default RightSidebar
