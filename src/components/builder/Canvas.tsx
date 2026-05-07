import React from "react"
import type { BuilderElement } from "./types"
import type { HotspotZone } from "./canvas/types"
import { CanvasElement, CanvasGridOverlay, CanvasHeader } from "./canvas/index"

export function Canvas({
  canvasRef,
  currentSlideOrder,
  totalSlides,
  canPrev,
  canNext,
  onPrev,
  onNext,
  elements,
  selectedElementId,
  onCanvasMouseDown,
  onElementMouseDown,
  onHotspotZoneMouseDown,
  onDeleteElement,
  onResizeMouseDown,
}: {
  canvasRef: React.RefObject<HTMLDivElement | null>
  currentSlideOrder: number
  totalSlides: number
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
  elements: BuilderElement[]
  selectedElementId: string | null
  onCanvasMouseDown: (e: React.MouseEvent) => void
  onElementMouseDown: (e: React.MouseEvent, element: BuilderElement) => void
  onHotspotZoneMouseDown: (
    e: React.MouseEvent,
    element: BuilderElement,
    zone: HotspotZone
  ) => void
  onDeleteElement: (id: string) => void
  onResizeMouseDown: (
    e: React.MouseEvent,
    element: BuilderElement,
    handle: string
  ) => void
}) {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-slate-100 p-6">
      <CanvasHeader
        currentSlideOrder={currentSlideOrder}
        totalSlides={totalSlides}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={onPrev}
        onNext={onNext}
      />

      <div
        ref={canvasRef}
        data-canvas="true"
        className="relative w-full max-w-5xl overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xl"
        style={{ aspectRatio: "16/9" }}
        onMouseDown={onCanvasMouseDown}
      >
        <CanvasGridOverlay />

        {elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            onElementMouseDown={onElementMouseDown}
            onHotspotZoneMouseDown={onHotspotZoneMouseDown}
            onDeleteElement={onDeleteElement}
            onResizeMouseDown={onResizeMouseDown}
          />
        ))}
      </div>
    </main>
  )
}
