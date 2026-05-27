import type { BuilderElement } from "@/pages/builder/model/types"
import { Plus, X } from "lucide-react"
import { TextArea, NumberField } from "@/shared/ui/fields"

interface FillBlankEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
}

export function FillBlankEditor({
  selectedElement,
  onUpdateData,
  onUpdateStyle,
}: FillBlankEditorProps) {
  const blankData = (selectedElement.data || {}) as unknown as {
    question?: string
    correctAnswers?: string[]
    caseSensitive?: boolean
  }
  const question = blankData.question || ""
  const correctAnswers = blankData.correctAnswers || []
  const caseSensitive = blankData.caseSensitive ?? false

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

      {/* Correct Answers List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Các Đáp án Đúng
          </label>
          <button
            type="button"
            onClick={() => {
              const nextAnswers = [...correctAnswers, "Đáp án mới"]
              onUpdateData({ correctAnswers: nextAnswers })
            }}
            className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
          >
            <Plus className="h-3 w-3" /> Thêm đáp án
          </button>
        </div>

        <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5">
          {correctAnswers.map((answer, index) => {
            const updateAnswerText = (txt: string) => {
              const nextAnswers = correctAnswers.map((ans, idx) =>
                idx === index ? txt : ans
              )
              onUpdateData({ correctAnswers: nextAnswers })
            }

            const deleteAnswer = () => {
              const nextAnswers = correctAnswers.filter(
                (_, idx) => idx !== index
              )
              onUpdateData({ correctAnswers: nextAnswers })
            }

            return (
              <div key={`fb-ans-${index}`} className="flex items-center gap-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => updateAnswerText(e.target.value)}
                  className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={deleteAnswer}
                  className="shrink-0 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
          {correctAnswers.length === 0 && (
            <div className="py-2 text-center text-[11px] text-slate-400">
              Chưa có đáp án nào. Nhấn "Thêm đáp án".
            </div>
          )}
        </div>
      </div>

      {/* Case Sensitive Option */}
      <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2.5">
        <input
          type="checkbox"
          id="fb-case-sensitive"
          checked={caseSensitive}
          onChange={(e) => onUpdateData({ caseSensitive: e.target.checked })}
          className="h-3.5 w-3.5 cursor-pointer rounded border-slate-300 accent-blue-500 focus:ring-blue-500"
        />
        <label
          htmlFor="fb-case-sensitive"
          className="cursor-pointer text-xs font-semibold text-slate-600 select-none"
        >
          Phân biệt chữ hoa / thường
        </label>
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
