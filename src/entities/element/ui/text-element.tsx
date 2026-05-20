import { type SlideElement } from "broker-core-sdk"
import React from "react"

interface TextElementProps {
  element: Extract<SlideElement, { type: "TEXT" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

const TextElement: React.FC<TextElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  return (
    <div style={baseStyle} onClick={handleClick}>
      {element.data.content}
    </div>
  )
}

export default TextElement
