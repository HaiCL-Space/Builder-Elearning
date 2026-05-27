import React from "react"
import { useBuilderStore } from "@/pages/builder/model/use-builder-store"
import type { BuilderElement, HotspotZone } from "@/pages/builder/model/types"

export function useCanvasEvents(
  canvasRef: React.RefObject<HTMLDivElement | null>
) {
  const slides = useBuilderStore((state) => state.slides)
  const currentSlideIndex = useBuilderStore((state) => state.currentSlideIndex)
  const currentSlide = slides[currentSlideIndex]

  const draggingId = useBuilderStore((state) => state.draggingId)
  const dragOffset = useBuilderStore((state) => state.dragOffset)
  const resizing = useBuilderStore((state) => state.resizing)
  const draggingZone = useBuilderStore((state) => state.draggingZone)
  const resizingZone = useBuilderStore((state) => state.resizingZone)

  const setDraggingId = useBuilderStore((state) => state.setDraggingId)
  const setDragOffset = useBuilderStore((state) => state.setDragOffset)
  const setResizing = useBuilderStore((state) => state.setResizing)
  const setDraggingZone = useBuilderStore((state) => state.setDraggingZone)
  const setResizingZone = useBuilderStore((state) => state.setResizingZone)
  const setGuidelines = useBuilderStore((state) => state.setGuidelines)
  const setActiveTooltip = useBuilderStore((state) => state.setActiveTooltip)
  const setSelectedElementId = useBuilderStore(
    (state) => state.setSelectedElementId
  )
  const updateElement = useBuilderStore((state) => state.updateElement)

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

  const handleHotspotZoneResizeMouseDown = (
    e: React.MouseEvent,
    element: BuilderElement,
    zone: HotspotZone,
    handle: string
  ) => {
    e.stopPropagation()
    setSelectedElementId(element.id)
    setResizingZone({
      elementId: element.id,
      zoneId: zone.id,
      handle,
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
      const el = currentSlide.elements.find(
        (x: BuilderElement) => x.id === draggingId
      )
      if (!el) return

      const targetX = pos.x - dragOffset.x
      const targetY = pos.y - dragOffset.y
      const w = el.position.w
      const h = el.position.h

      let activeGuidelineX: number | undefined = undefined
      let activeGuidelineY: number | undefined = undefined

      const SNAP_THRESHOLD = 1.5

      const snapCandidatesX = [
        { value: 0, snapTo: 0, lineAt: 0 },
        { value: 50 - w / 2, snapTo: 50 - w / 2, lineAt: 50 },
        { value: 100 - w, snapTo: 100 - w, lineAt: 100 },
      ]

      const snapCandidatesY = [
        { value: 0, snapTo: 0, lineAt: 0 },
        { value: 50 - h / 2, snapTo: 50 - h / 2, lineAt: 50 },
        { value: 100 - h, snapTo: 100 - h, lineAt: 100 },
      ]

      currentSlide.elements.forEach((other: BuilderElement) => {
        if (other.id === draggingId) return
        const ox = other.position.x
        const oy = other.position.y
        const ow = other.position.w
        const oh = other.position.h

        snapCandidatesX.push(
          { value: ox, snapTo: ox, lineAt: ox },
          { value: ox + ow, snapTo: ox + ow, lineAt: ox + ow },
          { value: ox - w, snapTo: ox - w, lineAt: ox },
          { value: ox + ow - w, snapTo: ox + ow - w, lineAt: ox + ow },
          {
            value: ox + ow / 2 - w / 2,
            snapTo: ox + ow / 2 - w / 2,
            lineAt: ox + ow / 2,
          }
        )

        snapCandidatesY.push(
          { value: oy, snapTo: oy, lineAt: oy },
          { value: oy + oh, snapTo: oy + oh, lineAt: oy + oh },
          { value: oy - h, snapTo: oy - h, lineAt: oy },
          { value: oy + oh - h, snapTo: oy + oh - h, lineAt: oy + oh },
          {
            value: oy + oh / 2 - h / 2,
            snapTo: oy + oh / 2 - h / 2,
            lineAt: oy + oh / 2,
          }
        )
      })

      let closestX = targetX
      let minDiffX = SNAP_THRESHOLD
      snapCandidatesX.forEach((cand) => {
        const diff = Math.abs(targetX - cand.value)
        if (diff < minDiffX) {
          minDiffX = diff
          closestX = cand.snapTo
          activeGuidelineX = cand.lineAt
        }
      })

      let closestY = targetY
      let minDiffY = SNAP_THRESHOLD
      snapCandidatesY.forEach((cand) => {
        const diff = Math.abs(targetY - cand.value)
        if (diff < minDiffY) {
          minDiffY = diff
          closestY = cand.snapTo
          activeGuidelineY = cand.lineAt
        }
      })

      setGuidelines(
        activeGuidelineX !== undefined || activeGuidelineY !== undefined
          ? { x: activeGuidelineX, y: activeGuidelineY }
          : null
      )

      const snappedX = Math.max(0, Math.min(100 - w, closestX))
      const snappedY = Math.max(0, Math.min(100 - h, closestY))

      setActiveTooltip({
        x: Math.round(snappedX),
        y: Math.round(snappedY),
        w: Math.round(w),
        h: Math.round(h),
      })

      updateElement(currentSlideIndex, draggingId, (el) => ({
        ...el,
        position: {
          ...el.position,
          x: snappedX,
          y: snappedY,
        },
      }))
    }

    if (draggingZone) {
      const element = currentSlide.elements.find(
        (x: BuilderElement) => x.id === draggingZone.elementId
      )
      if (!element) return

      const pos = getRelativePosInElement(e, element)

      updateElement(currentSlideIndex, draggingZone.elementId, (el) => {
        if (el.type !== "HOTSPOT" && el.type !== "LABEL_IMAGE") return el

        const data = (el.data || {}) as unknown as {
          zones?: Array<HotspotZone>
        }

        const zones = (data.zones || []).map((z: HotspotZone) => {
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

    if (resizingZone) {
      const element = currentSlide.elements.find(
        (x: BuilderElement) => x.id === resizingZone.elementId
      )
      if (element) {
        const pos = getRelativePosInElement(e, element)

        updateElement(currentSlideIndex, resizingZone.elementId, (el) => {
          if (el.type !== "HOTSPOT" && el.type !== "LABEL_IMAGE") return el

          const data = (el.data || {}) as unknown as {
            zones?: Array<HotspotZone>
          }

          const zones = (data.zones || []).map((z: HotspotZone) => {
            if (z.id !== resizingZone.zoneId) return z

            const nextZ = { ...z }
            const handle = resizingZone.handle

            if (handle.includes("e")) {
              nextZ.xMax = Math.max(nextZ.xMin + 2, Math.min(100, pos.x))
            }
            if (handle.includes("s")) {
              nextZ.yMax = Math.max(nextZ.yMin + 2, Math.min(100, pos.y))
            }
            if (handle.includes("w")) {
              nextZ.xMin = Math.max(0, Math.min(nextZ.xMax - 2, pos.x))
            }
            if (handle.includes("n")) {
              nextZ.yMin = Math.max(0, Math.min(nextZ.yMax - 2, pos.y))
            }

            return nextZ
          })

          return {
            ...el,
            data: { ...(el.data as object), zones },
          } as unknown as BuilderElement
        })
      }
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

        setActiveTooltip({
          x: Math.round(p.x),
          y: Math.round(p.y),
          w: Math.round(p.w),
          h: Math.round(p.h),
        })

        return { ...el, position: p }
      })
    }
  }

  const handleMouseUp = () => {
    setDraggingId(null)
    setDraggingZone(null)
    setResizingZone(null)
    setResizing(null)
    setGuidelines(null)
    setActiveTooltip(null)
  }

  return {
    handleCanvasMouseDown,
    handleElementMouseDown,
    handleHotspotZoneMouseDown,
    handleHotspotZoneResizeMouseDown,
    handleResizeMouseDown,
    handleMouseMove,
    handleMouseUp,
  }
}
