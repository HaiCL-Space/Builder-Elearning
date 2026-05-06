import { type SlideElement } from "@broker/core-sdk"
import React from "react"

interface SortingElementProps {
  element: Extract<SlideElement, { type: "SORTING" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

const SortingElement: React.FC<SortingElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: "#e9ecef",
        padding: "16px",
        borderRadius: "8px",
      }}
      onClick={handleClick}
    >
      {element.data.items.map((item) => (
        <div
          key={item.id}
          style={{
            padding: "12px",
            margin: "8px 0",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            cursor: "grab",
          }}
        >
          ↕️ {item.content}
        </div>
      ))}
    </div>
  )
}

export default SortingElement
