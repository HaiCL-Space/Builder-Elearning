import React, { useState, useRef, useCallback } from "react"
import type { BuilderElement } from "./types"
import { MOCK_SLIDES } from "../../lib/mock-slides"
import { ELEMENT_TEMPLATES } from "./templates"
import { uid } from "./utils"
import { LeftSidebar } from "./LeftSidebar"
import { Canvas } from "./Canvas"
import { RightSidebar } from "./RightSidebar"

export function SlideBuilder() {
  const [slides, setSlides] = useState<typeof MOCK_SLIDES>(() =>
    JSON.parse(JSON.stringify(MOCK_SLIDES))
  )
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const currentSlide = slides[currentSlideIndex]

  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  )
  const selectedElement =
    currentSlide.elements.find((e) => e.id === selectedElementId) || null

  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizing, setResizing] = useState<{
    id: string
    handle: string
  } | null>(null)

  const [draggingZone, setDraggingZone] = useState<{
    elementId: string
    zoneId: string
    offsetX: number
    offsetY: number
  } | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)

  const updateElement = useCallback(
    (
      slideIndex: number,
      elementId: string,
      updater: (el: BuilderElement) => BuilderElement
    ) => {
      setSlides((prev) =>
        prev.map((slide, idx) =>
          idx === slideIndex
            ? {
                ...slide,
                elements: slide.elements.map((el) =>
                  el.id === elementId ? updater(el) : el
                ),
              }
            : slide
        )
      )
    },
    []
  )

  const updateSelectedPosition = (
    patch: Partial<BuilderElement["position"]>
  ) => {
    if (!selectedElementId) return
    updateElement(currentSlideIndex, selectedElementId, (el) => ({
      ...el,
      position: { ...el.position, ...patch } as BuilderElement["position"],
    }))
  }

  const updateSelectedStyle = (patch: Record<string, unknown>) => {
    if (!selectedElementId) return
    updateElement(currentSlideIndex, selectedElementId, (el) => ({
      ...el,
      style: { ...el.style, ...patch },
    }))
  }

  const updateSelectedData = (patch: Record<string, unknown>) => {
    if (!selectedElementId) return
    updateElement(currentSlideIndex, selectedElementId, (el) => ({
      ...el,
      data: { ...el.data, ...patch },
    }))
  }

  const handleAddElement = (type: string) => {
    const template = ELEMENT_TEMPLATES[type]
    if (!template) return
    const newEl = {
      id: uid(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: type as any,
      position: { x: 10, y: 10, w: 30, h: 20 },
      style: {},
      data: {},
      ...template,
    } as BuilderElement

    setSlides((prev) =>
      prev.map((slide, idx) =>
        idx === currentSlideIndex
          ? { ...slide, elements: [...slide.elements, newEl] }
          : slide
      )
    )
    setSelectedElementId(newEl.id)
  }

  const handleDeleteElement = (id: string) => {
    setSlides((prev) =>
      prev.map((slide, idx) =>
        idx === currentSlideIndex
          ? { ...slide, elements: slide.elements.filter((e) => e.id !== id) }
          : slide
      )
    )
    if (selectedElementId === id) setSelectedElementId(null)
  }

  const getRelativePos = (e: React.MouseEvent | MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    }
  }

  const getRelativePosInElement = (
    e: React.MouseEvent | MouseEvent,
    element: BuilderElement
  ) => {
    const canvasPos = getRelativePos(e)
    const x = ((canvasPos.x - element.position.x) / element.position.w) * 100
    const y = ((canvasPos.y - element.position.y) / element.position.h) * 100
    return { x, y }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (
      e.target === canvasRef.current ||
      (e.target as HTMLElement).dataset?.canvas === "true"
    ) {
      setSelectedElementId(null)
    }
  }

  const handleElementMouseDown = (
    e: React.MouseEvent,
    element: BuilderElement
  ) => {
    e.stopPropagation()
    setSelectedElementId(element.id)
    setDraggingId(element.id)
    const pos = getRelativePos(e)
    setDragOffset({
      x: pos.x - element.position.x,
      y: pos.y - element.position.y,
    })
  }

  const handleHotspotZoneMouseDown = (
    e: React.MouseEvent,
    element: BuilderElement,
    zone: { id: string; xMin: number; yMin: number }
  ) => {
    e.stopPropagation()
    setSelectedElementId(element.id)

    const pos = getRelativePosInElement(e, element)
    setDraggingZone({
      elementId: element.id,
      zoneId: zone.id,
      offsetX: pos.x - zone.xMin,
      offsetY: pos.y - zone.yMin,
    })
  }

  const handleResizeMouseDown = (
    e: React.MouseEvent,
    element: BuilderElement,
    handle: string
  ) => {
    e.stopPropagation()
    setResizing({ id: element.id, handle })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId) {
      const pos = getRelativePos(e)
      updateElement(currentSlideIndex, draggingId, (el) => ({
        ...el,
        position: {
          ...el.position,
          x: Math.max(0, Math.min(100 - el.position.w, pos.x - dragOffset.x)),
          y: Math.max(0, Math.min(100 - el.position.h, pos.y - dragOffset.y)),
        },
      }))
    }

    if (draggingZone) {
      const element = currentSlide.elements.find(
        (x) => x.id === draggingZone.elementId
      )
      if (!element) return

      const pos = getRelativePosInElement(
        e,
        element as unknown as BuilderElement
      )

      updateElement(currentSlideIndex, draggingZone.elementId, (el) => {
        if (el.type !== "HOTSPOT") return el

        const data = (el.data || {}) as unknown as {
          zones?: Array<{
            id: string
            xMin: number
            yMin: number
            xMax: number
            yMax: number
          }>
        }

        const zones = (data.zones || []).map((z) => {
          if (z.id !== draggingZone.zoneId) return z
          const w = z.xMax - z.xMin
          const h = z.yMax - z.yMin

          const newXMin = Math.max(
            0,
            Math.min(100 - w, pos.x - draggingZone.offsetX)
          )
          const newYMin = Math.max(
            0,
            Math.min(100 - h, pos.y - draggingZone.offsetY)
          )

          return {
            ...z,
            xMin: newXMin,
            yMin: newYMin,
            xMax: newXMin + w,
            yMax: newYMin + h,
          }
        })

        return {
          ...el,
          data: { ...(el.data as object), zones },
        } as unknown as BuilderElement
      })
    }

    if (resizing) {
      const pos = getRelativePos(e)
      updateElement(currentSlideIndex, resizing.id, (el) => {
        const p = { ...el.position }
        if (resizing.handle.includes("e"))
          p.w = Math.max(5, Math.min(100 - p.x, pos.x - p.x))
        if (resizing.handle.includes("s"))
          p.h = Math.max(5, Math.min(100 - p.y, pos.y - p.y))
        if (resizing.handle.includes("w")) {
          const right = p.x + p.w
          p.x = Math.max(0, Math.min(right - 5, pos.x))
          p.w = right - p.x
        }
        if (resizing.handle.includes("n")) {
          const bottom = p.y + p.h
          p.y = Math.max(0, Math.min(bottom - 5, pos.y))
          p.h = bottom - p.y
        }
        return { ...el, position: p }
      })
    }
  }

  const handleMouseUp = () => {
    setDraggingId(null)
    setDraggingZone(null)
    setResizing(null)
  }

  const handleNext = () =>
    setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))
  const handlePrev = () => setCurrentSlideIndex((i) => Math.max(0, i - 1))

  return (
    <div
      className="flex h-screen w-full bg-slate-50 text-slate-900 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <LeftSidebar onAddElement={handleAddElement} />

      <Canvas
        canvasRef={canvasRef}
        currentSlideOrder={currentSlide.order}
        totalSlides={slides.length}
        canPrev={currentSlideIndex !== 0}
        canNext={currentSlideIndex !== slides.length - 1}
        onPrev={handlePrev}
        onNext={handleNext}
        elements={currentSlide.elements as unknown as BuilderElement[]}
        selectedElementId={selectedElementId}
        onCanvasMouseDown={handleCanvasMouseDown}
        onElementMouseDown={handleElementMouseDown}
        onHotspotZoneMouseDown={handleHotspotZoneMouseDown}
        onDeleteElement={handleDeleteElement}
        onResizeMouseDown={handleResizeMouseDown}
      />

      <RightSidebar
        selectedElement={selectedElement as unknown as BuilderElement | null}
        onUpdatePosition={updateSelectedPosition}
        onUpdateStyle={updateSelectedStyle}
        onUpdateData={updateSelectedData}
        onDeleteSelected={() =>
          selectedElement ? handleDeleteElement(selectedElement.id) : undefined
        }
      />
    </div>
  )
}

export default SlideBuilder
