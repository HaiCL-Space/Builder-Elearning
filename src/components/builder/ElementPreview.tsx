import type { BuilderElement } from "./types"
import {
  HelpCircle,
  MousePointerClick,
  ArrowUpDown,
  Link2,
  Check,
  Play,
  GripVertical,
} from "lucide-react"

interface QuizOption {
  id: string
  content: string
}

interface SortingItem {
  id: string
  content: string
}

interface ColumnItem {
  id: string
  content: string
}

interface HotspotZone {
  id: string
  xMin: number
  yMin: number
  xMax: number
  yMax: number
  label?: string
}

export function ElementPreview({ element }: { element: BuilderElement }) {
  const styleObj = element.style || {}

  switch (element.type) {
    case "TEXT":
      return (
        <div
          className="flex h-full w-full items-center justify-center px-4 py-2"
          style={{
            fontSize: styleObj.fontSize ?? 16,
            color: styleObj.color || "#333",
            textAlign: styleObj.textAlign || "center",
            backgroundColor: styleObj.backgroundColor || "transparent",
            fontFamily: styleObj.fontFamily || "inherit",
            fontWeight: styleObj.fontWeight || "normal",
            borderRadius: styleObj.borderRadius ? `${styleObj.borderRadius}px` : "0px",
            wordBreak: "break-word",
          }}
        >
          {(element.data as { content?: string }).content || "Văn bản trống"}
        </div>
      )

    case "VIDEO": {
      const data = element.data as { src?: string; poster?: string }
      const src = data.src || ""
      const poster = data.poster || ""
      return (
        <div className="relative flex h-full w-full flex-col items-center justify-center bg-slate-950 text-white overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt="Video Poster"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          ) : null}
          <div className="relative z-10 flex flex-col items-center gap-2 rounded-full bg-black/60 p-4 backdrop-blur-xs transition hover:bg-black/80 hover:scale-105">
            <Play className="h-6 w-6 text-white fill-white" />
          </div>
          <div className="absolute bottom-2 left-2 right-2 z-10 truncate text-[10px] font-semibold text-slate-300 bg-black/40 px-2 py-1 rounded backdrop-blur-xs">
            {src ? `Video: ${src}` : "Chưa cấu hình video"}
          </div>
        </div>
      )
    }

    case "QUIZ": {
      const quizData = element.data as { question?: string; options?: QuizOption[]; correctId?: string }
      const question = quizData.question || "Câu hỏi chưa đặt tên?"
      const options = quizData.options || []
      const correctId = quizData.correctId

      return (
        <div
          className="flex h-full w-full flex-col justify-between bg-white p-4 text-slate-800"
          style={{
            borderRadius: styleObj.borderRadius ? `${styleObj.borderRadius}px` : "8px",
            backgroundColor: styleObj.backgroundColor || "#ffffff",
          }}
        >
          <div className="mb-2">
            <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-xs mb-1">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>TRẮC NGHIỆM</span>
            </div>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">
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
                    {isCorrect ? <Check className="h-2.5 w-2.5 stroke-[3px]" /> : null}
                  </div>
                  <span className="truncate flex-1">{opt.content}</span>
                  {isCorrect && (
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
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
      const sortingData = element.data as { items?: SortingItem[]; correctOrder?: string[] }
      const items = sortingData.items || []
      const correctOrder = sortingData.correctOrder || []

      return (
        <div
          className="flex h-full w-full flex-col justify-between bg-slate-50 p-4 text-slate-800"
          style={{
            borderRadius: styleObj.borderRadius ? `${styleObj.borderRadius}px` : "8px",
            backgroundColor: styleObj.backgroundColor || "#f8fafc",
          }}
        >
          <div className="mb-2">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs mb-1">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>SẮP XẾP</span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center border-2 border-dashed border-slate-200 rounded-md bg-white p-4 text-[10px] text-slate-400">
              Nhấp để thiết lập danh sách sắp xếp
            </div>
          ) : (
            <div className="space-y-1.5 overflow-y-auto pr-1">
              {items.map((item: SortingItem, index: number) => {
                // Find index of this item in correctOrder to show its target sequence number
                const targetIdx = correctOrder.indexOf(item.id)
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-1.5 text-[10px] font-medium shadow-2xs"
                  >
                    <GripVertical className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-600">
                      {index + 1}
                    </span>
                    <span className="truncate flex-1 text-slate-800">{item.content}</span>
                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700">
                      Đích: {targetIdx !== -1 ? targetIdx + 1 : "?"}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    case "MATCHING": {
      const matchingData = element.data as { leftColumn?: ColumnItem[]; rightColumn?: ColumnItem[] }
      const leftCol = matchingData.leftColumn || []
      const rightCol = matchingData.rightColumn || []

      return (
        <div
          className="flex h-full w-full flex-col justify-between bg-violet-50/50 p-4 text-slate-800"
          style={{
            borderRadius: styleObj.borderRadius ? `${styleObj.borderRadius}px` : "8px",
            backgroundColor: styleObj.backgroundColor || "rgba(139, 92, 246, 0.05)",
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-violet-600 font-semibold text-xs">
              <Link2 className="h-3.5 w-3.5" />
              <span>NỐI CẶP</span>
            </div>
          </div>

          {leftCol.length === 0 ? (
            <div className="flex flex-1 items-center justify-center border-2 border-dashed border-slate-200 rounded-md bg-white p-4 text-[10px] text-slate-400">
              Chưa thiết lập danh sách ghép cặp
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 overflow-y-auto">
              {/* Left Column */}
              <div className="space-y-1">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Cột trái
                </div>
                {leftCol.map((item: ColumnItem) => (
                  <div
                    key={item.id}
                    className="truncate rounded-md border border-blue-200 bg-blue-50/40 p-1.5 text-[9px] font-medium text-blue-800 text-center"
                  >
                    {item.content}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-1">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Cột phải
                </div>
                {rightCol.map((item: ColumnItem) => (
                  <div
                    key={item.id}
                    className="truncate rounded-md border border-pink-200 bg-pink-50/40 p-1.5 text-[9px] font-medium text-pink-800 text-center"
                  >
                    {item.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    }

    case "HOTSPOT": {
      const hotspotData = element.data as { zones?: HotspotZone[]; imageUri?: string; correctZoneId?: string }
      const zones = hotspotData.zones || []

      return (
        <div className="relative h-full w-full overflow-hidden bg-slate-100">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: hotspotData.imageUri ? `url(${hotspotData.imageUri})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {!hotspotData.imageUri && (
            <div className="absolute inset-0 flex items-center justify-center bg-rose-50 text-rose-700">
              <div className="text-center">
                <MousePointerClick className="mx-auto mb-1 h-5 w-5 opacity-60" />
                <span className="text-[10px] font-medium opacity-80">HOTSPOT</span>
              </div>
            </div>
          )}

          {/* Zones layout overlay */}
          {zones.map((z: HotspotZone) => {
            const w = Math.max(0, z.xMax - z.xMin)
            const h = Math.max(0, z.yMax - z.yMin)
            const isCorrect = hotspotData.correctZoneId && z.id === hotspotData.correctZoneId
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
                title={`Zone: ${z.label || z.id}`}
              />
            )
          })}

          <div className="pointer-events-none absolute top-1.5 left-1.5 rounded-md bg-black/60 px-2 py-0.5 text-[8px] font-bold tracking-wider text-white uppercase backdrop-blur-xs">
            Hotspot preview
          </div>
        </div>
      )
    }

    default:
      return (
        <div className="flex h-full w-full items-center justify-center bg-gray-50 text-[10px] text-gray-400">
          {element.type}
        </div>
      )
  }
}
