import { useBuilderStore } from "@/pages/builder/model/use-builder-store"
import { learningEngine, gameEngine } from "broker-core-sdk"
import type { ElementAction, MultipleChoiceData, Slide } from "broker-core-sdk"
import type { BuilderElement } from "@/pages/builder/model/types"

export function useActionRunner() {
  const slides = useBuilderStore((state) => state.slides)
  const currentSlideIndex = useBuilderStore((state) => state.currentSlideIndex)
  const isInteractiveMode = useBuilderStore((state) => state.isInteractiveMode)
  
  const setCurrentSlideIndex = useBuilderStore((state) => state.setCurrentSlideIndex)
  const updateElement = useBuilderStore((state) => state.updateElement)
  const setAlert = useBuilderStore((state) => state.setAlert)

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

    if (action.type === "TOGGLE_VISIBILITY") {
      const targetId = action.payload?.targetElementId
      const visibilityAction = action.payload?.action || "TOGGLE"
      if (!targetId) return

      updateElement(currentSlideIndex, targetId, (el) => {
        let newOpacity = 1
        if (visibilityAction === "SHOW") newOpacity = 1
        else if (visibilityAction === "HIDE") newOpacity = 0
        else {
          const currentOpacity = parseFloat(String(el.style?.opacity ?? "1"))
          newOpacity = currentOpacity === 0 ? 1 : 0
        }
        return {
          ...el,
          style: { ...el.style, opacity: newOpacity },
        }
      })
    }

    if (action.type === "PLAY_MEDIA") {
      if (action.payload?.mediaUrl) {
        const audio = new Audio(action.payload.mediaUrl)
        audio.loop = !!action.payload.loop
        audio.play().catch((err) => console.log("Audio play blocked/failed:", err))
      }
    }

    if (action.type === "EVALUATE_ANSWER") {
      const currentSlide = slides[currentSlideIndex]
      const targetId = action.payload?.targetElementId
      if (!targetId) return
      const conceptId = action.payload?.conceptId || "concept-default"
      const targetEl = currentSlide.elements.find((el: BuilderElement) => el.id === targetId)

      if (!targetEl) return

      let isCorrect = false
      let userAnswerDesc = ""

      if (targetEl.type === "QUIZ") {
        const selectedItem = document.querySelector(
          `[data-quiz-id="${targetId}"] [data-state="checked"]`
        ) as HTMLButtonElement | null
        const userAnswer = selectedItem?.value || null

        if (!userAnswer) {
          setAlert({
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
          setAlert({
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

      setAlert({
        type: isCorrect ? "success" : "error",
        title: isCorrect ? "CHÍNH XÁC! Bạn trả lời xuất sắc!" : "CHƯA CHÍNH XÁC. Hãy thử lại nhé!",
        message: "",
        spacedRepetition: {
          conceptId,
          userAnswerDesc,
          days,
          nextReviewDateStr: nextReviewDate.toLocaleDateString("vi-VN"),
          isMastered
        }
      })
    }
  }

  return { handleAction }
}
