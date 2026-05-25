import { LayoutTemplate, ChevronLeft, ChevronRight, PenTool, Play, Download, Save, Loader2 } from "lucide-react"
import { useBuilderStore } from "@/pages/builder/model/use-builder-store"

export function CanvasHeader({
  currentSlideOrder,
  totalSlides,
  canPrev,
  canNext,
  onPrev,
  onNext,
  isInteractiveMode,
  onToggleMode,
  onSave,
  isSaving,
}: {
  currentSlideOrder: number
  totalSlides: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
  isInteractiveMode: boolean
  onToggleMode: (interactive: boolean) => void
  onSave?: () => void
  isSaving?: boolean
}) {
  const slides = useBuilderStore((state) => state.slides)

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(slides, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "slides_export.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  return (
    <div className="mb-4 flex w-full max-w-5xl items-center justify-between gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-xs">
      {/* Left side: Slide info */}
      <div className="flex items-center gap-2">
        <LayoutTemplate className="h-4 w-4 text-slate-500" />
        <h2 className="text-xs font-semibold text-slate-600 tracking-wide">
          SLIDE {currentSlideOrder} / {totalSlides}
        </h2>
      </div>

      {/* Center: Mode switcher */}
      <div className="relative flex rounded-lg bg-slate-100 p-0.5 shadow-inner">
        {/* Slidder pill background (active state) */}
        <div
          className={`absolute top-0.5 bottom-0.5 rounded-md bg-white shadow-sm transition-all duration-200`}
          style={{
            width: "110px",
            left: isInteractiveMode ? "114px" : "2px",
          }}
        />

        <button
          onClick={() => onToggleMode(false)}
          className={`relative z-10 flex w-[110px] items-center justify-center gap-1.5 py-1.5 text-xs font-bold transition ${
            !isInteractiveMode ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <PenTool className="h-3.5 w-3.5" />
          <span>Thiết kế</span>
        </button>

        <button
          onClick={() => onToggleMode(true)}
          className={`relative z-10 flex w-[110px] items-center justify-center gap-1.5 py-1.5 text-xs font-bold transition ${
            isInteractiveMode ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Play className="h-3.5 w-3.5" />
          <span>Trải nghiệm</span>
        </button>
      </div>

      {/* Right side: Nav controls */}
      <div className="flex items-center gap-2">
        {onSave && (
          <button
            onClick={onSave}
            disabled={isSaving}
            className={`inline-flex h-8 px-3 items-center justify-center gap-1.5 rounded-lg border text-white font-medium text-xs transition mr-1.5 cursor-pointer ${
              isSaving
                ? "bg-slate-300 border-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 border-blue-600 hover:bg-blue-500 hover:border-blue-500 shadow-sm"
            }`}
            title="Lưu thiết kế"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>{isSaving ? "Đang lưu..." : "Lưu thiết kế"}</span>
          </button>
        )}
        <button
          onClick={handleExportJson}
          className="inline-flex h-8 px-3 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium text-xs transition hover:bg-slate-50 hover:text-blue-600 mr-2 cursor-pointer"
          title="Export JSON"
        >
          <Download className="h-4 w-4" />
          <span>Export JSON</span>
        </button>
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-white cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-white cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
export default CanvasHeader
