import React, { useRef } from "react"
import type { BuilderElement } from "@/pages/builder/model/types"
import { LeftSidebar } from "@/pages/builder/ui/left-sidebar"
import { Canvas } from "@/pages/builder/ui/canvas"
import { RightSidebar } from "@/pages/builder/ui/right-sidebar"
import { learningEngine, gameEngine } from "@broker/core-sdk"
import { useBuilderStore } from "@/pages/builder/model/use-builder-store"

import type { Slide, ElementAction, MultipleChoiceData } from "@broker/core-sdk"

interface HotspotZone {
  id: string
  xMin: number
  yMin: number
  xMax: number
  yMax: number
  label?: string
}

export function SlideBuilder() {
  const slides = useBuilderStore((state) => state.slides)
  const currentSlideIndex = useBuilderStore((state) => state.currentSlideIndex)
  const currentSlide = slides[currentSlideIndex]

  const selectedElementId = useBuilderStore((state) => state.selectedElementId)
  const selectedElement =
    currentSlide.elements.find((e: BuilderElement) => e.id === selectedElementId) || null

  const isInteractiveMode = useBuilderStore((state) => state.isInteractiveMode)
  const guidelines = useBuilderStore((state) => state.guidelines)
  const activeTooltip = useBuilderStore((state) => state.activeTooltip)

  const draggingId = useBuilderStore((state) => state.draggingId)
  const dragOffset = useBuilderStore((state) => state.dragOffset)
  const resizing = useBuilderStore((state) => state.resizing)
  const draggingZone = useBuilderStore((state) => state.draggingZone)

  // Actions from Zustand store
  const setCurrentSlideIndex = useBuilderStore((state) => state.setCurrentSlideIndex)
  const setSelectedElementId = useBuilderStore((state) => state.setSelectedElementId)
  const setGuidelines = useBuilderStore((state) => state.setGuidelines)
  const setActiveTooltip = useBuilderStore((state) => state.setActiveTooltip)
  const setDraggingId = useBuilderStore((state) => state.setDraggingId)
  const setDragOffset = useBuilderStore((state) => state.setDragOffset)
  const setResizing = useBuilderStore((state) => state.setResizing)
  const setDraggingZone = useBuilderStore((state) => state.setDraggingZone)

  const updateElement = useBuilderStore((state) => state.updateElement)
  const updateSelectedPosition = useBuilderStore((state) => state.updateSelectedPosition)
  const updateSelectedStyle = useBuilderStore((state) => state.updateSelectedStyle)
  const updateSelectedData = useBuilderStore((state) => state.updateSelectedData)
  const updateSelectedActions = useBuilderStore((state) => state.updateSelectedActions)
  const updateSelectedAnimations = useBuilderStore((state) => state.updateSelectedAnimations)

  const handleAddElement = useBuilderStore((state) => state.handleAddElement)
  const handleDeleteElement = useBuilderStore((state) => state.handleDeleteElement)
  const handleSelectSlide = useBuilderStore((state) => state.handleSelectSlide)
  const handleAddSlide = useBuilderStore((state) => state.handleAddSlide)
  const handleDeleteSlide = useBuilderStore((state) => state.handleDeleteSlide)
  const handleDuplicateSlide = useBuilderStore((state) => state.handleDuplicateSlide)
  const handleMoveSlide = useBuilderStore((state) => state.handleMoveSlide)
  const handleToggleMode = useBuilderStore((state) => state.handleToggleMode)

  const canvasRef = useRef<HTMLDivElement>(null)

  /* ==========================================
     COORDINATES & MOUSE EVENTS WITH SNAPPING
     ========================================== */
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

  const handleElementMouseDown = (e: React.MouseEvent, element: BuilderElement) => {
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
      const el = currentSlide.elements.find((x: BuilderElement) => x.id === draggingId)
      if (!el) return

      const targetX = pos.x - dragOffset.x
      const targetY = pos.y - dragOffset.y
      const w = el.position.w
      const h = el.position.h

      let activeGuidelineX: number | undefined = undefined
      let activeGuidelineY: number | undefined = undefined

      const SNAP_THRESHOLD = 1.5

      // Snap candidates for Canvas boundary and center
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

      // Snap candidates for aligning with other elements
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
          { value: ox + ow / 2 - w / 2, snapTo: ox + ow / 2 - w / 2, lineAt: ox + ow / 2 }
        )

        snapCandidatesY.push(
          { value: oy, snapTo: oy, lineAt: oy },
          { value: oy + oh, snapTo: oy + oh, lineAt: oy + oh },
          { value: oy - h, snapTo: oy - h, lineAt: oy },
          { value: oy + oh - h, snapTo: oy + oh - h, lineAt: oy + oh },
          { value: oy + oh / 2 - h / 2, snapTo: oy + oh / 2 - h / 2, lineAt: oy + oh / 2 }
        )
      })

      // Closest snaps
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
      const element = currentSlide.elements.find((x: BuilderElement) => x.id === draggingZone.elementId)
      if (!element) return

      const pos = getRelativePosInElement(e, element)

      updateElement(currentSlideIndex, draggingZone.elementId, (el) => {
        if (el.type !== "HOTSPOT") return el

        const data = (el.data || {}) as unknown as {
          zones?: Array<HotspotZone>
        }

        const zones = (data.zones || []).map((z: HotspotZone) => {
          if (z.id !== draggingZone.zoneId) return z
          const w = z.xMax - z.xMin
          const h = z.yMax - z.yMin

          const newXMin = Math.max(0, Math.min(100 - w, pos.x - draggingZone.offsetX))
          const newYMin = Math.max(0, Math.min(100 - h, pos.y - draggingZone.offsetY))

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
    setResizing(null)
    setGuidelines(null)
    setActiveTooltip(null)
  }

  const handleNext = () =>
    setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))
  const handlePrev = () => setCurrentSlideIndex((i) => Math.max(0, i - 1))

  /* ==========================================
     INTERACTIVE PLAY MODE - ACTIONS RUNNER
     ========================================== */
  const handleAction = (action: ElementAction) => {
    if (!isInteractiveMode) return

    if (action.type === "NAVIGATE_SLIDE") {
      if (action.payload?.direction === "NEXT") {
        setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))
      } else if (action.payload?.direction === "PREV") {
        setCurrentSlideIndex((i) => Math.max(0, i - 1))
      } else if (action.payload?.targetSlideId) {
        const idx = slides.findIndex((s: Slide) => s.id === action.payload?.targetSlideId)
        if (idx !== -1) setCurrentSlideIndex(idx)
      }
    }

    if (action.type === "PLAY_MEDIA") {
      if (action.payload?.mediaUrl) {
        const audio = new Audio(action.payload.mediaUrl)
        audio.loop = !!action.payload.loop
        audio.play().catch((err) => console.log("Audio play blocked/failed:", err))
      }
    }

    if (action.type === "EVALUATE_ANSWER") {
      const targetId = action.payload?.targetElementId
      if (!targetId) return
      const conceptId = action.payload?.conceptId || "concept-default"
      const targetEl = currentSlide.elements.find((el: BuilderElement) => el.id === targetId)

      if (!targetEl) return

      let isCorrect = false
      let userAnswerDesc = ""

      if (targetEl.type === "QUIZ") {
        const selectedRadio = document.querySelector(
          `input[name="${targetId}"]:checked`
        ) as HTMLInputElement
        const userAnswer = selectedRadio ? selectedRadio.value : null

        if (!userAnswer) {
          alert("Vui lòng chọn một phương án trả lời trước khi kiểm tra!")
          return
        }

        isCorrect = gameEngine.validateGameResult("QUIZ", userAnswer, targetEl.data as unknown as MultipleChoiceData)
        const quizData = targetEl.data as unknown as { options?: { id: string; content: string }[] }
        const opt = (quizData.options || []).find((o) => o.id === userAnswer)
        userAnswerDesc = opt ? opt.content : userAnswer
      } else if (targetEl.type === "SORTING") {
        isCorrect = true
        userAnswerDesc = "Sắp xếp mốc thời gian lịch sử"
      } else if (targetEl.type === "MATCHING") {
        isCorrect = true
        userAnswerDesc = "Các liên kết cặp từ ghép"
      } else {
        isCorrect = true
        userAnswerDesc = "Trả lời tự do"
      }

      // Spaced Repetition calculation
      const days = learningEngine.calculateNextReview(isCorrect, "High")
      const isMastered = learningEngine.checkMastery(isCorrect ? 3 : 0, "High")

      const nextReviewDate = new Date()
      nextReviewDate.setDate(nextReviewDate.getDate() + days)

      alert(
        `${isCorrect ? "🎉 CHÍNH XÁC! Bạn trả lời xuất sắc!" : "❌ SAI RỒI. Hãy thử lại nhé!"}\n\n` +
        `[Phân tích thuật toán Spaced Repetition - Core SDK]:\n` +
        `• Học phần: ${conceptId}\n` +
        `• Phương án chọn: "${userAnswerDesc}"\n` +
        `• Kế hoạch giãn cách ôn tập: +${days} ngày\n` +
        `• Ngày ôn tập dự phòng: ${nextReviewDate.toLocaleDateString("vi-VN")}\n` +
        `• Trạng thái Mastery (Thành thạo): ${isMastered ? "Đạt ✅" : "Chưa đạt ⚠️ (Cần trả lời đúng liên tục 3 lần)"}`
      )
    }
  }

  return (
    <div
      className="flex h-screen w-full bg-slate-50 text-slate-900 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <LeftSidebar
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        onSelectSlide={handleSelectSlide}
        onAddSlide={handleAddSlide}
        onDeleteSlide={handleDeleteSlide}
        onDuplicateSlide={handleDuplicateSlide}
        onMoveSlide={handleMoveSlide}
        onAddElement={handleAddElement}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden">
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
          isInteractiveMode={isInteractiveMode}
          onToggleMode={handleToggleMode}
          onAction={handleAction}
        />

        {/* GUIDELINES & REAL-TIME TOOLTIP OVERLAYS */}
        {!isInteractiveMode && guidelines && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {guidelines.x !== undefined && (
              <div
                className="absolute top-0 bottom-0 border-l border-dashed border-blue-500"
                style={{ left: `${guidelines.x}%` }}
              />
            )}
            {guidelines.y !== undefined && (
              <div
                className="absolute left-0 right-0 border-t border-dashed border-blue-500"
                style={{ top: `${guidelines.y}%` }}
              />
            )}
          </div>
        )}

        {!isInteractiveMode && activeTooltip && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-900/90 px-4 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md flex gap-3 animate-fade-in"
            style={{ pointerEvents: "none" }}
          >
            <span>X: {activeTooltip.x}%</span>
            <span>Y: {activeTooltip.y}%</span>
            <span>W: {activeTooltip.w}%</span>
            <span>H: {activeTooltip.h}%</span>
          </div>
        )}
      </div>

      <RightSidebar
        selectedElement={selectedElement}
        slides={slides}
        currentSlide={currentSlide}
        onUpdatePosition={updateSelectedPosition}
        onUpdateStyle={updateSelectedStyle}
        onUpdateData={updateSelectedData}
        onDeleteSelected={() =>
          selectedElement ? handleDeleteElement(selectedElement.id) : undefined
        }
        onUpdateActions={updateSelectedActions}
        onUpdateAnimations={updateSelectedAnimations}
      />
    </div>
  )
}

export default SlideBuilder
