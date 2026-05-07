import { PanelLeft } from "lucide-react"
import { ELEMENT_TYPES } from "./templates"

export function LeftSidebar({
  onAddElement,
}: {
  onAddElement: (type: string) => void
}) {
  return (
    <aside className="flex w-56 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
        <PanelLeft className="h-4 w-4 text-slate-500" />
        <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase">
          Thành phần
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2 p-3">
        {ELEMENT_TYPES.map((et) => (
          <button
            key={et.type}
            onClick={() => onAddElement(et.type)}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-blue-400 hover:bg-blue-50"
          >
            <et.icon className="h-5 w-5 text-slate-600" />
            <span className="text-[11px] font-medium text-slate-700">
              {et.label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  )
}
