import { type SlideElement, type ElementAction } from "broker-core-sdk"
import React, { useState } from "react"
import { MOCK_SLIDES } from "@/shared/api/mock-slides"
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

const SlidePreviewApp = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const currentSlide = MOCK_SLIDES[currentSlideIndex]

  // STATE: Quản lý danh sách các Element đang bị ẩn (dành cho action TOGGLE_VISIBILITY)
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(() => {
    const initiallyHidden = new Set<string>()
    currentSlide.elements.forEach((el) => {
      if (el.style?.opacity === 0) initiallyHidden.add(el.id)
    })
    return initiallyHidden
  })
  const [prevSlideIndex, setPrevSlideIndex] = useState(currentSlideIndex)

  // Reset state when slide changes during render (recommended standard pattern)
  if (currentSlideIndex !== prevSlideIndex) {
    setPrevSlideIndex(currentSlideIndex)
    const initiallyHidden = new Set<string>()
    currentSlide.elements.forEach((el) => {
      if (el.style?.opacity === 0) initiallyHidden.add(el.id)
    })
    setHiddenElements(initiallyHidden)
  }

  const handleNext = () => {
    if (currentSlideIndex < MOCK_SLIDES.length - 1)
      setCurrentSlideIndex((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (currentSlideIndex > 0) setCurrentSlideIndex((prev) => prev - 1)
  }

  // BỘ PHÂN PHỐI SỰ KIỆN (ACTION DISPATCHER)
  const executeAction = (action: ElementAction) => {
    switch (action.type) {
      case "NAVIGATE_SLIDE":
        if (action.payload.direction === "NEXT") handleNext()
        if (action.payload.direction === "PREV") handlePrev()
        break

      case "TOGGLE_VISIBILITY": {
        const targetId = action.payload.targetElementId
        setHiddenElements((prev) => {
          const next = new Set(prev)
          if (action.payload.action === "SHOW") next.delete(targetId)
          else if (action.payload.action === "HIDE") next.add(targetId)
          else {
            // TOGGLE
            if (next.has(targetId)) next.delete(targetId)
            else next.add(targetId)
          }
          return next
        })
        break
      }

      case "EVALUATE_ANSWER":
        alert(
          `[Learning Engine] Đang chấm điểm cho Element: ${action.payload.targetElementId}\nCập nhật tiến trình cho Concept: ${action.payload.conceptId}`
        )
        break

      case "PLAY_MEDIA":
        console.log("Phát media:", action.payload.mediaUrl)
        break
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1024px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>
          Preview: Slide {currentSlide.order} / {MOCK_SLIDES.length}
        </h2>
        <div>
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            style={{ padding: "8px 16px", marginRight: "10px" }}
          >
            Quay lại
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlideIndex === MOCK_SLIDES.length - 1}
            style={{ padding: "8px 16px" }}
          >
            Tiếp theo
          </button>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          backgroundColor: "#f8f9fa",
          border: "1px solid #ddd",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {currentSlide.elements.map((element) => {
          // Ghi đè opacity nếu element nằm trong danh sách bị ẩn
          const isHidden = hiddenElements.has(element.id)
          const overrideStyle = isHidden
            ? { opacity: 0, pointerEvents: "none" as const }
            : { opacity: 1 }

          return (
            <ElementRenderer
              key={element.id}
              element={element}
              onAction={executeAction}
              overrideStyle={overrideStyle}
            />
          )
        })}
      </div>
    </div>
  )
}

// ==========================================
// RENDERER ĐIỀU PHỐI (CÓ LẮNG NGHE SỰ KIỆN)
// ==========================================
const ElementRenderer = ({
  element,
  onAction,
  overrideStyle,
}: {
  element: SlideElement
  onAction: (action: ElementAction) => void
  overrideStyle: React.CSSProperties
}) => {
  // 1. Lọc ra các action có trigger là ON_CLICK
  const clickActions =
    element.actions?.filter((a) => a.trigger === "ON_CLICK") || []

  // 2. Hàm xử lý khi user click vào phần tử
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Ngăn chặn sự kiện sủi bọt (bubbling)
    clickActions.forEach((action) => onAction(action))
  }

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${element.position.x}%`,
    top: `${element.position.y}%`,
    width: `${element.position.w}%`,
    height: `${element.position.h}%`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    cursor: clickActions.length > 0 ? "pointer" : "default", // Đổi con trỏ chuột nếu có action
    transition: "opacity 0.3s ease", // Hiệu ứng mờ dần khi ẩn/hiện
    ...element.style,
    ...overrideStyle, // Chèn overrideStyle để kiểm soát ẩn/hiện
  }

  switch (element.type) {
    case "TEXT":
      return (
        <TextElement
          element={element}
          baseStyle={baseStyle}
          handleClick={handleClick}
        />
      )

    case "VIDEO":
      return (
        <VideoElement
          element={element}
          baseStyle={baseStyle}
          handleClick={handleClick}
        />
      )

    case "QUIZ":
      return (
        <QuizElement
          element={element}
          baseStyle={baseStyle}
          handleClick={handleClick}
        />
      )

    case "HOTSPOT":
      return (
        <HotspotElement
          element={element}
          baseStyle={baseStyle}
          handleClick={handleClick}
        />
      )

    case "SORTING":
      return (
        <SortingElement
          element={element}
          baseStyle={baseStyle}
          handleClick={handleClick}
        />
      )

    case "MATCHING":
      return (
        <MatchingElement
          element={element}
          baseStyle={baseStyle}
          handleClick={handleClick}
        />
      )

    case "MEMORY_CARD":
      return (
        <MemoryCardElement
          element={element as Extract<SlideElement, { type: "MEMORY_CARD" }>}
          baseStyle={baseStyle}
          handleClick={handleClick}
        />
      )

    case "FILL_BLANK":
      return (
        <FillBlankElement
          element={element as Extract<SlideElement, { type: "FILL_BLANK" }>}
          baseStyle={baseStyle}
          handleClick={handleClick}
        />
      )

    case "SWIPE":
      return (
        <SwipeElement
          element={element as Extract<SlideElement, { type: "SWIPE" }>}
          baseStyle={baseStyle}
          handleClick={handleClick}
        />
      )

    case "TIMED_SPRINT":
      return (
        <TimedSprintElement
          element={element as Extract<SlideElement, { type: "TIMED_SPRINT" }>}
          baseStyle={baseStyle}
          handleClick={handleClick}
        />
      )

    case "WORD_SCRAMBLE":
      return (
        <WordScrambleElement
          element={element as Extract<SlideElement, { type: "WORD_SCRAMBLE" }>}
          baseStyle={baseStyle}
          handleClick={handleClick}
        />
      )

    default:
      return <div style={baseStyle}>[Unsupported Element: {(element as unknown as { type: string }).type}]</div>
  }
}

export default SlidePreviewApp
