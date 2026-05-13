import type { BuilderElement } from "../types"
import type { Slide, ElementAction } from "@broker/core-sdk"
import { Zap, Plus } from "lucide-react"
import { SelectField, TextField } from "../fields"
import type React from "react"

interface ActionTabProps {
  selectedElement: BuilderElement
  slides: Slide[]
  currentSlide: Slide
  onUpdateActions?: (actions: ElementAction[]) => void
}

export function ActionTab({
  selectedElement,
  slides,
  currentSlide,
  onUpdateActions,
}: ActionTabProps) {
  const otherElements = currentSlide.elements.filter((el: BuilderElement) => el.id !== selectedElement?.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
          <Zap className="h-4 w-4" />
          <span>SỰ KIỆN TƯƠNG TÁC</span>
        </div>
        <button
          type="button"
          onClick={() => {
            const currentActions = selectedElement.actions || []
            const nextAction: ElementAction = {
              trigger: "ON_CLICK",
              type: "NAVIGATE_SLIDE",
              payload: { direction: "NEXT" },
            }
            onUpdateActions?.([...currentActions, nextAction])
          }}
          className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
        >
          <Plus className="h-3 w-3" /> Thêm Action
        </button>
      </div>

      {(!selectedElement.actions || selectedElement.actions.length === 0) ? (
        <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-400">
          Chưa có hành động nào gắn với phần tử này. Bấm "Thêm Action" để kích hoạt tương tác!
        </div>
      ) : (
        <div className="space-y-3.5">
          {selectedElement.actions.map((act: ElementAction, index: number) => {
            const updateActionType = (type: string) => {
              const nextActions = [...selectedElement.actions!]
              let payload: ElementAction["payload"] = {}
              if (type === "NAVIGATE_SLIDE") payload = { direction: "NEXT" }
              else if (type === "TOGGLE_VISIBILITY") {
                payload = { targetElementId: otherElements[0]?.id || "", action: "TOGGLE" }
              } else if (type === "PLAY_MEDIA") payload = { mediaUrl: "", loop: false }
              else if (type === "EVALUATE_ANSWER") {
                payload = { targetElementId: otherElements.find((e: BuilderElement) => ["QUIZ", "SORTING", "MATCHING", "HOTSPOT"].includes(e.type))?.id || "", conceptId: "concept-general" }
              }

              nextActions[index] = {
                ...act,
                type: type as ElementAction["type"],
                payload,
              } as ElementAction
              onUpdateActions?.(nextActions)
            }

            const updateActionTrigger = (trigger: string) => {
              const nextActions = [...selectedElement.actions!]
              nextActions[index] = { ...act, trigger: trigger as ElementAction["trigger"] } as ElementAction
              onUpdateActions?.(nextActions)
            }

            const updatePayload = (patch: Partial<NonNullable<ElementAction["payload"]>>) => {
              const nextActions = [...selectedElement.actions!]
              nextActions[index] = {
                ...act,
                payload: { ...act.payload, ...patch },
              } as ElementAction
              onUpdateActions?.(nextActions)
            }

            const deleteAction = () => {
              const nextActions = selectedElement.actions!.filter((_: ElementAction, idx: number) => idx !== index)
              onUpdateActions?.(nextActions)
            }

            return (
              <div
                key={index}
                className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-2 relative group"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-100 pb-1.5">
                  <span>HÀNH ĐỘNG #{index + 1}</span>
                  <button
                    type="button"
                    onClick={deleteAction}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa Action
                  </button>
                </div>

                {/* Trigger dropdown */}
                <SelectField
                  label="Khi thực hiện (Trigger)"
                  value={act.trigger}
                  options={[
                    { value: "ON_CLICK", label: "Nhấp chuột (ON_CLICK)" },
                    { value: "ON_DOUBLE_CLICK", label: "Nhấp đúp chuột (ON_DOUBLE_CLICK)" },
                    { value: "ON_HOVER", label: "Rê chuột qua (ON_HOVER)" },
                    { value: "ON_ENTER_VIEWPORT", label: "Xuất hiện trên màn hình (ON_ENTER)" },
                  ]}
                  onChange={updateActionTrigger}
                />

                {/* Action Type dropdown */}
                <SelectField
                  label="Thì sẽ làm (Action)"
                  value={act.type}
                  options={[
                    { value: "NAVIGATE_SLIDE", label: "Chuyển slide (NAVIGATE_SLIDE)" },
                    { value: "TOGGLE_VISIBILITY", label: "Ẩn / Hiện phần tử (TOGGLE_VISIBILITY)" },
                    { value: "PLAY_MEDIA", label: "Phát âm thanh / media (PLAY_MEDIA)" },
                    { value: "EVALUATE_ANSWER", label: "Chấm điểm đáp án (EVALUATE_ANSWER)" },
                  ]}
                  onChange={updateActionType}
                />

                {/* PAYLOAD CONFIGURATIONS */}
                {act.type === "NAVIGATE_SLIDE" && (
                  <div className="grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-2 mt-1">
                    <SelectField
                      label="Hướng đi"
                      value={act.payload?.direction || "NEXT"}
                      options={[
                        { value: "NEXT", label: "Tiếp theo" },
                        { value: "PREV", label: "Quay lại" },
                      ]}
                      onChange={(val) => updatePayload({ direction: val as "NEXT" | "PREV", targetSlideId: undefined })}
                    />
                    <SelectField
                      label="Hoặc Nhảy đến"
                      value={act.payload?.targetSlideId || ""}
                      options={[
                        { value: "", label: "Chọn slide..." },
                        ...slides.map((s, idx) => ({
                          value: s.id,
                          label: `Slide ${idx + 1}: ${s.id.slice(-5)}`,
                        })),
                      ]}
                      onChange={(val) => updatePayload({ targetSlideId: val, direction: undefined })}
                    />
                  </div>
                )}

                {act.type === "TOGGLE_VISIBILITY" && (
                  <div className="grid grid-cols-2 gap-1.5 border-t border-slate-100 pt-2 mt-1">
                    <SelectField
                      label="Phần tử đích"
                      value={act.payload?.targetElementId || ""}
                      options={[
                        { value: "", label: "Chọn..." },
                        ...otherElements.map((el: BuilderElement) => ({
                          value: el.id,
                          label: `${el.type}: ${el.id.slice(-5)}`,
                        })),
                      ]}
                      onChange={(val) => updatePayload({ targetElementId: val })}
                    />
                    <SelectField
                      label="Trạng thái"
                      value={act.payload?.action || "TOGGLE"}
                      options={[
                        { value: "SHOW", label: "Hiển thị" },
                        { value: "HIDE", label: "Ẩn đi" },
                        { value: "TOGGLE", label: "Đảo trạng thái" },
                      ]}
                      onChange={(val) => updatePayload({ action: val as "SHOW" | "HIDE" | "TOGGLE" })}
                    />
                  </div>
                )}

                {act.type === "PLAY_MEDIA" && (
                  <div className="space-y-1.5 border-t border-slate-100 pt-2 mt-1">
                    <TextField
                      label="Đường dẫn âm thanh URL (.mp3 / .wav)"
                      value={act.payload?.mediaUrl || ""}
                      onChange={(val) => updatePayload({ mediaUrl: val })}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`chk-loop-${index}`}
                        checked={act.payload?.loop || false}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePayload({ loop: e.target.checked })}
                        className="h-3.5 w-3.5 cursor-pointer accent-blue-500 rounded"
                      />
                      <label htmlFor={`chk-loop-${index}`} className="text-[10px] font-semibold text-slate-500 cursor-pointer">
                        Lặp lại vô hạn (Loop)
                      </label>
                    </div>
                  </div>
                )}

                {act.type === "EVALUATE_ANSWER" && (
                  <div className="space-y-2 border-t border-slate-100 pt-2 mt-1">
                    <SelectField
                      label="Chọn bài tập chấm điểm"
                      value={act.payload?.targetElementId || ""}
                      options={[
                        { value: "", label: "Tự động chấm..." },
                        ...currentSlide.elements
                          .filter((e: BuilderElement) => ["QUIZ", "SORTING", "MATCHING", "HOTSPOT"].includes(e.type))
                          .map((el: BuilderElement) => ({
                            value: el.id,
                            label: `Game ${el.type}: ${el.id.slice(-5)}`,
                          })),
                      ]}
                      onChange={(val) => updatePayload({ targetElementId: val })}
                    />
                    <TextField
                      label="Mã Khái niệm kỹ năng (Concept ID)"
                      value={act.payload?.conceptId || "concept-default"}
                      onChange={(val) => updatePayload({ conceptId: val })}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
