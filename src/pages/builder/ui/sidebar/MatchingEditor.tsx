import type { BuilderElement } from "@/pages/builder/model/types"
import { Plus } from "lucide-react"

interface ColumnItem {
  id: string
  content: string
}

interface MatchingEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
}

export function MatchingEditor({
  selectedElement,
  onUpdateData,
}: MatchingEditorProps) {
  const matchingData = (selectedElement.data || {}) as unknown as {
    leftColumn?: ColumnItem[]
    rightColumn?: ColumnItem[]
    correctPairs?: [string, string][]
  }
  const leftCol = matchingData.leftColumn || []
  const rightCol = matchingData.rightColumn || []
  const correctPairs = matchingData.correctPairs || []

  return (
    <div className="space-y-4 border-t border-slate-100 pt-3.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Các cặp ghép từ đúng (A - B)
        </label>
        <button
          type="button"
          onClick={() => {
            const pairId = Date.now().toString(16).slice(-4)
            const leftId = `en-${pairId}`
            const rightId = `vi-${pairId}`

            const nextLeft = [...leftCol, { id: leftId, content: "Từ khóa A" }]
            const nextRight = [
              ...rightCol,
              { id: rightId, content: "Ý nghĩa B" },
            ]
            const nextPairs = [
              ...correctPairs,
              [leftId, rightId] as [string, string],
            ]

            onUpdateData({
              leftColumn: nextLeft,
              rightColumn: nextRight,
              correctPairs: nextPairs,
            })
          }}
          className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
        >
          <Plus className="h-3 w-3" /> Thêm cặp từ
        </button>
      </div>

      <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50/50 p-2.5">
        {correctPairs.map((pair, index) => {
          const leftItem = leftCol.find((x) => x.id === pair[0])
          const rightItem = rightCol.find((x) => x.id === pair[1])

          if (!leftItem || !rightItem) return null

          const updateLeftText = (txt: string) => {
            const nextLeft = leftCol.map((it) =>
              it.id === pair[0] ? { ...it, content: txt } : it
            )
            onUpdateData({ leftColumn: nextLeft })
          }

          const updateRightText = (txt: string) => {
            const nextRight = rightCol.map((it) =>
              it.id === pair[1] ? { ...it, content: txt } : it
            )
            onUpdateData({ rightColumn: nextRight })
          }

          const deletePair = () => {
            const nextLeft = leftCol.filter((it) => it.id !== pair[0])
            const nextRight = rightCol.filter((it) => it.id !== pair[1])
            const nextPairs = correctPairs.filter(
              (p) => p[0] !== pair[0] && p[1] !== pair[1]
            )
            onUpdateData({
              leftColumn: nextLeft,
              rightColumn: nextRight,
              correctPairs: nextPairs,
            })
          }

          return (
            <div
              key={`${pair[0]}-${pair[1]}`}
              className="border-slate-150 space-y-1.5 border-b pb-2.5 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-between text-[9px] font-bold text-slate-400">
                <span>CẶP #{index + 1}</span>
                <button
                  type="button"
                  onClick={deletePair}
                  className="text-slate-400 hover:text-red-500"
                >
                  Xóa
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="mb-0.5 block text-[8px] font-semibold text-blue-500">
                    Bên trái
                  </span>
                  <input
                    type="text"
                    value={leftItem.content}
                    onChange={(e) => updateLeftText(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <span className="mb-0.5 block text-[8px] font-semibold text-pink-500">
                    Bên phải
                  </span>
                  <input
                    type="text"
                    value={rightItem.content}
                    onChange={(e) => updateRightText(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
