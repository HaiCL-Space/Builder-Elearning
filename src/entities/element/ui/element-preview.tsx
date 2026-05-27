import type { BuilderElement } from "@/pages/builder/model/types"
import { type VideoData, type SlideElement } from "broker-core-sdk"
import { HelpCircle, MousePointerClick, Check, Play } from "lucide-react"
import MemoryCardElement from "./memory-card-element"
import FillBlankElement from "./fill-blank-element"
import SwipeElement from "./swipe-element"
import TimedSprintElement from "./timed-sprint-element"
import WordScrambleElement from "./word-scramble-element"
import MatchingElement from "./matching-element"
import SortingElement from "./sorting-element"
import CrosswordElement from "./crossword-element"
import BranchingElement from "./branching-element"
import LabelImageElement from "./label-image-element"

interface QuizOption {
  id: string
  content: string
}

interface HotspotZone {
  id: string
  xMin: number
  yMin: number
  xMax: number
  yMax: number
}

export function ElementPreview({
  element,
  hideZones = false,
}: {
  element: BuilderElement
  hideZones?: boolean
}) {
  const styleObj = element.style || {}

  switch (element.type) {
    case "TEXT":
      return (
        <div
          className="flex h-full w-full flex-col justify-center px-4 py-2"
          style={{
            fontSize: styleObj.fontSize ?? 16,
            color: styleObj.color || "#333",
            textAlign:
              (styleObj.textAlign as React.CSSProperties["textAlign"]) ||
              "center",
            backgroundColor: styleObj.backgroundColor || "transparent",
            fontFamily: styleObj.fontFamily || "inherit",
            fontWeight: styleObj.fontWeight || "normal",
            borderRadius: styleObj.borderRadius
              ? `${styleObj.borderRadius}px`
              : "0px",
            wordBreak: "break-word",
          }}
        >
          {(element.data as { content?: string }).content || "Văn bản trống"}
        </div>
      )

    case "VIDEO": {
      const data = element.data as VideoData
      const src = data.src || ""
      const poster = data.poster || ""
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-slate-950 text-white">
          {poster ? (
            <img
              src={poster}
              alt="Video Poster"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          ) : null}
          <div className="relative z-10 flex flex-col items-center gap-2 rounded-full bg-black/60 p-4 backdrop-blur-xs transition hover:scale-105 hover:bg-black/80">
            <Play className="h-6 w-6 fill-white text-white" />
          </div>
          <div className="absolute right-2 bottom-2 left-2 z-10 truncate rounded bg-black/40 px-2 py-1 text-[10px] font-semibold text-slate-300 backdrop-blur-xs">
            {src ? `Video: ${src}` : "Chưa cấu hình video"}
          </div>
        </div>
      )
    }

    case "QUIZ": {
      const quizData = element.data as {
        question?: string
        options?: QuizOption[]
        correctId?: string
      }
      const question = quizData.question || "Câu hỏi chưa đặt tên?"
      const options = quizData.options || []
      const correctId = quizData.correctId

      return (
        <div
          className="flex h-full w-full flex-col justify-between bg-white p-4 text-slate-800"
          style={{
            borderRadius: styleObj.borderRadius
              ? `${styleObj.borderRadius}px`
              : "8px",
            backgroundColor: styleObj.backgroundColor || "#ffffff",
          }}
        >
          <div className="mb-2">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>TRẮC NGHIỆM</span>
            </div>
            <h3 className="text-xs leading-tight font-bold text-slate-900">
              {question}
            </h3>
          </div>

          <div className="space-y-1.5 overflow-y-auto pr-1">
            {options.map((opt: QuizOption) => {
              const isCorrect = opt.id === correctId
              return (
                <div
                  key={opt.id}
                  className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[10px] font-medium transition ${
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50/50 text-emerald-800"
                      : "border-slate-100 bg-slate-50/50 text-slate-700"
                  }`}
                >
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                      isCorrect
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isCorrect ? (
                      <Check className="h-2.5 w-2.5 stroke-[3px]" />
                    ) : null}
                  </div>
                  <span className="flex-1 truncate">{opt.content}</span>
                  {isCorrect && (
                    <span className="text-[9px] font-bold tracking-wider text-emerald-600 uppercase">
                      Đúng
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    case "SORTING": {
      return (
        <div className="pointer-events-none h-full w-full">
          <SortingElement
            element={
              element as unknown as Extract<SlideElement, { type: "SORTING" }>
            }
            baseStyle={{ width: "100%", height: "100%" }}
            handleClick={() => {}}
          />
        </div>
      )
    }

    case "MATCHING": {
      return (
        <div className="pointer-events-none h-full w-full">
          <MatchingElement
            element={
              element as unknown as Extract<SlideElement, { type: "MATCHING" }>
            }
            baseStyle={{ width: "100%", height: "100%" }}
            handleClick={() => {}}
          />
        </div>
      )
    }

    case "HOTSPOT": {
      const hotspotData = element.data as {
        zones?: HotspotZone[]
        imageUri?: string
        correctZoneId?: string
      }
      const zones = hotspotData.zones || []

      return (
        <div className="relative h-full w-full overflow-hidden bg-slate-100">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: hotspotData.imageUri
                ? `url(${hotspotData.imageUri})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {!hotspotData.imageUri && (
            <div className="absolute inset-0 flex items-center justify-center bg-rose-50 text-rose-700">
              <div className="text-center">
                <MousePointerClick className="mx-auto mb-1 h-5 w-5 opacity-60" />
                <span className="text-[10px] font-medium opacity-80">
                  HOTSPOT
                </span>
              </div>
            </div>
          )}

          {/* Zones layout overlay */}
          {!hideZones &&
            zones.map((z: HotspotZone) => {
              const w = Math.max(0, z.xMax - z.xMin)
              const h = Math.max(0, z.yMax - z.yMin)
              const isCorrect =
                hotspotData.correctZoneId && z.id === hotspotData.correctZoneId
              return (
                <div
                  key={z.id}
                  className={`absolute box-border rounded-xs border-2 ${
                    isCorrect
                      ? "border-emerald-500 bg-emerald-500/20"
                      : "border-rose-500 bg-rose-500/20"
                  } transition-all duration-150`}
                  style={{
                    left: `${z.xMin}%`,
                    top: `${z.yMin}%`,
                    width: `${w}%`,
                    height: `${h}%`,
                  }}
                  title={`Zone: ${z.id}`}
                />
              )
            })}

          <div className="pointer-events-none absolute top-1.5 left-1.5 rounded-md bg-black/60 px-2 py-0.5 text-[8px] font-bold tracking-wider text-white uppercase backdrop-blur-xs">
            Hotspot preview
          </div>
        </div>
      )
    }

    case "MEMORY_CARD": {
      return (
        <div className="pointer-events-none h-full w-full">
          <MemoryCardElement
            element={
              element as unknown as Extract<
                SlideElement,
                { type: "MEMORY_CARD" }
              >
            }
            baseStyle={{ width: "100%", height: "100%" }}
            handleClick={() => {}}
          />
        </div>
      )
    }

    case "FILL_BLANK": {
      return (
        <div className="pointer-events-none h-full w-full">
          <FillBlankElement
            element={
              element as unknown as Extract<
                SlideElement,
                { type: "FILL_BLANK" }
              >
            }
            baseStyle={{ width: "100%", height: "100%" }}
            handleClick={() => {}}
          />
        </div>
      )
    }

    case "SWIPE": {
      return (
        <div className="pointer-events-none h-full w-full">
          <SwipeElement
            element={
              element as unknown as Extract<SlideElement, { type: "SWIPE" }>
            }
            baseStyle={{ width: "100%", height: "100%" }}
            handleClick={() => {}}
          />
        </div>
      )
    }

    case "TIMED_SPRINT": {
      return (
        <div className="pointer-events-none h-full w-full">
          <TimedSprintElement
            element={
              element as unknown as Extract<
                SlideElement,
                { type: "TIMED_SPRINT" }
              >
            }
            baseStyle={{ width: "100%", height: "100%" }}
            handleClick={() => {}}
          />
        </div>
      )
    }

    case "WORD_SCRAMBLE": {
      return (
        <div className="pointer-events-none h-full w-full">
          <WordScrambleElement
            element={
              element as unknown as Extract<
                SlideElement,
                { type: "WORD_SCRAMBLE" }
              >
            }
            baseStyle={{ width: "100%", height: "100%" }}
            handleClick={() => {}}
          />
        </div>
      )
    }

    case "CROSSWORD": {
      return (
        <div className="pointer-events-none h-full w-full">
          <CrosswordElement
            element={
              element as unknown as Extract<SlideElement, { type: "CROSSWORD" }>
            }
            baseStyle={{ width: "100%", height: "100%" }}
            handleClick={() => {}}
          />
        </div>
      )
    }

    case "BRANCHING": {
      return (
        <div className="pointer-events-none h-full w-full">
          <BranchingElement
            element={
              element as unknown as Extract<SlideElement, { type: "BRANCHING" }>
            }
            baseStyle={{ width: "100%", height: "100%" }}
            handleClick={() => {}}
          />
        </div>
      )
    }

    case "LABEL_IMAGE": {
      return (
        <div className="pointer-events-none h-full w-full">
          <LabelImageElement
            element={
              element as unknown as Extract<
                SlideElement,
                { type: "LABEL_IMAGE" }
              >
            }
            baseStyle={{ width: "100%", height: "100%" }}
            handleClick={() => {}}
            isInteractive={false}
          />
        </div>
      )
    }

    default:
      return (
        <div className="flex h-full w-full items-center justify-center bg-gray-50 text-[10px] text-gray-400">
          {(element as unknown as { type: string }).type}
        </div>
      )
  }
}
