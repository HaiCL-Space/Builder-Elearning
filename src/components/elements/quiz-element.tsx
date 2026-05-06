import { type SlideElement } from "@broker/core-sdk"
import React from "react"

interface QuizElementProps {
  element: Extract<SlideElement, { type: "QUIZ" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

const QuizElement: React.FC<QuizElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
      onClick={handleClick}
    >
      <h3 style={{ marginTop: 0 }}>{element.data.question}</h3>
      {element.data.options.map((opt) => (
        <div
          key={opt.id}
          style={{
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="radio"
            name={element.id}
            id={opt.id}
            style={{ cursor: "pointer" }}
          />
          <label
            htmlFor={opt.id}
            style={{ marginLeft: "8px", cursor: "pointer", flex: 1 }}
          >
            {opt.content}
          </label>
        </div>
      ))}
    </div>
  )
}

export default QuizElement
