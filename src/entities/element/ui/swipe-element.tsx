import { type SlideElement } from "broker-core-sdk"
import React, { useState } from "react"
import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion"
import { HelpCircle, ThumbsUp, ThumbsDown, RefreshCw, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface SwipeElementProps {
  element: Extract<SlideElement, { type: "SWIPE" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

const SwipeElement: React.FC<SwipeElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  const [swipedDir, setSwipedDir] = useState<"left" | "right" | null>(null)
  const [hasChecked, setHasChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [prevElementId, setPrevElementId] = useState(element.id)

  // Reset state when element changes during render
  if (element.id !== prevElementId) {
    setPrevElementId(element.id)
    setSwipedDir(null)
    setHasChecked(false)
    setIsCorrect(false)
  }

  // Framer Motion drag values
  const x = useMotionValue(0)
  
  // Transform x position to rotate the card slightly as dragged
  const rotate = useTransform(x, [-150, 150], [-10, 10])
  
  // Transform x position to background opacity and overlay colors
  const leftColorOpacity = useTransform(x, [-100, 0], [1, 0])
  const rightColorOpacity = useTransform(x, [0, 100], [0, 1])

  const handleSwipeAction = (dir: "left" | "right") => {
    setSwipedDir(dir)
    const correctDir = element.data.correctDirection
    setIsCorrect(dir === correctDir)
    setHasChecked(true)
  }

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    // If swiped enough (threshold: 80px)
    if (info.offset.x < -80) {
      handleSwipeAction("left")
    } else if (info.offset.x > 80) {
      handleSwipeAction("right")
    }
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSwipedDir(null)
    setHasChecked(false)
    setIsCorrect(false)
    x.set(0) // Reset position
  }

  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: "#f8fafc",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "12px",
        overflow: "hidden",
      }}
      onClick={handleClick}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <HelpCircle style={{ height: "16px", width: "16px", color: "#f59e0b" }} />
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Trò chơi quẹt thẻ (Swipe)
        </span>
      </div>

      {/* Main card container */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100px",
        }}
      >
        {/* Visual Cue Backgrounds */}
        <motion.div
          style={{
            position: "absolute",
            left: 10,
            opacity: leftColorOpacity,
            color: "#ef4444",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.75rem",
            fontWeight: 700,
            pointerEvents: "none",
          }}
        >
          <ThumbsDown style={{ height: "24px", width: "24px" }} />
          <span>SAI</span>
        </motion.div>

        <motion.div
          style={{
            position: "absolute",
            right: 10,
            opacity: rightColorOpacity,
            color: "#22c55e",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.75rem",
            fontWeight: 700,
            pointerEvents: "none",
          }}
        >
          <ThumbsUp style={{ height: "24px", width: "24px" }} />
          <span>ĐÚNG</span>
        </motion.div>

        {/* Swipe Card */}
        <motion.div
          drag={!hasChecked ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.6}
          onDragEnd={handleDragEnd}
          style={{
            x,
            rotate,
            width: "80%",
            maxWidth: "240px",
            backgroundColor: swipedDir === "left" ? "#fef2f2" : swipedDir === "right" ? "#f0fdf4" : "#ffffff",
            border: swipedDir === "left" ? "2px solid #ef4444" : swipedDir === "right" ? "2px solid #22c55e" : "1px solid #cbd5e1",
            borderRadius: "10px",
            padding: "16px",
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
            cursor: !hasChecked ? "grab" : "default",
            zIndex: 10,
            userSelect: "none",
            touchAction: "none",
          }}
          whileDrag={{ scale: 1.05 }}
        >
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#1e293b", display: "block" }}>
            {element.data.statement}
          </span>
          <div style={{ marginTop: "12px", fontSize: "0.6875rem", color: "#94a3b8", fontWeight: 500 }}>
            {hasChecked ? (
              <span style={{ fontWeight: 700, color: isCorrect ? "#166534" : "#991b1b" }}>
                Đã trả lời: {swipedDir === "left" ? "SAI ⬅️" : "ĐÚNG ➡️"}
              </span>
            ) : (
              "Kéo thả sang TRÁI (Sai) hoặc PHẢI (Đúng)"
            )}
          </div>
        </motion.div>
      </div>

      {/* Feedback banner */}
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
              <CheckCircle2 style={{ height: "14px", width: "14px", flexShrink: 0 }} />
              <span>Chính xác rồi! Tuyệt vời!</span>
            </>
          ) : (
            <>
              <XCircle style={{ height: "14px", width: "14px", flexShrink: 0 }} />
              <span>Rất tiếc, chưa đúng. Thử lại nhé!</span>
            </>
          )}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
        {!hasChecked ? (
          <div style={{ display: "flex", gap: "6px", flex: 1 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleSwipeAction("left")
              }}
              style={{ flex: 1, borderColor: "#ef4444", color: "#ef4444", fontSize: "0.75rem", height: "28px" }}
              className="hover:bg-red-50"
            >
              Sai ⬅️
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleSwipeAction("right")
              }}
              style={{ flex: 1, borderColor: "#22c55e", color: "#22c55e", fontSize: "0.75rem", height: "28px" }}
              className="hover:bg-green-50"
            >
              Đúng ➡️
            </Button>
          </div>
        ) : (
          <>
            <div style={{ flex: 1 }} />
            {hasChecked && !isCorrect && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                style={{ borderColor: "#ef4444", color: "#ef4444", fontSize: "0.75rem", height: "28px" }}
              >
                <RefreshCw style={{ height: "12px", width: "12px", marginRight: "4px" }} />
                Chơi lại
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SwipeElement
