import { type SlideElement } from "@broker/core-sdk"
import React from "react"

interface MatchingElementProps {
  element: Extract<SlideElement, { type: "MATCHING" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

const MatchingElement: React.FC<MatchingElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  return (
    <div
      style={{
        ...baseStyle,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width: "45%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {element.data.leftColumn.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "16px",
              backgroundColor: "#e3f2fd",
              border: "1px solid #90caf9",
              textAlign: "center",
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
      <div
        style={{
          width: "45%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {element.data.rightColumn.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "16px",
              backgroundColor: "#fce4ec",
              border: "1px solid #f48fb1",
              textAlign: "center",
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MatchingElement
