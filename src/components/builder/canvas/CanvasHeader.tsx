import { LayoutTemplate, ChevronLeft, ChevronRight } from "lucide-react"

export function CanvasHeader({
  currentSlideOrder,
  totalSlides,
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  currentSlideOrder: number
  totalSlides: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="mb-3 flex w-full max-w-5xl items-center justify-between">
      <div className="flex items-center gap-2">
        <LayoutTemplate className="h-4 w-4 text-slate-500" />
        <h2 className="text-sm font-medium text-slate-600">
          Slide {currentSlideOrder} / {totalSlides}
        </h2>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={onNext}
          disabled={!canNext}
          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
