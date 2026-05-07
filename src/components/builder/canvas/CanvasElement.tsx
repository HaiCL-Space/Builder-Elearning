import React from "react"
import type { BuilderElement } from "../types"
import { ElementPreview } from "../ElementPreview"
import { DeleteButton } from "./DeleteButton"
import { ElementTypeBadge } from "./ElementTypeBadge"
import { HotspotZonesLayer } from "./HotspotZonesLayer"
import { ResizeHandles } from "./ResizeHandles"
import type { HotspotZone } from "./types"

export function CanvasElement({
  element,
  isSelected,
  onElementMouseDown,
  onHotspotZoneMouseDown,
  onDeleteElement,
  onResizeMouseDown,
}: {
  element: BuilderElement
  isSelected: boolean
  onElementMouseDown: (e: React.MouseEvent, element: BuilderElement) => void
  onHotspotZoneMouseDown: (
    e: React.MouseEvent,
    element: BuilderElement,
    zone: HotspotZone
  ) => void
  onDeleteElement: (id: string) => void
  onResizeMouseDown: (
    e: React.MouseEvent,
    element: BuilderElement,
    handle: string
  ) => void
}) {
  const pos = element.position
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    width: `${pos.w}%`,
    height: `${pos.h}%`,
    overflow: "hidden",
    boxSizing: "border-box",
    ...element.style,
  }

  const zones =
    ((element.data as unknown as { zones?: HotspotZone[] })?.zones as
      | HotspotZone[]
      | undefined) || []

  return (
    <div
      style={baseStyle}
      className={`group cursor-move ${
        isSelected ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-300"
      }`}
      onMouseDown={(e) => onElementMouseDown(e, element)}
    >
      <div className="pointer-events-none flex h-full w-full items-center justify-center overflow-hidden">
        <ElementPreview element={element} />
      </div>

      {/* interactive zones for HOTSPOT (drag/drop) */}
      {isSelected && element.type === "HOTSPOT" && (
        <HotspotZonesLayer
          element={element}
          zones={zones}
          onZoneMouseDown={onHotspotZoneMouseDown}
        />
      )}

      <ElementTypeBadge type={String(element.type)} />

      {isSelected && (
        <>
          <DeleteButton onDelete={() => onDeleteElement(element.id)} />
          <ResizeHandles
            onMouseDown={(e, handle) => onResizeMouseDown(e, element, handle)}
          />
        </>
      )}
    </div>
  )
}
