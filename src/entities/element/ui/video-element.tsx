import { type SlideElement } from "@broker/core-sdk"
import React from "react"

interface VideoElementProps {
  element: Extract<SlideElement, { type: "VIDEO" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

const VideoElement: React.FC<VideoElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: "#000",
        color: "#fff",
        alignItems: "center",
      }}
      onClick={handleClick}
    >
      <span>🎥 Video: {element.data.src}</span>
    </div>
  )
}

export default VideoElement
