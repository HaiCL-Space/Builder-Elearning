import { type SlideElement, type ElementAction, learningEngine, gameEngine, type MultipleChoiceData } from "broker-core-sdk"
import React, { useState } from "react"
import { MOCK_SLIDES } from "@/shared/api/mock-slides"
import { THEME_BACKGROUNDS } from "@/shared/lib/builder-utils"
import { CustomAlertDialog } from "@/shared/ui/custom-alert-dialog"
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
  const [activeAlert, setActiveAlert] = useState<{
    isOpen: boolean
    type: "success" | "error" | "warning" | "info"
    title: string
    message: string
    spacedRepetition?: {
      conceptId: string
      userAnswerDesc: string
      days: number
      nextReviewDateStr: string
      isMastered: boolean
    }
  } | null>(null)

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

      case "EVALUATE_ANSWER": {
        const targetId = action.payload?.targetElementId
        if (!targetId) return
        const conceptId = action.payload?.conceptId || "concept-default"
        const targetEl = currentSlide.elements.find((el) => el.id === targetId)

        if (!targetEl) return

        let isCorrect = false
        let userAnswerDesc = ""

        if (targetEl.type === "QUIZ") {
          const selectedItem = document.querySelector(
            `[data-quiz-id="${targetId}"] [data-state="checked"]`
          ) as HTMLButtonElement | null
          const userAnswer = selectedItem?.value || null

          if (!userAnswer) {
            setActiveAlert({
              isOpen: true,
              type: "warning",
              title: "Chưa chọn câu trả lời",
              message: "Vui lòng chọn một phương án trả lời trước khi kiểm tra!"
            })
            return
          }

          isCorrect = gameEngine.validateGameResult(
            "QUIZ",
            userAnswer,
            targetEl.data as unknown as MultipleChoiceData
          )
          const quizData = targetEl.data as unknown as {
            options?: { id: string; content: string }[]
          }
          const opt = (quizData.options || []).find((o) => o.id === userAnswer)
          userAnswerDesc = opt ? opt.content : userAnswer
        } else if (targetEl.type === "HOTSPOT") {
          const hotspotData = targetEl.data as unknown as {
            correctZoneId?: string
            zones?: { id: string }[]
          }
          const userAnswer = (action.payload as { userAnswer?: string })?.userAnswer

          isCorrect = userAnswer === hotspotData.correctZoneId
          const zone = (hotspotData.zones || []).find((z) => z.id === userAnswer)
          userAnswerDesc = zone?.id || userAnswer || "Vùng không xác định"
        } else if (targetEl.type === "SORTING") {
          isCorrect = true
          userAnswerDesc = "Sắp xếp mốc thời gian lịch sử"
        } else if (targetEl.type === "MATCHING") {
          const matchingEl = document.querySelector(`[data-matching-id="${targetId}"]`)
          const userMatchesRaw = matchingEl?.getAttribute("data-user-matches")
          const userMatches: [string, string][] = userMatchesRaw ? JSON.parse(userMatchesRaw) : []
          
          const matchingData = targetEl.data as unknown as {
            leftColumn: { id: string; content: string }[]
            rightColumn: { id: string; content: string }[]
            correctPairs: [string, string][]
          }

          if (userMatches.length < matchingData.leftColumn.length) {
            setActiveAlert({
              isOpen: true,
              type: "warning",
              title: "Chưa hoàn thành ghép nối",
              message: "Vui lòng nối tất cả các cặp từ trước khi kiểm tra!"
            })
            return
          }

          // Check if all user matches are in correctPairs
          isCorrect = userMatches.every(([uL, uR]) => 
            matchingData.correctPairs.some(([cL, cR]) => cL === uL && cR === uR)
          )
          
          userAnswerDesc = `Đã nối ${userMatches.length} cặp từ`
        } else {
          isCorrect = true
          userAnswerDesc = "Trả lời tự do"
        }

        // Spaced Repetition calculation
        const days = learningEngine.calculateNextReview(isCorrect, "High")
        const isMastered = learningEngine.checkMastery(isCorrect ? 3 : 0, "High")

        const nextReviewDate = new Date()
        nextReviewDate.setDate(nextReviewDate.getDate() + days)

        setActiveAlert({
          isOpen: true,
          type: isCorrect ? "success" : "error",
          title: isCorrect ? "🎉 CHÍNH XÁC! Bạn trả lời xuất sắc!" : "❌ SAI RỒI. Hãy thử lại nhé!",
          message: "",
          spacedRepetition: {
            conceptId,
            userAnswerDesc,
            days,
            nextReviewDateStr: nextReviewDate.toLocaleDateString("vi-VN"),
            isMastered
          }
        })
        break
      }

      case "PLAY_MEDIA":
        console.log("Phát media:", action.payload.mediaUrl)
        break
    }
  }

  const themeBg = THEME_BACKGROUNDS[currentSlide.config?.theme || "light"] || THEME_BACKGROUNDS.light

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
          border: "1px solid #ddd",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
          ...themeBg,
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

      {activeAlert && (
        <CustomAlertDialog
          isOpen={activeAlert.isOpen}
          type={activeAlert.type}
          title={activeAlert.title}
          message={activeAlert.message}
          spacedRepetition={activeAlert.spacedRepetition}
          onClose={() => setActiveAlert(prev => prev ? { ...prev, isOpen: false } : null)}
        />
      )}
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
  const handleClick = (e: React.MouseEvent, userAnswer?: string) => {
    e.stopPropagation() // Ngăn chặn sự kiện sủi bọt (bubbling)
    clickActions.forEach((action) => {
      const actionWithAnswer = userAnswer
        ? { ...action, payload: { ...action.payload, userAnswer } }
        : action
      onAction(actionWithAnswer as ElementAction)
    })
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
          isInteractive={true}
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
