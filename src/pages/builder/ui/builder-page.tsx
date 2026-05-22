import { useRef } from "react"
import type { BuilderElement } from "@/pages/builder/model/types"
import { LeftSidebar } from "@/pages/builder/ui/left-sidebar"
import { Canvas } from "@/pages/builder/ui/canvas"
import { RightSidebar } from "@/pages/builder/ui/right-sidebar"
import { useBuilderStore } from "@/pages/builder/model/use-builder-store"
import { useCanvasEvents } from "@/pages/builder/lib/use-canvas-events"
import { useActionRunner } from "@/pages/builder/lib/use-action-runner"
import { CustomAlertDialog } from "@/shared/ui/custom-alert-dialog"

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
  const activeAlert = useBuilderStore((state) => state.activeAlert)
  const closeAlert = useBuilderStore((state) => state.closeAlert)

  // Actions from Zustand store
  const setCurrentSlideIndex = useBuilderStore((state) => state.setCurrentSlideIndex)
  const handleDeleteElement = useBuilderStore((state) => state.handleDeleteElement)
  const handleSelectSlide = useBuilderStore((state) => state.handleSelectSlide)
  const handleAddElement = useBuilderStore((state) => state.handleAddElement)
  const handleAddSlide = useBuilderStore((state) => state.handleAddSlide)
  const handleDeleteSlide = useBuilderStore((state) => state.handleDeleteSlide)
  const handleDuplicateSlide = useBuilderStore((state) => state.handleDuplicateSlide)
  const handleMoveSlide = useBuilderStore((state) => state.handleMoveSlide)
  const handleToggleMode = useBuilderStore((state) => state.handleToggleMode)

  const updateSelectedPosition = useBuilderStore((state) => state.updateSelectedPosition)
  const updateSelectedStyle = useBuilderStore((state) => state.updateSelectedStyle)
  const updateSelectedData = useBuilderStore((state) => state.updateSelectedData)
  const updateSelectedActions = useBuilderStore((state) => state.updateSelectedActions)
  const updateSelectedAnimations = useBuilderStore((state) => state.updateSelectedAnimations)

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
