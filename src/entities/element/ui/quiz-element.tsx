import { type SlideElement } from "broker-core-sdk"
import React from "react"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"
import { Label } from "@/shared/ui/label"

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
        padding: "20px",
        borderRadius: "12px",
        border: "1px solid #e4e4e7",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        color: "#09090b",
      }}
      onClick={handleClick}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "16px",
          fontSize: "1.125rem",
          fontWeight: 600,
        }}
      >
        {element.data.question}
      </h3>
      <RadioGroup name={element.id} data-quiz-id={element.id}>
        {element.data.options.map((opt) => (
          <div
            key={opt.id}
            style={{
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <RadioGroupItem
              value={opt.id}
              id={opt.id}
              style={{ cursor: "pointer" }}
            />
            <Label
              htmlFor={opt.id}
              style={{
                cursor: "pointer",
                flex: 1,
                fontSize: "0.875rem",
                fontWeight: 400,
                userSelect: "none",
              }}
            >
              {opt.content}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default QuizElement
