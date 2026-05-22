import type React from "react"
import { useEffect } from "react"
import { motion, useAnimation, type TargetAndTransition } from "framer-motion"
import { useBuilderStore } from "@/pages/builder/model/use-builder-store"
import type { BuilderElement } from "@/pages/builder/model/types"
import { ElementPreview } from "@/entities/element/ui/element-preview"
import { DeleteButton } from "./DeleteButton"
import { ElementTypeBadge } from "./ElementTypeBadge"
import { HotspotZonesLayer } from "./HotspotZonesLayer"
import { ResizeHandles } from "./ResizeHandles"
import type { HotspotZone } from "@/pages/builder/model/types"
import {
  TextElement,
  VideoElement,
  QuizElement,
  HotspotElement,
  SortingElement,
  MatchingElement,
  MemoryCardElement,
  FillBlankElement,
  SwipeElement,
  TimedSprintElement,
  WordScrambleElement,
} from "@/entities/element"
import type { ElementAction } from "broker-core-sdk"

type AnimationConfig = NonNullable<BuilderElement["enterAnimation"]> | NonNullable<BuilderElement["exitAnimation"]>

const getAnimationVariants = (
  anim: AnimationConfig | undefined,
  isEnter: boolean
): { initial?: TargetAndTransition; animate?: TargetAndTransition; exit?: TargetAndTransition } | undefined => {
  if (!anim) return undefined
  const duration = (anim.duration || 500) / 1000
  const delay = (anim.delay || 0) / 1000

  if (isEnter) {
    switch (anim.type) {
      case "fade-in": return { initial: { opacity: 0 }, animate: { opacity: 1, transition: { duration, delay } } }
      case "slide-up": return { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0, transition: { duration, delay } } }
      case "zoom-in": return { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1, transition: { duration, delay } } }
      case "bounce": return {
        initial: { y: "-25%" },
        animate: { y: ["-25%", "0%", "-10%", "0%"], transition: { duration, delay, times: [0, 0.5, 0.75, 1], ease: "easeInOut" } }
      }
    }
  } else {
    switch (anim.type) {
      case "fade-in": return { exit: { opacity: 0, transition: { duration, delay } } }
      case "slide-up": return { exit: { opacity: 0, y: 50, transition: { duration, delay } } }
      case "zoom-in": return { exit: { opacity: 0, scale: 0.5, transition: { duration, delay } } }
      case "bounce": return {
        exit: { y: ["0%", "-10%", "0%", "25%"], opacity: [1, 1, 1, 0], transition: { duration, delay, times: [0, 0.25, 0.5, 1], ease: "easeInOut" } }
      }
    }
  }
  return undefined
}

