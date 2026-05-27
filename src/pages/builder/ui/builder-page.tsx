import { useRef, useEffect } from "react"
import type { BuilderElement } from "@/pages/builder/model/types"
import { LeftSidebar } from "@/pages/builder/ui/left-sidebar"
import { Canvas } from "@/pages/builder/ui/canvas"
import { RightSidebar } from "@/pages/builder/ui/right-sidebar"
import { useBuilderStore } from "@/pages/builder/model/use-builder-store"
import { useCanvasEvents } from "@/pages/builder/lib/use-canvas-events"
import { useActionRunner } from "@/pages/builder/lib/use-action-runner"
import { CustomAlertDialog } from "@/shared/ui/custom-alert-dialog"
import { useSlidesQuery, useSaveSlidesMutation } from "@/entities/slide"

export function SlideBuilder({ onLogout }: { onLogout?: () => void } = {}) {
  // 1. Fetch slides using TanStack Query v5
  const {
    data: fetchedSlides,
    isPending: isQueryPending,
    isError: isQueryError,
    error: queryError,
  } = useSlidesQuery("course-demo")
  const saveMutation = useSaveSlidesMutation("course-demo")

  const slides = useBuilderStore((state) => state.slides)
  const currentSlideIndex = useBuilderStore((state) => state.currentSlideIndex)
  const currentSlide = slides[currentSlideIndex] || null

  const selectedElementId = useBuilderStore((state) => state.selectedElementId)
  const selectedElement =
    currentSlide?.elements.find(
      (e: BuilderElement) => e.id === selectedElementId
    ) || null

  const isInteractiveMode = useBuilderStore((state) => state.isInteractiveMode)
  const guidelines = useBuilderStore((state) => state.guidelines)
  const activeTooltip = useBuilderStore((state) => state.activeTooltip)
  const activeAlert = useBuilderStore((state) => state.activeAlert)
  const closeAlert = useBuilderStore((state) => state.closeAlert)
  const setAlert = useBuilderStore((state) => state.setAlert)

  // Actions from Zustand store
  const initializeSlides = useBuilderStore((state) => state.initializeSlides)
  const setCurrentSlideIndex = useBuilderStore(
    (state) => state.setCurrentSlideIndex
  )
  const handleDeleteElement = useBuilderStore(
    (state) => state.handleDeleteElement
  )
  const handleSelectSlide = useBuilderStore((state) => state.handleSelectSlide)
  const handleAddElement = useBuilderStore((state) => state.handleAddElement)
  const handleAddSlide = useBuilderStore((state) => state.handleAddSlide)
  const handleDeleteSlide = useBuilderStore((state) => state.handleDeleteSlide)
  const handleDuplicateSlide = useBuilderStore(
    (state) => state.handleDuplicateSlide
  )
  const handleMoveSlide = useBuilderStore((state) => state.handleMoveSlide)
  const handleToggleMode = useBuilderStore((state) => state.handleToggleMode)

  const updateSelectedPosition = useBuilderStore(
    (state) => state.updateSelectedPosition
  )
  const updateSelectedStyle = useBuilderStore(
    (state) => state.updateSelectedStyle
  )
  const updateSelectedData = useBuilderStore(
    (state) => state.updateSelectedData
  )
  const updateSelectedActions = useBuilderStore(
    (state) => state.updateSelectedActions
  )
  const updateSelectedAnimations = useBuilderStore(
    (state) => state.updateSelectedAnimations
  )

  // 2. Synchronize React Query's server state with Zustand's draft state on load
  useEffect(() => {
    if (fetchedSlides) {
      initializeSlides(fetchedSlides)
    }
  }, [fetchedSlides, initializeSlides])

  // 3. Save draft state back to Server via React Query Mutation
  const handleSave = () => {
    saveMutation.mutate(slides, {
      onSuccess: (isOnlineSuccess) => {
        setAlert({
          type: "success",
          title: isOnlineSuccess
            ? "Lưu thiết kế thành công!"
            : "Lưu thiết kế ngoại tuyến!",
          message: isOnlineSuccess
            ? "Mọi thay đổi đã được đồng bộ hóa và lưu trữ an toàn trên máy chủ."
            : "Thiết kế đã được sao lưu an toàn tại bộ nhớ trình duyệt của bạn (chế độ ngoại tuyến).",
        })
      },
      onError: (error) => {
        setAlert({
          type: "error",
          title: "Không thể lưu thiết kế",
          message:
            error.message || "Đã xảy ra lỗi kết nối với máy chủ khi lưu.",
        })
      },
    })
  }

  const canvasRef = useRef<HTMLDivElement | null>(null)

  // Custom Hooks for Logic
  const {
    handleCanvasMouseDown,
    handleElementMouseDown,
    handleHotspotZoneMouseDown,
    handleHotspotZoneResizeMouseDown,
    handleResizeMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useCanvasEvents(canvasRef)

  const { handleAction } = useActionRunner()

  // 4. Loading & Error Boundaries (Premium Experience)
  if (isQueryPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-blue-500" />
          <span className="text-xs font-medium tracking-wide">
            Đang tải thiết kế slides từ hệ thống...
          </span>
        </div>
      </div>
    )
  }

  if (isQueryError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-white/10 bg-slate-900 p-8 px-6 text-center shadow-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-xl font-bold text-red-500">
            !
          </div>
          <h2 className="text-base font-bold text-white">
            Không thể kết nối máy chủ
          </h2>
          <p className="text-xs leading-relaxed text-slate-400">
            {queryError?.message || "Đã xảy ra lỗi không xác định."}
          </p>
        </div>
      </div>
    )
  }

  // Safety fallback if slides are still empty
  if (!currentSlide) return null

  const handleNext = () =>
    setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))
  const handlePrev = () => setCurrentSlideIndex((i) => Math.max(0, i - 1))

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
        onLogout={onLogout}
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
          onHotspotZoneResizeMouseDown={handleHotspotZoneResizeMouseDown}
          onDeleteElement={handleDeleteElement}
          onResizeMouseDown={handleResizeMouseDown}
          isInteractiveMode={isInteractiveMode}
          onToggleMode={handleToggleMode}
          onAction={handleAction}
          theme={currentSlide.config?.theme}
          onSave={handleSave}
          isSaving={saveMutation.isPending}
        />

        {/* GUIDELINES & REAL-TIME TOOLTIP OVERLAYS */}
        {!isInteractiveMode && guidelines && (
          <div className="pointer-events-none absolute inset-0 z-50">
            {guidelines.x !== undefined && (
              <div
                className="absolute top-0 bottom-0 border-l border-dashed border-blue-500"
                style={{ left: `${guidelines.x}%` }}
              />
            )}
            {guidelines.y !== undefined && (
              <div
                className="absolute right-0 left-0 border-t border-dashed border-blue-500"
                style={{ top: `${guidelines.y}%` }}
              />
            )}
          </div>
        )}

        {!isInteractiveMode && activeTooltip && (
          <div
            className="animate-fade-in absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-3 rounded-full bg-slate-900/90 px-4 py-1.5 text-[11px] font-bold text-white shadow-lg backdrop-blur-md"
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

      {activeAlert && (
        <CustomAlertDialog
          isOpen={activeAlert.isOpen}
          type={activeAlert.type}
          title={activeAlert.title}
          message={activeAlert.message}
          spacedRepetition={activeAlert.spacedRepetition}
          onClose={closeAlert}
        />
      )}
    </div>
  )
}

export default SlideBuilder
