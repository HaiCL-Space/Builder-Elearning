import type React from "react"
import { useEffect, useState, useRef } from "react"
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
  isEnter: boolean,
  targetOpacity = 1
): { initial?: TargetAndTransition; animate?: TargetAndTransition; exit?: TargetAndTransition } | undefined => {
  if (!anim) return undefined
  const duration = (anim.duration || 500) / 1000
  const delay = (anim.delay || 0) / 1000

  if (isEnter) {
    switch (anim.type) {
      case "fade-in": return { initial: { opacity: 0 }, animate: { opacity: targetOpacity, transition: { duration, delay } } }
      case "slide-up": return { initial: { opacity: 0, y: 50 }, animate: { opacity: targetOpacity, y: 0, transition: { duration, delay } } }
      case "zoom-in": return { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: targetOpacity, scale: 1, transition: { duration, delay } } }
      case "bounce": return {
        initial: { y: -50, opacity: 0 },
        animate: {
          y: [-50, 0, -15, 0],
          opacity: [0, targetOpacity, targetOpacity, targetOpacity],
          transition: { duration, delay, times: [0, 0.5, 0.75, 1], ease: "easeInOut" }
        }
      }
    }
  } else {
    switch (anim.type) {
      case "fade-in": return { exit: { opacity: 0, transition: { duration, delay } } }
      case "slide-up": return { exit: { opacity: 0, y: 50, transition: { duration, delay } } }
      case "zoom-in": return { exit: { opacity: 0, scale: 0.5, transition: { duration, delay } } }
      case "bounce": return {
        exit: {
          y: [0, -15, 0, 50],
          opacity: [targetOpacity, targetOpacity, targetOpacity, 0],
          transition: { duration, delay, times: [0, 0.25, 0.5, 1], ease: "easeInOut" }
        }
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
  onHotspotZoneResizeMouseDown,
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
  onHotspotZoneResizeMouseDown: (
    e: React.MouseEvent,
    element: BuilderElement,
    zone: HotspotZone,
    handle: string
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
  const targetOpacity = element.style?.opacity !== undefined ? parseFloat(String(element.style.opacity)) : 1

  const [isEditing, setIsEditing] = useState(false)
  const [tempText, setTempText] = useState((element.data as { content?: string }).content || "")
  const editorRef = useRef<HTMLDivElement>(null)

  const updateElement = useBuilderStore((s) => s.updateElement)
  const currentSlideIndex = useBuilderStore((s) => s.currentSlideIndex)

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus()
      // Select all text in contentEditable
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
  }, [isEditing])

  const saveText = () => {
    updateElement(currentSlideIndex, element.id, (el) => ({
      ...el,
      data: { ...(el.data as object), content: tempText },
    } as unknown as BuilderElement))
    setIsEditing(false)
  }

  useEffect(() => {
    if (!isInteractiveMode && testAnimationElementId === element.id && testAnimationKey > 0) {
      const runTest = async () => {
        const enterVar = getAnimationVariants(element.enterAnimation, true, targetOpacity)
        const exitVar = getAnimationVariants(element.exitAnimation, false, targetOpacity)

        if (enterVar?.initial) {
          await controls.start(enterVar.initial, { duration: 0 })
        }
        if (enterVar?.animate) {
          await controls.start(enterVar.animate)
        }
        if (exitVar?.exit) {
          await controls.start(exitVar.exit)
          // Reset
          await controls.start({ opacity: targetOpacity, scale: 1, y: 0, x: 0 }, { duration: 0.2 })
        }
      }
      runTest()
    }
  }, [testAnimationElementId, testAnimationKey, element.id, element.enterAnimation, element.exitAnimation, controls, isInteractiveMode, targetOpacity])
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

  const enterVar = getAnimationVariants(element.enterAnimation, true, targetOpacity)
  const exitVar = getAnimationVariants(element.exitAnimation, false, targetOpacity)

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
      onMouseDown={!isInteractiveMode && !isEditing ? (e) => onElementMouseDown(e, element) : undefined}
      onDoubleClick={
        !isInteractiveMode && element.type === "TEXT"
          ? (e) => {
              e.stopPropagation()
              setIsEditing(true)
              setTempText((element.data as { content?: string }).content || "")
            }
          : undefined
      }
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
              isInteractive={isInteractiveMode}
            />
          )}
          {element.type === "SORTING" && (
            <SortingElement
              element={element as Extract<BuilderElement, { type: "SORTING" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
              isInteractive={isInteractiveMode}
            />
          )}
          {element.type === "MATCHING" && (
            <MatchingElement
              element={element as Extract<BuilderElement, { type: "MATCHING" }>}
              baseStyle={innerWrapperStyle}
              handleClick={handleElementClick}
              isInteractive={isInteractiveMode}
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
      ) : isEditing && element.type === "TEXT" ? (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setTempText(e.currentTarget.textContent || "")}
          onBlur={saveText}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsEditing(false)
              setTempText((element.data as { content?: string }).content || "")
            }
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="flex h-full w-full flex-col justify-center px-4 py-2 outline-none select-text cursor-text focus:ring-1 focus:ring-blue-400"
          style={{
            fontSize: element.style?.fontSize ?? 16,
            color: element.style?.color || "#333",
            textAlign: (element.style?.textAlign as React.CSSProperties["textAlign"]) || "center",
            backgroundColor: element.style?.backgroundColor || "transparent",
            fontFamily: element.style?.fontFamily || "inherit",
            fontWeight: element.style?.fontWeight || "normal",
            borderRadius: element.style?.borderRadius ? `${element.style?.borderRadius}px` : "0px",
            wordBreak: "break-word",
          }}
        >
          {(element.data as { content?: string }).content || ""}
        </div>
      ) : (
        <div className="pointer-events-none flex h-full w-full items-center justify-center overflow-hidden">
          <ElementPreview element={element} hideZones={isSelected} />
        </div>
      )}

      {/* interactive zones for HOTSPOT (drag/drop) in Edit mode only */}
      {!isInteractiveMode && isSelected && element.type === "HOTSPOT" && (
        <HotspotZonesLayer
          element={element}
          zones={zones}
          onZoneMouseDown={onHotspotZoneMouseDown}
          onZoneResizeMouseDown={onHotspotZoneResizeMouseDown}
        />
      )}


      {/* badge on Edit mode only */}
      {!isInteractiveMode && !isEditing && <ElementTypeBadge type={String(element.type)} />}

      {/* Lightning indicator on Edit mode if has actions */}
      {!isInteractiveMode && !isEditing && element.actions && element.actions.length > 0 && (
        <div
          title="Có liên kết sự kiện tương tác (Action)"
          className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs animate-bounce"
        >
          ⚡
        </div>
      )}

      {!isInteractiveMode && isSelected && !isEditing && (
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
