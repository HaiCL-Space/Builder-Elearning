import { useState } from "react"
import { ACTION_TYPES, type ElementAction } from "broker-core-sdk"
import { MOCK_SLIDES } from "@/shared/api/mock-slides"
import { THEME_BACKGROUNDS } from "@/shared/lib/builder-utils"
import CanvasElement from "@/pages/builder/ui/canvas/CanvasElement"
import type { BuilderElement } from "@/pages/builder/model/types"

function getInitiallyHiddenElements(slide: (typeof MOCK_SLIDES)[number]) {
  const initiallyHidden = new Set<string>()

  slide.elements.forEach((element) => {
    if (element.style?.opacity === 0) initiallyHidden.add(element.id)
  })

  return initiallyHidden
}

export function ViewerPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const currentSlide = MOCK_SLIDES[currentSlideIndex]
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(() =>
    getInitiallyHiddenElements(currentSlide)
  )

  const handleNext = () => {
    setCurrentSlideIndex((index) => {
      const nextIndex = Math.min(MOCK_SLIDES.length - 1, index + 1)
      setHiddenElements(getInitiallyHiddenElements(MOCK_SLIDES[nextIndex]))
      return nextIndex
    })
  }

  const handlePrev = () => {
    setCurrentSlideIndex((index) => {
      const nextIndex = Math.max(0, index - 1)
      setHiddenElements(getInitiallyHiddenElements(MOCK_SLIDES[nextIndex]))
      return nextIndex
    })
  }

  const executeAction = (action: ElementAction) => {
    switch (action.type) {
      case ACTION_TYPES.NAVIGATE_SLIDE:
        if (action.payload.direction === "NEXT") handleNext()
        if (action.payload.direction === "PREV") handlePrev()
        break

      case ACTION_TYPES.TOGGLE_VISIBILITY: {
        const targetId = action.payload.targetElementId

        setHiddenElements((previous) => {
          const next = new Set(previous)

          if (action.payload.action === "SHOW") next.delete(targetId)
          else if (action.payload.action === "HIDE") next.add(targetId)
          else if (next.has(targetId)) next.delete(targetId)
          else next.add(targetId)

          return next
        })
        break
      }

      case ACTION_TYPES.EVALUATE_ANSWER:
        alert(
          `[Viewer] Đang chấm điểm cho Element: ${action.payload.targetElementId}\nCập nhật tiến trình cho Concept: ${action.payload.conceptId}`
        )
        break

      case ACTION_TYPES.PLAY_MEDIA:
        console.log("Phát media:", action.payload.mediaUrl)
        break
    }
  }

  const themeBg = THEME_BACKGROUNDS[currentSlide.config?.theme || "light"] || THEME_BACKGROUNDS.light

  const renderedElements = currentSlide.elements.map((element) => {
    if (!hiddenElements.has(element.id)) {
      if (element.style?.opacity === 0) {
        return {
          ...element,
          style: {
            ...element.style,
            opacity: 1,
          },
        }
      }

      return element
    }

    return {
      ...element,
      style: {
        ...element.style,
        opacity: 0,
        pointerEvents: "none",
      },
    }
  }) as BuilderElement[]

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-950 text-slate-50">
      <div className="border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Viewer
            </div>
            <div className="text-sm text-slate-300">
              Slide {currentSlide.order} / {MOCK_SLIDES.length}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Quay lại
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === MOCK_SLIDES.length - 1}
              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Tiếp theo
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 min-h-0 items-center justify-center overflow-hidden px-4 py-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_30%)]" />

        <div
          className="relative h-full w-auto max-w-full overflow-hidden rounded-[28px] border border-white/10 shadow-2xl shadow-cyan-950/30"
          style={{ aspectRatio: "16 / 9", ...themeBg }}
        >
          {renderedElements.map((element) => (
            <CanvasElement
              key={`${element.id}-${currentSlideIndex}`}
              element={element}
              isSelected={false}
              onElementMouseDown={() => undefined}
              onHotspotZoneMouseDown={() => undefined}
              onHotspotZoneResizeMouseDown={() => undefined}
              onDeleteElement={() => undefined}
              onResizeMouseDown={() => undefined}
              isInteractiveMode={true}
              onAction={executeAction}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ViewerPage