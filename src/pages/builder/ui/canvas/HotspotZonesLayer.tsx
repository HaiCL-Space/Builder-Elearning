import React from "react"
import type { BuilderElement } from "@/pages/builder/model/types"
import type { HotspotZone } from "@/pages/builder/model/types"

export function HotspotZonesLayer({
  element,
  zones,
  onZoneMouseDown,
}: {
  element: BuilderElement
  zones: HotspotZone[]
  onZoneMouseDown: (
    e: React.MouseEvent,
    element: BuilderElement,
    zone: HotspotZone
  ) => void
}) {
  return (
    <div className="absolute inset-0">
      {zones.map((z) => {
        const w = Math.max(0, z.xMax - z.xMin)
        const h = Math.max(0, z.yMax - z.yMin)
        return (
          <div
            key={z.id}
            onMouseDown={(e) => onZoneMouseDown(e, element, z)}
            className="absolute rounded-sm border border-blue-600 bg-blue-500/20"
            style={{
              left: `${z.xMin}%`,
              top: `${z.yMin}%`,
              width: `${w}%`,
              height: `${h}%`,
              cursor: "move",
            }}
            title={`Drag zone: ${z.id}`}
          />
        )
      })}
    </div>
  )
}
