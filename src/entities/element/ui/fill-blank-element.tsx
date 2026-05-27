import { type SlideElement } from "broker-core-sdk"
import React, { useState } from "react"
import { HelpCircle, CheckCircle2, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface FillBlankElementProps {
  element: Extract<SlideElement, { type: "FILL_BLANK" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

const FillBlankElement: React.FC<FillBlankElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  const [value, setValue] = useState("")
  const [hasChecked, setHasChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [prevElementId, setPrevElementId] = useState(element.id)

  // Reset state when element changes during render
  if (element.id !== prevElementId) {
    setPrevElementId(element.id)
    setValue("")
    setHasChecked(false)
    setIsCorrect(false)
  }

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation()
    const trimmedVal = value.trim()
    const correctList = element.data.correctAnswers || []
    const isCaseSensitive = element.data.caseSensitive ?? false

    const correct = correctList.some((answer) => {
      if (isCaseSensitive) {
        return answer.trim() === trimmedVal
      } else {
        return answer.trim().toLowerCase() === trimmedVal.toLowerCase()
      }
    })

    setIsCorrect(correct)
    setHasChecked(true)
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setValue("")
    setHasChecked(false)
    setIsCorrect(false)
  }

  let statusBorder = "1px solid #e4e4e7"
  let statusBg = "#ffffff"
  if (hasChecked) {
    statusBorder = isCorrect ? "2px solid #10b981" : "2px solid #ef4444"
    statusBg = isCorrect ? "#f0fdf4" : "#fef2f2"
  }

  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: statusBg,
        padding: "20px",
        borderRadius: "12px",
        border: statusBorder,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "12px",
        transition: "all 0.3s ease",
      }}
      onClick={handleClick}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <HelpCircle
          style={{ height: "16px", width: "16px", color: "#0ea5e9" }}
        />
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#0284c7",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Điền vào chỗ trống
        </span>
      </div>

      {/* Question */}
      <h3
        style={{
          margin: 0,
          fontSize: "1rem",
          fontWeight: 600,
          color: "#1e293b",
          lineHeight: "1.4",
        }}
      >
        {element.data.question}
      </h3>

      {/* Input */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setHasChecked(false)
          }}
          disabled={hasChecked && isCorrect}
          placeholder="Nhập câu trả lời của bạn..."
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: "0.875rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            outline: "none",
            backgroundColor: hasChecked && isCorrect ? "#f1f5f9" : "#ffffff",
            color: "#0f172a",
            transition: "all 0.15s ease",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (!hasChecked || !isCorrect)) {
              // Trigger check on Enter press
              e.preventDefault()
              const syntheticEvent = {
                stopPropagation: () => {},
              } as React.MouseEvent
              handleCheck(syntheticEvent)
            }
          }}
        />
      </div>

      {/* Feedback Banner */}
      {hasChecked && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            fontSize: "0.8125rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: isCorrect ? "#dcfce7" : "#fee2e2",
            color: isCorrect ? "#166534" : "#991b1b",
            border: isCorrect ? "1px solid #bbf7d0" : "1px solid #fecaca",
          }}
        >
          {isCorrect ? (
            <>
              <CheckCircle2
                style={{ height: "16px", width: "16px", flexShrink: 0 }}
              />
              <span>Chính xác! Câu trả lời của bạn hoàn toàn đúng.</span>
            </>
          ) : (
            <>
              <XCircle
                style={{ height: "16px", width: "16px", flexShrink: 0 }}
              />
              <span>Chưa chính xác rồi. Hãy thử lại nhé!</span>
            </>
          )}
        </div>
      )}

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
          marginTop: "auto",
        }}
      >
        {hasChecked && !isCorrect && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            style={{
              borderColor: "#ef4444",
              color: "#ef4444",
              fontSize: "0.75rem",
            }}
          >
            <RefreshCw
              style={{ height: "12px", width: "12px", marginRight: "4px" }}
            />
            Thử lại
          </Button>
        )}
        <Button
          variant={hasChecked && isCorrect ? "secondary" : "default"}
          size="sm"
          onClick={handleCheck}
          disabled={hasChecked && isCorrect}
          style={{
            fontSize: "0.75rem",
            backgroundColor: hasChecked && isCorrect ? "#10b981" : undefined,
            color: hasChecked && isCorrect ? "#ffffff" : undefined,
          }}
        >
          {hasChecked && isCorrect ? "Đã chính xác" : "Kiểm tra"}
        </Button>
      </div>
    </div>
  )
}

export default FillBlankElement
