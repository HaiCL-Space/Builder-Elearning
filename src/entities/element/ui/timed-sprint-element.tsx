import { type SlideElement } from "broker-core-sdk"
import React, { useState, useEffect, useRef } from "react"
import { Timer, RefreshCw, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface TimedSprintElementProps {
  element: Extract<SlideElement, { type: "TIMED_SPRINT" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

const TimedSprintElement: React.FC<TimedSprintElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  const duration = element.data.duration || 10
  const [timeLeft, setTimeLeft] = useState(duration)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hasChecked, setHasChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [isTimeout, setIsTimeout] = useState(false)
  const [prevElementId, setPrevElementId] = useState(element.id)
  const [resetKey, setResetKey] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // React-recommended pattern to reset state when element changes (no ref access during render)
  if (element.id !== prevElementId) {
    setPrevElementId(element.id)
    setTimeLeft(duration)
    setSelectedId(null)
    setHasChecked(false)
    setIsCorrect(false)
    setIsTimeout(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsTimeout(true)
          setHasChecked(true)
          setIsCorrect(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    timerRef.current = interval

    return () => {
      clearInterval(interval)
    }
  }, [element.id, duration, resetKey])

  const handleSelectOption = (e: React.MouseEvent, optId: string) => {
    e.stopPropagation()
    if (hasChecked || isTimeout) return

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setSelectedId(optId)
    const isAnsCorrect = optId === element.data.correctId
    setIsCorrect(isAnsCorrect)
    setHasChecked(true)
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setTimeLeft(duration)
    setSelectedId(null)
    setHasChecked(false)
    setIsCorrect(false)
    setIsTimeout(false)
    setResetKey((prev) => prev + 1)
  }

  // Calculate percentage of time left for visual progress bar
  const percentLeft = (timeLeft / duration) * 100
  
  // Transition timer color from green -> orange -> red
  let timerColor = "#22c55e"
  if (percentLeft < 30) {
    timerColor = "#ef4444" // red
  } else if (percentLeft < 60) {
    timerColor = "#f59e0b" // orange
  }

  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: "#ffffff",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "10px",
        overflow: "hidden",
      }}
      onClick={handleClick}
    >
      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Timer style={{ height: "16px", width: "16px", color: timerColor }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Chạy đua thời gian
          </span>
        </div>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: timerColor }}>
          {timeLeft} giây
        </span>
      </div>

      {/* Progress Bar Timer */}
      <div style={{ width: "100%", height: "6px", backgroundColor: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
        <div
          style={{
            width: `${percentLeft}%`,
            height: "100%",
            backgroundColor: timerColor,
            borderRadius: "3px",
            transition: "width 1s linear, background-color 0.3s ease",
          }}
        />
      </div>

      {/* Question */}
      <h3 style={{ margin: "4px 0 0 0", fontSize: "0.9375rem", fontWeight: 600, color: "#1e293b", lineHeight: "1.4" }}>
        {element.data.question}
      </h3>

      {/* Options List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, justifyContent: "center" }}>
        {element.data.options.map((opt) => {
          const isSelected = selectedId === opt.id
          const isCorrectAnswer = opt.id === element.data.correctId
          
          const btnStyle: React.CSSProperties = {
            width: "100%",
            padding: "8px 12px",
            fontSize: "0.8125rem",
            fontWeight: 500,
            borderRadius: "8px",
            border: `1px solid ${
              hasChecked
                ? isCorrectAnswer
                  ? "#22c55e"
                  : isSelected
                  ? "#ef4444"
                  : "#cbd5e1"
                : "#cbd5e1"
            }`,
            textAlign: "left",
            backgroundColor: hasChecked
              ? isCorrectAnswer
                ? "#dcfce7"
                : isSelected
                ? "#fee2e2"
                : "#ffffff"
              : "#ffffff",
            color: hasChecked
              ? isCorrectAnswer
                ? "#166534"
                : isSelected
                ? "#991b1b"
                : "#334155"
              : "#334155",
            opacity: hasChecked && !isCorrectAnswer && !isSelected ? 0.6 : 1,
            cursor: hasChecked || isTimeout ? "default" : "pointer",
            transition: "all 0.15s ease",
          }

          return (
            <button
              key={opt.id}
              onClick={(e) => handleSelectOption(e, opt.id)}
              disabled={hasChecked || isTimeout}
              style={btnStyle}
              className={!(hasChecked || isTimeout) ? "hover:bg-slate-50 hover:border-slate-400" : ""}
            >
              {opt.content}
            </button>
          )
        })}
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
            backgroundColor: isTimeout ? "#ffedd5" : isCorrect ? "#dcfce7" : "#fee2e2",
            color: isTimeout ? "#c2410c" : isCorrect ? "#166534" : "#991b1b",
            border: isTimeout ? "1px solid #fed7aa" : isCorrect ? "1px solid #bbf7d0" : "1px solid #fecaca",
          }}
        >
          {isTimeout ? (
            <>
              <AlertCircle style={{ height: "14px", width: "14px", flexShrink: 0 }} />
              <span>Hết giờ mất rồi! Bạn chưa kịp trả lời.</span>
            </>
          ) : isCorrect ? (
            <>
              <CheckCircle2 style={{ height: "14px", width: "14px", flexShrink: 0 }} />
              <span>Tuyệt vời! Bạn trả lời chính xác và nhanh chóng.</span>
            </>
          ) : (
            <>
              <XCircle style={{ height: "14px", width: "14px", flexShrink: 0 }} />
              <span>Chưa chính xác rồi. Hãy thử lại để bứt phá nhé!</span>
            </>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "auto" }}>
        {hasChecked && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            style={{
              borderColor: "#475569",
              color: "#475569",
              fontSize: "0.75rem",
              height: "28px",
            }}
            className="hover:bg-slate-50 hover:text-slate-900"
          >
            <RefreshCw style={{ height: "12px", width: "12px", marginRight: "4px" }} />
            Chạy lại
          </Button>
        )}
      </div>
    </div>
  )
}

export default TimedSprintElement
