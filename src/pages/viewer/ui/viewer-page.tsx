import { useState } from "react"
import {
  ACTION_TYPES,
  learningEngine,
  gameEngine,
  type ElementAction,
  type MultipleChoiceData,
  type Slide,
  type CrosswordData,
  type BranchingData,
  type LabelImageData,
} from "broker-core-sdk"
import { MOCK_SLIDES } from "@/shared/api"
import { THEME_BACKGROUNDS } from "@/shared/lib/builder-utils"
import CanvasElement from "@/pages/builder/ui/canvas/CanvasElement"
import type { BuilderElement } from "@/pages/builder/model/types"
import { CustomAlertDialog } from "@/shared/ui/custom-alert-dialog"
import { useSlidesQuery } from "@/entities/slide"

function getInitiallyHiddenElements(slide: Slide) {
  const initiallyHidden = new Set<string>()

  slide.elements.forEach((element) => {
    if (element.style?.opacity === 0) initiallyHidden.add(element.id)
  })

  return initiallyHidden
}

export function ViewerPage() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const lessonId = params.get("lessonId") || "lesson-demo"

  // 1. Fetch slides dynamically using React Query v5
  const {
    data: slides = MOCK_SLIDES,
    isPending,
    isError,
    error,
  } = useSlidesQuery(lessonId)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  // Guard slide access safely
  const currentSlide = slides[currentSlideIndex] || slides[0] || MOCK_SLIDES[0]

  const [prevSlideId, setPrevSlideId] = useState<string | null>(null)
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(new Set())

  // Adjust state synchronously during render when the slide ID changes
  if (currentSlide && currentSlide.id !== prevSlideId) {
    setPrevSlideId(currentSlide.id)
    setHiddenElements(getInitiallyHiddenElements(currentSlide))
  }

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

  // Loading & Error Boundaries (Premium Experience)
  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-cyan-500" />
          <span className="text-xs font-semibold tracking-wider text-cyan-300 uppercase">
            Đang tải slide viewer...
          </span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-white/10 bg-slate-900 p-8 px-6 text-center shadow-2xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-xl font-bold text-red-500">
            !
          </div>
          <h2 className="text-base font-bold text-white">Lỗi tải slides</h2>
          <p className="text-xs leading-relaxed text-slate-400">
            {error?.message || "Đã xảy ra lỗi không xác định."}
          </p>
        </div>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-950 text-slate-50 font-sans">
        <div className="border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  window.history.pushState(null, "", "/home")
                  window.dispatchEvent(new PopStateEvent("popstate"))
                }}
                className="cursor-pointer flex items-center gap-1 rounded-full border border-white/20 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition shadow-sm"
              >
                ❮ Dashboard
              </button>
              <div>
                <div className="text-[11px] font-semibold tracking-[0.22em] text-cyan-300 uppercase">
                  Viewer
                </div>
                <div className="text-xs text-slate-400">Bài học trống</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_30%)]" />

          <div className="relative z-10 flex max-w-md flex-col items-center gap-5 rounded-3xl border border-white/10 bg-slate-900/50 p-8 text-center shadow-2xl backdrop-blur-md animate-fade-in">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/5 text-cyan-400">
              <svg
                className="h-7 w-7 text-cyan-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Bài học chưa được thiết kế Slide</h2>
              <p className="mt-2.5 text-xs leading-relaxed text-slate-400">
                Bài học này hiện tại chưa chứa bất kỳ slide tương tác nào. Vui lòng quay lại Dashboard và chọn chế độ **Thiết kế** để xây dựng nội dung học tập.
              </p>
            </div>
            <button
              onClick={() => {
                window.history.pushState(null, "", "/home")
                window.dispatchEvent(new PopStateEvent("popstate"))
              }}
              className="mt-2 w-full rounded-xl bg-cyan-400 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300 cursor-pointer select-none"
            >
              Quay lại Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    setCurrentSlideIndex((index) => Math.min(slides.length - 1, index + 1))
  }

  const handlePrev = () => {
    setCurrentSlideIndex((index) => Math.max(0, index - 1))
  }

  const executeAction = (action: ElementAction) => {
    switch (action.type) {
      case ACTION_TYPES.NAVIGATE_SLIDE:
        if (action.payload.direction === "NEXT") handleNext()
        if (action.payload.direction === "PREV") handlePrev()
        break

      case ACTION_TYPES.TOGGLE_VISIBILITY: {
        const targetId = action.payload.targetElementId

        setHiddenElements((previous) => {
          const next = new Set(previous)

          if (action.payload.action === "SHOW") next.delete(targetId)
          else if (action.payload.action === "HIDE") next.add(targetId)
          else if (next.has(targetId)) next.delete(targetId)
          else next.add(targetId)

          return next
        })
        break
      }

      case ACTION_TYPES.EVALUATE_ANSWER: {
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
              message:
                "Vui lòng chọn một phương án trả lời trước khi kiểm tra!",
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
          const userAnswer = (action.payload as { userAnswer?: string })
            ?.userAnswer

          isCorrect = userAnswer === hotspotData.correctZoneId
          const zone = (hotspotData.zones || []).find(
            (z) => z.id === userAnswer
          )
          userAnswerDesc = zone?.id || userAnswer || "Vùng không xác định"
        } else if (targetEl.type === "SORTING") {
          isCorrect = true
          userAnswerDesc = "Sắp xếp mốc thời gian lịch sử"
        } else if (targetEl.type === "MATCHING") {
          const matchingEl = document.querySelector(
            `[data-matching-id="${targetId}"]`
          )
          const userMatchesRaw = matchingEl?.getAttribute("data-user-matches")
          const userMatches: [string, string][] = userMatchesRaw
            ? JSON.parse(userMatchesRaw)
            : []

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
              message: "Vui lòng nối tất cả các cặp từ trước khi kiểm tra!",
            })
            return
          }

          // Check if all user matches are in correctPairs
          isCorrect = userMatches.every(([uL, uR]) =>
            matchingData.correctPairs.some(([cL, cR]) => cL === uL && cR === uR)
          )

          userAnswerDesc = `Đã nối ${userMatches.length} cặp từ`
        } else if (targetEl.type === "CROSSWORD") {
          const userAnswer = (
            action.payload as { userAnswer?: Record<string, string> }
          )?.userAnswer
          if (!userAnswer || Object.keys(userAnswer).length === 0) {
            setActiveAlert({
              isOpen: true,
              type: "warning",
              title: "Chưa hoàn thành ô chữ",
              message:
                "Vui lòng nhập các chữ cái vào ô trống trước khi kiểm tra!",
            })
            return
          }
          isCorrect = gameEngine.validateGameResult(
            "CROSSWORD",
            userAnswer,
            targetEl.data as CrosswordData
          )
          userAnswerDesc = `Đã giải câu đố ô chữ`
        } else if (targetEl.type === "BRANCHING") {
          const userAnswer = (action.payload as { userAnswer?: string })
            ?.userAnswer
          if (!userAnswer) {
            setActiveAlert({
              isOpen: true,
              type: "warning",
              title: "Chưa đưa ra quyết định",
              message:
                "Vui lòng hoàn thành kịch bản rẽ nhánh trước khi kiểm tra!",
            })
            return
          }
          const branchingData = targetEl.data as BranchingData
          isCorrect = gameEngine.validateGameResult(
            "BRANCHING",
            userAnswer,
            branchingData
          )
          const node = branchingData.nodes?.find(
            (n) => n.id === userAnswer
          )
          userAnswerDesc = `Đưa ra quyết định tại: ${node?.title || userAnswer}`
        } else if (targetEl.type === "LABEL_IMAGE") {
          const userAnswer = (
            action.payload as { userAnswer?: Record<string, string> }
          )?.userAnswer
          const labelImageData = targetEl.data as LabelImageData
          if (
            !userAnswer ||
            Object.keys(userAnswer).length < labelImageData.zones.length
          ) {
            setActiveAlert({
              isOpen: true,
              type: "warning",
              title: "Chưa dán nhãn đầy đủ",
              message:
                "Vui lòng dán nhãn đầy đủ cho tất cả các vùng trước khi kiểm tra!",
            })
            return
          }
          isCorrect = gameEngine.validateGameResult(
            "LABEL_IMAGE",
            userAnswer,
            labelImageData
          )
          userAnswerDesc = `Dán nhãn ${Object.keys(userAnswer).length} vùng hình ảnh`
        } else {
          isCorrect = true
          userAnswerDesc = "Trả lời tự do"
        }

        // Spaced Repetition calculation
        const days = learningEngine.calculateNextReview(isCorrect, "High")
        const isMastered = learningEngine.checkMastery(
          isCorrect ? 3 : 0,
          "High"
        )

        const nextReviewDate = new Date()
        nextReviewDate.setDate(nextReviewDate.getDate() + days)

        setActiveAlert({
          isOpen: true,
          type: isCorrect ? "success" : "error",
          title: isCorrect
            ? "🎉 CHÍNH XÁC! Bạn trả lời xuất sắc!"
            : "❌ SAI RỒI. Hãy thử lại nhé!",
          message: "",
          spacedRepetition: {
            conceptId,
            userAnswerDesc,
            days,
            nextReviewDateStr: nextReviewDate.toLocaleDateString("vi-VN"),
            isMastered,
          },
        })
        break
      }

      case ACTION_TYPES.PLAY_MEDIA:
        console.log("Phát media:", action.payload.mediaUrl)
        break
    }
  }

  const themeBg =
    THEME_BACKGROUNDS[currentSlide.config?.theme || "light"] ||
    THEME_BACKGROUNDS.light

  const renderedElements = currentSlide.elements.map((element) => {
    if (!hiddenElements.has(element.id)) {
      if (element.style?.opacity === 0) {
        return {
          ...element,
          style: {
            ...element.style,
            opacity: 1,
          },
        }
      }

      return element
    }

    return {
      ...element,
      style: {
        ...element.style,
        opacity: 0,
        pointerEvents: "none",
      },
    }
  }) as BuilderElement[]

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-950 text-slate-50">
      <div className="border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                window.history.pushState(null, "", "/home")
                window.dispatchEvent(new PopStateEvent("popstate"))
              }}
              className="cursor-pointer flex items-center gap-1 rounded-full border border-white/20 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition shadow-sm"
            >
              ❮ Dashboard
            </button>
            <div>
              <div className="text-[11px] font-semibold tracking-[0.22em] text-cyan-300 uppercase">
                Viewer
              </div>
              <div className="text-sm text-slate-300">
                Slide {currentSlide.order} / {slides.length}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Quay lại
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === slides.length - 1}
              className="cursor-pointer rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Tiếp theo
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_30%)]" />

        <div
          className="relative h-full w-auto max-w-full overflow-hidden rounded-[28px] border border-white/10 shadow-2xl shadow-cyan-950/30"
          style={{ aspectRatio: "16 / 9", ...themeBg }}
        >
          {renderedElements.map((element) => (
            <CanvasElement
              key={`${element.id}-${currentSlideIndex}`}
              element={element}
              isSelected={false}
              onElementMouseDown={() => undefined}
              onHotspotZoneMouseDown={() => undefined}
              onHotspotZoneResizeMouseDown={() => undefined}
              onDeleteElement={() => undefined}
              onResizeMouseDown={() => undefined}
              isInteractiveMode={true}
              onAction={executeAction}
            />
          ))}
        </div>
      </div>

      {activeAlert && (
        <CustomAlertDialog
          isOpen={activeAlert.isOpen}
          type={activeAlert.type}
          title={activeAlert.title}
          message={activeAlert.message}
          spacedRepetition={activeAlert.spacedRepetition}
          onClose={() =>
            setActiveAlert((prev) => (prev ? { ...prev, isOpen: false } : null))
          }
        />
      )}
    </div>
  )
}

export default ViewerPage
