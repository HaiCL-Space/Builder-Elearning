import React from "react"
import type { BuilderElement } from "./types"
import { ElementPreview } from "./ElementPreview"
import { LayoutTemplate, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

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
    zone: { id: string; xMin: number; yMin: number; xMax: number; yMax: number }
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

      <div
        ref={canvasRef}
        data-canvas="true"
        className="relative w-full max-w-5xl overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xl"
        style={{ aspectRatio: "16/9" }}
        onMouseDown={onCanvasMouseDown}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {elements.map((element) => {
          const isSelected = selectedElementId === element.id
          const pos = element.position
          const baseStyle: React.CSSProperties = {
            position: "absolute",
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            width: `${pos.w}%`,
            height: `${pos.h}%`,
            overflow: "hidden",
            boxSizing: "border-box",
            ...element.style,
          }

          return (
            <div
              key={element.id}
              style={baseStyle}
              className={`group cursor-move ${
                isSelected
                  ? "ring-2 ring-blue-500"
                  : "hover:ring-1 hover:ring-blue-300"
              }`}
              onMouseDown={(e) => onElementMouseDown(e, element)}
            >
              <div className="pointer-events-none flex h-full w-full items-center justify-center overflow-hidden">
                <ElementPreview element={element} />
              </div>

              {/* interactive zones for HOTSPOT (drag/drop) */}
              {isSelected && element.type === "HOTSPOT" && (
                <div className="absolute inset-0">
                  {(
                    (
                      element.data as unknown as {
                        zones?: Array<{
                          id: string
                          xMin: number
                          yMin: number
                          xMax: number
                          yMax: number
                        }>
                      }
                    )?.zones || []
                  ).map((z) => {
                    const w = Math.max(0, z.xMax - z.xMin)
                    const h = Math.max(0, z.yMax - z.yMin)
                    return (
                      <div
                        key={z.id}
                        onMouseDown={(e) =>
                          onHotspotZoneMouseDown(e, element, z)
                        }
                        className="absolute rounded-sm border border-blue-600 bg-blue-500/20"
                        style={{
                          left: `${z.xMin}%`,
                          top: `${z.yMin}%`,
                          width: `${w}%`,
                          height: `${h}%`,
                          cursor: "move",
                        }}
                        title={`Drag zone: ${z.id}`}
                      />
                    )
                  })}
                </div>
              )}

              <div className="pointer-events-none absolute top-0 left-1 text-[9px] font-bold tracking-wider text-slate-400 uppercase opacity-60">
                {element.type}
              </div>

              {isSelected && (
                <>
                  <button
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => onDeleteElement(element.id)}
                    className="absolute -top-2 -right-2 z-20 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>

                  {["nw", "n", "ne", "w", "e", "sw", "s", "se"].map((h) => (
                    <div
                      key={h}
                      onMouseDown={(e) => onResizeMouseDown(e, element, h)}
                      className={`absolute z-10 h-2.5 w-2.5 rounded-sm border border-white bg-blue-500 shadow ${
                        h.includes("n")
                          ? "-top-1.5"
                          : h.includes("s")
                            ? "-bottom-1.5"
                            : "top-1/2 -translate-y-1/2"
                      } ${
                        h.includes("w")
                          ? "-left-1.5"
                          : h.includes("e")
                            ? "-right-1.5"
                            : "left-1/2 -translate-x-1/2"
                      }`}
                      style={{
                        cursor: `${h.includes("n") ? "n" : h.includes("s") ? "s" : ""}${
                          h.includes("w") ? "w" : h.includes("e") ? "e" : ""
                        }-resize`,
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
