import { Trash2 } from "lucide-react"

export function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <button
      onMouseDown={(e) => e.stopPropagation()}
      onClick={onDelete}
      className="absolute -top-2 -right-2 z-20 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
    >
      <Trash2 className="h-3 w-3" />
    </button>
  )
}
