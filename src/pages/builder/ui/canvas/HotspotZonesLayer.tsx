import React from "react"
import type { BuilderElement } from "@/pages/builder/model/types"
import type { HotspotZone } from "@/pages/builder/model/types"

export function HotspotZonesLayer({
  element,
  zones,
  onZoneMouseDown,
  onZoneResizeMouseDown,
}: {
  element: BuilderElement
  zones: HotspotZone[]
  onZoneMouseDown: (
    e: React.MouseEvent,
    element: BuilderElement,
    zone: HotspotZone
  ) => void
  onZoneResizeMouseDown: (
    e: React.MouseEvent,
    element: BuilderElement,
    zone: HotspotZone,
    handle: string
  ) => void
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {zones.map((z) => {
        const w = Math.max(0, z.xMax - z.xMin)
        const h = Math.max(0, z.yMax - z.yMin)
        return (
          <div
            key={z.id}
            onMouseDown={(e) => onZoneMouseDown(e, element, z)}
            className="pointer-events-auto absolute rounded-sm border border-blue-600 bg-blue-500/20"
            style={{
              left: `${z.xMin}%`,
              top: `${z.yMin}%`,
              width: `${w}%`,
              height: `${h}%`,
              cursor: "move",
            }}
            title={`Drag zone: ${z.id}`}
          >
            {/* ID label at top-left */}
            <div className="absolute top-1 left-1 pointer-events-none select-none bg-blue-600 text-white text-[8px] font-bold px-1 rounded shadow-xs max-w-[90%] truncate">
              {z.id}
            </div>

            {/* Resize Handles */}
            {["nw", "n", "ne", "w", "e", "sw", "s", "se"].map((handle) => (
              <div
                key={handle}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  onZoneResizeMouseDown(e, element, z, handle)
                }}
                className={`absolute z-10 h-2 w-2 rounded-sm border border-white bg-blue-600 shadow-sm ${
                  handle.includes("n")
                    ? "-top-1"
                    : handle.includes("s")
                      ? "-bottom-1"
                      : "top-1/2 -translate-y-1/2"
                } ${
                  handle.includes("w")
                    ? "-left-1"
                    : handle.includes("e")
                      ? "-right-1"
                      : "left-1/2 -translate-x-1/2"
                }`}
                style={{
                  cursor: `${handle.includes("n") ? "n" : handle.includes("s") ? "s" : ""}${
                    handle.includes("w") ? "w" : handle.includes("e") ? "e" : ""
                  }-resize`,
                }}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}

