import React from "react"
import type { BuilderElement } from "./types"
import {
  Video,
  HelpCircle,
  MousePointerClick,
  ArrowUpDown,
  Link2,
} from "lucide-react"

export function ElementPreview({ element }: { element: BuilderElement }) {
  switch (element.type) {
    case "TEXT":
      return (
        <div
          className="flex h-full w-full items-center justify-center px-2"
          style={{
            fontSize:
              ((element.style as unknown as { fontSize?: number | string })
                ?.fontSize as number | string) ?? 16,
            color:
              ((element.style as unknown as { color?: string })
                ?.color as string) || "#333",
            textAlign:
              ((
                element.style as unknown as {
                  textAlign?: React.CSSProperties["textAlign"]
                }
              )?.textAlign as React.CSSProperties["textAlign"]) || "center",
            backgroundColor:
              ((element.style as unknown as { backgroundColor?: string })
                ?.backgroundColor as string) || "transparent",
            wordBreak: "break-word",
          }}
        >
          {((element.data as unknown as { content?: React.ReactNode })
            ?.content as React.ReactNode) ?? "Text"}
        </div>
      )
    case "VIDEO":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-900 text-white">
          <Video className="h-6 w-6 opacity-60" />
          <span className="text-[10px] opacity-60">VIDEO</span>
        </div>
      )
    case "QUIZ":
      return (
        <div className="flex h-full w-full items-center justify-center bg-amber-50 text-amber-700">
          <div className="text-center">
            <HelpCircle className="mx-auto mb-1 h-5 w-5 opacity-60" />
            <span className="text-[10px] font-medium opacity-80">QUIZ</span>
          </div>
        </div>
      )
    case "HOTSPOT": {
      const data = element.data as unknown as {
        imageUri?: string
        zones?: Array<{
          id: string
          xMin: number
          yMin: number
          xMax: number
          yMax: number
        }>
        correctZoneId?: string
      }

      return (
        <div className="relative h-full w-full overflow-hidden bg-slate-100">
          {/* image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: data?.imageUri
                ? `url(${data.imageUri})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: data?.imageUri ? "none" : "none",
            }}
          />

          {/* placeholder when no image */}
          {!data?.imageUri && (
            <div className="absolute inset-0 flex items-center justify-center bg-rose-50 text-rose-700">
              <div className="text-center">
                <MousePointerClick className="mx-auto mb-1 h-5 w-5 opacity-60" />
                <span className="text-[10px] font-medium opacity-80">
                  HOTSPOT
                </span>
              </div>
            </div>
          )}

          {/* zones */}
          {(data?.zones || []).map((z) => {
            const w = Math.max(0, z.xMax - z.xMin)
            const h = Math.max(0, z.yMax - z.yMin)
            const isCorrect = data?.correctZoneId && z.id === data.correctZoneId
            return (
              <div
                key={z.id}
                className={`absolute box-border rounded-sm border ${
                  isCorrect ? "border-emerald-500" : "border-rose-500"
                }`}
                style={{
                  left: `${z.xMin}%`,
                  top: `${z.yMin}%`,
                  width: `${w}%`,
                  height: `${h}%`,
                  backgroundColor: isCorrect
                    ? "rgba(16,185,129,0.20)"
                    : "rgba(244,63,94,0.20)",
                }}
                title={`Zone: ${z.id}`}
              />
            )
          })}

          {/* label */}
          <div className="pointer-events-none absolute top-1 left-1 rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-semibold text-slate-700">
            Hotspot preview
          </div>
        </div>
      )
    }
    case "SORTING":
      return (
        <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-emerald-700">
          <div className="text-center">
            <ArrowUpDown className="mx-auto mb-1 h-5 w-5 opacity-60" />
            <span className="text-[10px] font-medium opacity-80">SORTING</span>
          </div>
        </div>
      )
    case "MATCHING":
      return (
        <div className="flex h-full w-full items-center justify-center bg-violet-50 text-violet-700">
          <div className="text-center">
            <Link2 className="mx-auto mb-1 h-5 w-5 opacity-60" />
            <span className="text-[10px] font-medium opacity-80">MATCHING</span>
          </div>
        </div>
      )
    default:
      return (
        <div className="flex h-full w-full items-center justify-center bg-gray-50 text-[10px] text-gray-400">
          {element.type}
        </div>
      )
  }
}
