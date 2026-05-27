import type { BuilderElement } from "@/pages/builder/model/types"
import { Plus, X } from "lucide-react"
import { NumberField } from "@/shared/ui/fields"

interface CardItem {
  id: string
  value: string
}

interface MemoryCardEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
  onUpdateStyle: (patch: Record<string, unknown>) => void
}

export function MemoryCardEditor({
  selectedElement,
  onUpdateData,
  onUpdateStyle,
}: MemoryCardEditorProps) {
  const memoryData = (selectedElement.data || {}) as unknown as {
    cards?: CardItem[]
  }
  const cards = memoryData.cards || []

  return (
    <div className="space-y-4 border-t border-slate-100 pt-3.5">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Danh sách Thẻ nhớ
          </label>
          <button
            type="button"
            onClick={() => {
              const nextId = `c-${Date.now().toString(16).slice(-4)}`
              const nextCards = [...cards, { id: nextId, value: `Thẻ mới` }]
              onUpdateData({ cards: nextCards })
            }}
            className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
          >
            <Plus className="h-3 w-3" /> Thêm thẻ
          </button>
        </div>

        <div className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5">
          {cards.map((card) => {
            const updateCardText = (txt: string) => {
              const nextCards = cards.map((c) =>
                c.id === card.id ? { ...c, value: txt } : c
              )
              onUpdateData({ cards: nextCards })
            }

            const deleteCard = () => {
              const nextCards = cards.filter((c) => c.id !== card.id)
              onUpdateData({ cards: nextCards })
            }

            return (
              <div key={card.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={card.value}
                  onChange={(e) => updateCardText(e.target.value)}
                  className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={deleteCard}
                  className="shrink-0 rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
          {cards.length === 0 && (
            <div className="py-2 text-center text-[11px] text-slate-400">
              Chưa có thẻ nào. Nhấn "Thêm thẻ" để tạo.
            </div>
          )}
        </div>
      </div>

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
