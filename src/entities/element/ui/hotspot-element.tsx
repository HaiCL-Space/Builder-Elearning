import { type SlideElement } from "broker-core-sdk"
import React from "react"

interface HotspotElementProps {
  element: Extract<SlideElement, { type: "HOTSPOT" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent, zoneId?: string) => void
  isInteractive?: boolean
}

const HotspotElement: React.FC<HotspotElementProps> = ({
  element,
  baseStyle,
  handleClick,
  isInteractive = true,
}) => {
  const zones = element.data.zones || []

  return (
    <div
      style={{
        ...baseStyle,
        backgroundImage: `url(${element.data.imageUri})`,
        backgroundSize: "cover",
        border: isInteractive ? "none" : "2px dashed #007bff",
      }}
    >
      {!isInteractive && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "rgba(255,255,255,0.8)",
            padding: "4px",
            pointerEvents: "none",
          }}
        >
          👆 Vùng Hotspot
        </div>
      )}
      {zones.map((zone) => (
        <div
          key={zone.id}
          onClick={(e) => handleClick(e, zone.id)} // Truyền zone.id khi click
          style={{
            position: "absolute",
            left: `${zone.xMin}%`,
            top: `${zone.yMin}%`,
            width: `${zone.xMax - zone.xMin}%`,
            height: `${zone.yMax - zone.yMin}%`,
            backgroundColor: isInteractive ? "transparent" : "rgba(255, 0, 0, 0.3)",
            cursor: "pointer",
            border: isInteractive ? "none" : "1px solid red",
          }}
          title={isInteractive ? undefined : `Zone: ${zone.id}`}
        />
      ))}
    </div>
  )
}

export default HotspotElement
