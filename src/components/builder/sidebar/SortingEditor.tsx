import type { BuilderElement } from "../types"
import { Plus, ArrowUp, ArrowDown, X } from "lucide-react"

interface SortingItem {
  id: string
  content: string
}

interface SortingEditorProps {
  selectedElement: BuilderElement
  onUpdateData: (patch: Record<string, unknown>) => void
}

export function SortingEditor({
  selectedElement,
  onUpdateData,
}: SortingEditorProps) {
  const sortingData = (selectedElement.data || {}) as unknown as {
    items?: SortingItem[]
    correctOrder?: string[]
  }
  const items = sortingData.items || []

  return (
    <div className="space-y-4 border-t border-slate-100 pt-3.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Phần tử Sắp xếp (Theo thứ tự đúng)
        </label>
        <button
          type="button"
          onClick={() => {
            const nextId = `evt-${Date.now().toString(16).slice(-4)}`
            const nextItems = [
              ...items,
              { id: nextId, content: `Mốc lịch sử mới` },
            ]
            const nextOrder = [...nextItems.map((it) => it.id)]
            onUpdateData({ items: nextItems, correctOrder: nextOrder })
          }}
          className="flex items-center gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
        >
          <Plus className="h-3 w-3" /> Thêm mốc
        </button>
      </div>

      <div className="space-y-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
        {items.map((item, index) => {
          const updateItemText = (txt: string) => {
            const nextItems = items.map((it) =>
              it.id === item.id ? { ...it, content: txt } : it
            )
            onUpdateData({ items: nextItems })
          }

          const deleteItem = () => {
            const nextItems = items.filter((it) => it.id !== item.id)
            const nextOrder = nextItems.map((it) => it.id)
            onUpdateData({ items: nextItems, correctOrder: nextOrder })
          }

          const moveItem = (dir: "up" | "down") => {
            const targetIdx = dir === "up" ? index - 1 : index + 1
            if (targetIdx < 0 || targetIdx >= items.length) return
            const nextItems = [...items]
            const temp = nextItems[index]
            nextItems[index] = nextItems[targetIdx]
            nextItems[targetIdx] = temp

            // update correctOrder same as array order
            const nextOrder = nextItems.map((it) => it.id)
            onUpdateData({ items: nextItems, correctOrder: nextOrder })
          }

          return (
            <div key={item.id} className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-200 text-[10px] font-bold text-slate-600">
                {index + 1}
              </span>
              <input
                type="text"
                value={item.content}
                onChange={(e) => updateItemText(e.target.value)}
                className="flex-1 min-w-0 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
              />
              <div className="flex shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveItem("up")}
                  className="p-0.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => moveItem("down")}
                  className="p-0.5 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={deleteItem}
                  className="p-0.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
