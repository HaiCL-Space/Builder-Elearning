import { type SlideElement } from "broker-core-sdk"
import React, { useState } from "react"
import { HelpCircle, RefreshCw, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface WordScrambleElementProps {
  element: Extract<SlideElement, { type: "WORD_SCRAMBLE" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

const WordScrambleElement: React.FC<WordScrambleElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  const scrambledWord = element.data.scrambledWord || ""
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

  // Split scrambled word into letter tokens
  const letters = scrambledWord.split("")

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation()
    const trimmedVal = value.trim()
    const correctWord = element.data.correctWord || ""
    const isCaseSensitive = element.data.caseSensitive ?? false

    let correct = false
    if (isCaseSensitive) {
      correct = trimmedVal === correctWord.trim()
    } else {
      correct = trimmedVal.toLowerCase() === correctWord.trim().toLowerCase()
    }

    setIsCorrect(correct)
    setHasChecked(true)
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setValue("")
    setHasChecked(false)
    setIsCorrect(false)
  }

  let statusBorder = "1px solid #e2e8f0"
  let statusBg = "#f8fafc"
  if (hasChecked) {
    statusBorder = isCorrect ? "2px solid #10b981" : "2px solid #ef4444"
    statusBg = isCorrect ? "#f0fdf4" : "#fef2f2"
  }

  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: statusBg,
        padding: "16px",
        borderRadius: "12px",
        border: statusBorder,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "12px",
        transition:
          "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      onClick={handleClick}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <HelpCircle
          style={{ height: "16px", width: "16px", color: "#a855f7" }}
        />
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#9333ea",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Giải đố sắp xếp chữ
        </span>
      </div>

      {/* Scrambled Word Badges */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "4px 0",
        }}
      >
        {letters.map((letter, idx) => (
          <div
            key={`letter-${idx}-${letter}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              border: "2px solid #d8b4fe",
              color: "#7e22ce",
              fontWeight: 700,
              fontSize: "0.9375rem",
              boxShadow: "0 2px 4px 0 rgba(147, 51, 234, 0.1)",
              transition: "transform 0.15s ease",
              cursor: "default",
            }}
            className="hover:-translate-y-0.5 hover:scale-110"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setHasChecked(false)
          }}
          disabled={hasChecked && isCorrect}
          placeholder="Nhập từ chính xác..."
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: "0.8125rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            outline: "none",
            backgroundColor: hasChecked && isCorrect ? "#f1f5f9" : "#ffffff",
            color: "#0f172a",
            transition: "background-color 0.15s ease, border-color 0.15s ease",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (!hasChecked || !isCorrect)) {
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
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "0.75rem",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: isCorrect ? "#dcfce7" : "#fee2e2",
            color: isCorrect ? "#166534" : "#991b1b",
            border: isCorrect ? "1px solid #bbf7d0" : "1px solid #fecaca",
          }}
        >
          {isCorrect ? (
            <>
              <CheckCircle2
                style={{ height: "14px", width: "14px", flexShrink: 0 }}
              />
              <span>Chính xác rồi! Từ hoàn toàn khớp.</span>
            </>
          ) : (
            <>
              <XCircle
                style={{ height: "14px", width: "14px", flexShrink: 0 }}
              />
              <span>Chưa chính xác rồi. Hãy thử lại chữ cái nhé!</span>
            </>
          )}
        </div>
      )}

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
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
              height: "28px",
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
            height: "28px",
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

export default WordScrambleElement
