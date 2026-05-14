import { LayoutTemplate, ChevronLeft, ChevronRight, PenTool, Play } from "lucide-react"

export function CanvasHeader({
  currentSlideOrder,
  totalSlides,
  canPrev,
  canNext,
  onPrev,
  onNext,
  isInteractiveMode,
  onToggleMode,
}: {
  currentSlideOrder: number
  totalSlides: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
  isInteractiveMode: boolean
  onToggleMode: (interactive: boolean) => void
}) {
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
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
export default CanvasHeader