export function CanvasElement({
  element,
  isSelected,
  onElementMouseDown,
  onHotspotZoneMouseDown,
  onDeleteElement,
  onResizeMouseDown,
  isInteractiveMode,
  onAction,
}: {
  element: BuilderElement
  isSelected: boolean
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
  isInteractiveMode: boolean
  onAction?: (action: ElementAction) => void
}) {
  const controls = useAnimation()
  const testAnimationElementId = useBuilderStore((s) => s.testAnimationElementId)
  const testAnimationKey = useBuilderStore((s) => s.testAnimationKey)

  useEffect(() => {
    if (!isInteractiveMode && testAnimationElementId === element.id && testAnimationKey > 0) {
      const runTest = async () => {
        const enterVar = getAnimationVariants(element.enterAnimation, true)
        const exitVar = getAnimationVariants(element.exitAnimation, false)

        if (enterVar?.initial) {
          await controls.start(enterVar.initial, { duration: 0 })
        }
        if (enterVar?.animate) {
          await controls.start(enterVar.animate)
        }
        if (exitVar?.exit) {
          await controls.start(exitVar.exit)
          // Reset
          await controls.start({ opacity: 1, scale: 1, y: 0, x: 0 }, { duration: 0.2 })
        }
      }
      runTest()
    }
  }, [testAnimationElementId, testAnimationKey, element.id, element.enterAnimation, element.exitAnimation, controls, isInteractiveMode])
  const pos = element.position
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    width: `${pos.w}%`,
    height: `${pos.h}%`,
    boxSizing: "border-box",
    ...element.style,
  }

  const zones =
    ((element.data as unknown as { zones?: HotspotZone[] })?.zones as
      | HotspotZone[]
      | undefined) || []

  const handleElementClick = (e: React.MouseEvent, userAnswer?: string) => {
    e.stopPropagation()
    if (element.actions) {
      const clickActions = element.actions.filter((a) => a.trigger === "ON_CLICK")
      clickActions.forEach((action) => {
        // Nếu là Hotspot, truyền thêm userAnswer vào payload để SlideBuilder xử lý
        const actionWithAnswer = userAnswer
          ? { ...action, payload: { ...action.payload, userAnswer } }
          : action
        onAction?.(actionWithAnswer as ElementAction)
      })
    }
  }

  const innerWrapperStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  }

  const enterVar = getAnimationVariants(element.enterAnimation, true)
  const exitVar = getAnimationVariants(element.exitAnimation, false)

  return (
    <motion.div
      data-element-id={element.id}
      style={baseStyle}
      initial={isInteractiveMode && enterVar ? enterVar.initial : false}
      animate={isInteractiveMode && enterVar ? enterVar.animate : controls}
      exit={isInteractiveMode && exitVar ? exitVar.exit : undefined}
      className={`group ${
        isInteractiveMode
          ? ""
          : isSelected
          ? "ring-2 ring-blue-500 shadow-lg"
          : "cursor-move hover:ring-1 hover:ring-blue-300"
      } transition-shadow duration-150`}
      onMouseDown={!isInteractiveMode ? (e) => onElementMouseDown(e, element) : undefined}
    >
      {/* Conditionally render preview OR interactive element */}
      {isInteractiveMode ? (
        <div className="h-full w-full overflow-hidden">
          {element.type === "TEXT" && (
            <TextElement
              element={element as Extract<BuilderElement, { type: "TEXT" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
            />
          )}
          {element.type === "VIDEO" && (
            <VideoElement
              element={element as Extract<BuilderElement, { type: "VIDEO" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
            />
          )}
          {element.type === "QUIZ" && (
            <QuizElement
              element={element as Extract<BuilderElement, { type: "QUIZ" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
            />
          )}
          {element.type === "HOTSPOT" && (
            <HotspotElement
              element={element as Extract<BuilderElement, { type: "HOTSPOT" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
            />
          )}
          {element.type === "SORTING" && (
            <SortingElement
              element={element as Extract<BuilderElement, { type: "SORTING" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
            />
          )}
          {element.type === "MATCHING" && (
            <MatchingElement
              element={element as Extract<BuilderElement, { type: "MATCHING" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
            />
          )}
          {element.type === "MEMORY_CARD" && (
            <MemoryCardElement
              element={element as Extract<BuilderElement, { type: "MEMORY_CARD" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
            />
          )}
          {element.type === "FILL_BLANK" && (
            <FillBlankElement
              element={element as Extract<BuilderElement, { type: "FILL_BLANK" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
            />
          )}
          {element.type === "SWIPE" && (
            <SwipeElement
              element={element as Extract<BuilderElement, { type: "SWIPE" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
            />
          )}
          {element.type === "TIMED_SPRINT" && (
            <TimedSprintElement
              element={element as Extract<BuilderElement, { type: "TIMED_SPRINT" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
            />
          )}
          {element.type === "WORD_SCRAMBLE" && (
            <WordScrambleElement
              element={element as Extract<BuilderElement, { type: "WORD_SCRAMBLE" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
            />
          )}
        </div>
      ) : (
        <div className="pointer-events-none flex h-full w-full items-center justify-center overflow-hidden">
          <ElementPreview element={element} />
        </div>
      )}

      {/* interactive zones for HOTSPOT (drag/drop) in Edit mode only */}
      {!isInteractiveMode && isSelected && element.type === "HOTSPOT" && (
        <HotspotZonesLayer
          element={element}
          zones={zones}
          onZoneMouseDown={onHotspotZoneMouseDown}
        />
      )}

      {/* badge on Edit mode only */}
      {!isInteractiveMode && <ElementTypeBadge type={String(element.type)} />}

      {/* Lightning indicator on Edit mode if has actions */}
      {!isInteractiveMode && element.actions && element.actions.length > 0 && (
        <div
          title="Có liên kết sự kiện tương tác (Action)"
          className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs animate-bounce"
        >
          ⚡
        </div>
      )}

      {!isInteractiveMode && isSelected && (
        <>
          <DeleteButton onDelete={() => onDeleteElement(element.id)} />
          <ResizeHandles
            onMouseDown={(e, handle) => onResizeMouseDown(e, element, handle)}
          />
        </>
      )}
    </motion.div>
  )
}
export default CanvasElement
