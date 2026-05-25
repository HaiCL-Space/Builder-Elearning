import type { BuilderElement } from "@/pages/builder/model/types"
import { TextArea, NumberField } from "@/shared/ui/fields"

interface SwipeEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
}

export function SwipeEditor({
  selectedElement,
  onUpdateData,
  onUpdateStyle,
}: SwipeEditorProps) {
  const swipeData = (selectedElement.data || {}) as unknown as {
    statement?: string
    correctDirection?: "left" | "right"
  }
  const statement = swipeData.statement || ""
  const correctDirection = swipeData.correctDirection || "right"

  return (
    <div className="space-y-4 border-t border-slate-100 pt-3.5">
      {/* Statement text input */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Nội dung khẳng định trên Thẻ
        </label>
        <TextArea
          rows={2}
          value={statement}
          onChange={(v) => onUpdateData({ statement: v })}
        />
      </div>

      {/* Correct swipe direction */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Đáp án Đúng (Hướng quẹt)
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onUpdateData({ correctDirection: "right" })}
            className={`flex-1 py-2 text-xs font-bold rounded-md border transition ${
              correctDirection === "right"
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            ĐÚNG (Quẹt Phải)
          </button>
          <button
            type="button"
            onClick={() => onUpdateData({ correctDirection: "left" })}
            className={`flex-1 py-2 text-xs font-bold rounded-md border transition ${
              correctDirection === "left"
                ? "bg-red-50 border-red-500 text-red-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            SAI (Quẹt Trái)
          </button>
        </div>
      </div>

      {/* Border Radius Style */}
      <NumberField
        label="Border radius"
        value={Number(
          ((
            selectedElement.style as unknown as {
              borderRadius?: number | string
            }
          )?.borderRadius as number | string) ?? 12
        )}
        onChange={(v) => onUpdateStyle({ borderRadius: v })}
      />
    </div>
  )
}
