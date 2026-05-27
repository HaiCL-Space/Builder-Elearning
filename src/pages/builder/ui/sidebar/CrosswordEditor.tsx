import type { BuilderElement } from "@/pages/builder/model/types"
import { Plus, X } from "lucide-react"
import { TextField, NumberField } from "@/shared/ui/fields"

interface CrosswordClue {
  id: string
  number: number
  question: string
  answer: string
  row: number
  col: number
  direction: "across" | "down"
}

interface CrosswordEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
}

export function CrosswordEditor({
  selectedElement,
  onUpdateData,
  onUpdateStyle,
}: CrosswordEditorProps) {
  const crosswordData = (selectedElement.data || {}) as unknown as {
    gridRows?: number
    gridCols?: number
    clues?: CrosswordClue[]
    caseSensitive?: boolean
  }

  const gridRows = crosswordData.gridRows ?? 5
  const gridCols = crosswordData.gridCols ?? 5
  const clues = crosswordData.clues ?? []
  const caseSensitive = crosswordData.caseSensitive ?? false

  return (
    <div className="space-y-4 border-t border-slate-100 pt-3.5">
      <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        Cấu hình Ô Chữ (Crossword)
      </div>

      {/* Grid Settings */}
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5">
        <NumberField
          label="Số hàng lưới"
          value={gridRows}
          onChange={(v) =>
            onUpdateData({ gridRows: Math.max(2, Math.min(12, v)) })
          }
        />
        <NumberField
          label="Số cột lưới"
          value={gridCols}
          onChange={(v) =>
            onUpdateData({ gridCols: Math.max(2, Math.min(12, v)) })
          }
        />
      </div>

      {/* Case Sensitive Toggle */}
      <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5">
        <label className="text-xs font-semibold text-slate-600">
          Phân biệt Hoa/Thường
        </label>
        <input
          type="checkbox"
          checked={caseSensitive}
          onChange={(e) => onUpdateData({ caseSensitive: e.target.checked })}
          className="h-4 w-4 cursor-pointer accent-blue-500"
        />
      </div>

      {/* Clues Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Danh sách Manh Mối ({clues.length})
          </label>
          <button
            type="button"
            onClick={() => {
              const nextId = `clue-${Date.now().toString(16).slice(-4)}`
              const nextClues = [
                ...clues,
                {
                  id: nextId,
                  number: clues.length + 1,
                  question: "Gợi ý mới",
                  answer: "ABC",
                  row: 0,
                  col: 0,
                  direction: "across" as const,
                },
              ]
              onUpdateData({ clues: nextClues })
            }}
            className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
          >
            <Plus className="h-3 w-3" /> Thêm gợi ý
          </button>
        </div>

        {clues.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-4 text-center text-xs text-slate-400">
            Chưa có gợi ý ô chữ nào
          </div>
        ) : (
          <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
            {clues.map((clue) => {
              const updateClue = (patch: Partial<CrosswordClue>) => {
                const nextClues = clues.map((c) =>
                  c.id === clue.id ? { ...c, ...patch } : c
                )
                onUpdateData({ clues: nextClues })
              }

              const deleteClue = () => {
                const nextClues = clues
                  .filter((c) => c.id !== clue.id)
                  // Re-index clue numbers cleanly
                  .map((c, i) => ({ ...c, number: i + 1 }))
                onUpdateData({ clues: nextClues })
              }

              return (
                <div
                  key={clue.id}
                  className="relative space-y-2.5 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5"
                >
                  {/* Clue Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-[10px] font-bold text-slate-500">
                      GỢI Ý #{clue.number}
                    </span>
                    <button
                      type="button"
                      onClick={deleteClue}
                      className="rounded p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Question & Answer Inputs */}
                  <div className="space-y-2">
                    <TextField
                      label="Câu hỏi gợi ý"
                      value={clue.question}
                      onChange={(v) => updateClue({ question: v })}
                    />
                    <TextField
                      label="Đáp án (Từ khóa)"
                      value={clue.answer}
                      onChange={(v) =>
                        updateClue({ answer: v.toUpperCase().trim() })
                      }
                    />
                  </div>

                  {/* Coordinates & Direction */}
                  <div className="grid grid-cols-2 gap-2 border-t border-slate-100/60 pt-1">
                    <div>
                      <label className="mb-1 block text-[9px] font-bold text-slate-400 uppercase">
                        Hướng đi
                      </label>
                      <select
                        value={clue.direction}
                        onChange={(e) =>
                          updateClue({
                            direction: e.target.value as "across" | "down",
                          })
                        }
                        className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                      >
                        <option value="across">Hàng ngang</option>
                        <option value="down">Hàng dọc</option>
                      </select>
                    </div>

                    <NumberField
                      label="Số thứ tự số"
                      value={clue.number}
                      onChange={(v) => updateClue({ number: Math.max(1, v) })}
                    />

                    <NumberField
                      label="Dòng bắt đầu (0-based)"
                      value={clue.row}
                      onChange={(v) =>
                        updateClue({
                          row: Math.max(0, Math.min(gridRows - 1, v)),
                        })
                      }
                    />
                    <NumberField
                      label="Cột bắt đầu (0-based)"
                      value={clue.col}
                      onChange={(v) =>
                        updateClue({
                          col: Math.max(0, Math.min(gridCols - 1, v)),
                        })
                      }
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Style settings */}
      <NumberField
        label="Bo góc viền (Radius)"
        value={Number(
          ((
            selectedElement.style as unknown as {
              borderRadius?: number | string
            }
          )?.borderRadius as number | string) ?? 16
        )}
        onChange={(v) => onUpdateStyle({ borderRadius: v })}
      />
    </div>
  )
}
