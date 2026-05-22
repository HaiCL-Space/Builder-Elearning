import type { BuilderElement } from "@/pages/builder/model/types"
import { Plus, X } from "lucide-react"
import { TextArea, NumberField } from "@/shared/ui/fields"

interface SprintOption {
  id: string
  content: string
}

interface TimedSprintEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
}

export function TimedSprintEditor({
  selectedElement,
  onUpdateData,
  onUpdateStyle,
}: TimedSprintEditorProps) {
  const sprintData = (selectedElement.data || {}) as unknown as {
    question?: string
    duration?: number
    options?: SprintOption[]
    correctId?: string
  }
  const question = sprintData.question || ""
  const duration = sprintData.duration || 10
  const options = sprintData.options || []
  const correctId = sprintData.correctId || ""

  return (
    <div className="space-y-4 border-t border-slate-100 pt-3.5">
      {/* Question Field */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Nội dung Câu hỏi
        </label>
        <TextArea
          rows={2}
          value={question}
          onChange={(v) => onUpdateData({ question: v })}
        />
      </div>

      {/* Duration Field */}
      <NumberField
        label="Thời gian đếm ngược (giây)"
        value={duration}
        onChange={(v) => onUpdateData({ duration: Math.max(1, v) })}
      />

      {/* Options list Manager */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Các Phương án Trả lời
          </label>
          <button
            type="button"
            onClick={() => {
              const nextId = `ts-opt-${Date.now().toString(16).slice(-4)}`
              const nextOpts = [
                ...options,
                { id: nextId, content: `Phương án mới` },
              ]
              onUpdateData({ options: nextOpts })
            }}
            className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
          >
            <Plus className="h-3 w-3" /> Thêm đáp án
          </button>
        </div>

        <div className="space-y-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
          {options.map((opt) => {
            const isCorrect = correctId === opt.id

            const updateOptText = (txt: string) => {
              const nextOpts = options.map((o) =>
                o.id === opt.id ? { ...o, content: txt } : o
              )
              onUpdateData({ options: nextOpts })
            }

            const deleteOpt = () => {
              const nextOpts = options.filter((o) => o.id !== opt.id)
              const nextCorrect = correctId === opt.id ? "" : correctId
              onUpdateData({ options: nextOpts, correctId: nextCorrect })
            }

            return (
              <div key={opt.id} className="flex items-center gap-2">
                {/* Correct answer indicator */}
                <input
                  type="radio"
                  name="sidebar-correct-sprint-opt"
                  checked={isCorrect}
                  onChange={() => onUpdateData({ correctId: opt.id })}
                  title="Đánh dấu đáp án đúng"
                  className="h-3.5 w-3.5 cursor-pointer shrink-0 accent-emerald-500"
                />

                {/* Input text for option */}
                <input
                  type="text"
                  value={opt.content}
                  onChange={(e) => updateOptText(e.target.value)}
                  className="flex-1 min-w-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                />

                {/* Delete option */}
                <button
                  type="button"
                  onClick={deleteOpt}
                  className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
          {options.length === 0 && (
            <div className="text-center text-[11px] text-slate-400 py-2">
              Chưa có đáp án nào. Nhấn "Thêm đáp án".
            </div>
          )}
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
