import { type SlideElement } from "broker-core-sdk"
import React, { useState } from "react"
import { GripVertical, CheckCircle2, XCircle, RefreshCw } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface SortingElementProps {
  element: Extract<SlideElement, { type: "SORTING" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
  isInteractive?: boolean
}

const SortingElement: React.FC<SortingElementProps> = ({
  element,
  baseStyle,
  handleClick,
  isInteractive = true,
}) => {
  // Local state to manage the order of items for interactive play
  const [items, setItems] = useState(element.data.items)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [prevElementId, setPrevElementId] = useState(element.id)
  const [prevItems, setPrevItems] = useState(element.data.items)

  // Checking states
  const [hasChecked, setHasChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Reset state when element changes or sidebar items change in design mode
  if (
    element.id !== prevElementId ||
    (!isInteractive &&
      JSON.stringify(element.data.items) !== JSON.stringify(prevItems))
  ) {
    setPrevElementId(element.id)
    setPrevItems(element.data.items)
    setItems(element.data.items)
    setHasChecked(false)
    setIsCorrect(false)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isInteractive) return
    setDraggedIndex(index)
    setHasChecked(false) // Reset checking status on new drag
    // For HTML5 Drag and Drop transfer
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    // Reorder items in state dynamically
    const reorderedItems = [...items]
    const [draggedItem] = reorderedItems.splice(draggedIndex, 1)
    reorderedItems.splice(index, 0, draggedItem)

    setDraggedIndex(index)
    setItems(reorderedItems)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const handleCheckAnswer = (e: React.MouseEvent) => {
    e.stopPropagation() // Avoid triggering parent onClick actions
    const correctOrder = element.data.correctOrder
    const currentOrder = items.map((item) => item.id)

    // Check if every item's ID is in the correct position
    const correct =
      currentOrder.length === correctOrder.length &&
      currentOrder.every((id, idx) => id === correctOrder[idx])
    setIsCorrect(correct)
    setHasChecked(true)
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setItems(element.data.items)
    setHasChecked(false)
    setIsCorrect(false)
  }

  // Determine border color and styling based on check results
  let containerBorder = "1px solid #e4e4e7"
  let containerBg = "#f4f4f5"
  if (hasChecked) {
    if (isCorrect) {
      containerBorder = "2px solid #22c55e" // green-500
      containerBg = "#f0fdf4" // green-50
    } else {
      containerBorder = "2px solid #ef4444" // red-500
      containerBg = "#fef2f2" // red-50
    }
  }

  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: containerBg,
        padding: "20px",
        borderRadius: "12px",
        border: containerBorder,
        boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        justifyContent: "flex-start",
        transition: "all 0.3s ease",
      }}
      onClick={handleClick}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
        }}
      >
        {items.map((item, index) => {
          const isDragging = draggedIndex === index
          return (
            <div
              key={item.id}
              draggable={isInteractive}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                padding: "12px 16px",
                backgroundColor: isDragging ? "#fafafa" : "#fff",
                border: isDragging ? "2px dashed #cbd5e1" : "1px solid #e4e4e7",
                borderRadius: "8px",
                boxShadow: isDragging
                  ? "none"
                  : "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
                cursor: !isInteractive
                  ? "default"
                  : isDragging
                    ? "grabbing"
                    : "grab",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "transform 0.15s ease, opacity 0.15s ease",
                opacity: isDragging ? 0.5 : 1,
              }}
              className={`group ${
                isInteractive ? "hover:border-zinc-400 hover:shadow-md" : ""
              }`}
            >
              {/* Grip Icon */}
              <GripVertical
                style={{
                  height: "16px",
                  width: "16px",
                  color: "#a1a1aa",
                  flexShrink: 0,
                }}
              />

              {/* Index Circle */}
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: isDragging ? "#e4e4e7" : "#f4f4f5",
                  color: "#71717a",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>

              {/* Item Content */}
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#18181b",
                  flex: 1,
                  userSelect: "none",
                }}
              >
                {item.content}
              </span>
            </div>
          )
        })}
      </div>

      {/* Action Buttons and Status Alert */}
      <div
        style={{
          marginTop: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {hasChecked && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              animation: "pulse 2s infinite",
              backgroundColor: isCorrect ? "#dcfce7" : "#fee2e2",
              color: isCorrect ? "#15803d" : "#b91c1c",
              border: isCorrect ? "1px solid #bbf7d0" : "1px solid #fecaca",
            }}
          >
            {isCorrect ? (
              <>
                <CheckCircle2
                  style={{ height: "18px", width: "18px", flexShrink: 0 }}
                />
                <span>
                  Tuyệt vời! Bạn đã sắp xếp đúng thứ tự trình tự thời gian.
                </span>
              </>
            ) : (
              <>
                <XCircle
                  style={{ height: "18px", width: "18px", flexShrink: 0 }}
                />
                <span>
                  Chưa đúng rồi! Bạn hãy kéo thả để hoán đổi vị trí và thử lại
                  nhé.
                </span>
              </>
            )}
          </div>
        )}

        {isInteractive && (
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
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
                className="hover:bg-red-50"
              >
                <RefreshCw
                  style={{ height: "14px", width: "14px", marginRight: "4px" }}
                />
                Làm lại
              </Button>
            )}

            <Button
              variant={hasChecked && isCorrect ? "secondary" : "default"}
              size="sm"
              onClick={handleCheckAnswer}
              disabled={hasChecked && isCorrect}
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                backgroundColor:
                  hasChecked && isCorrect ? "#22c55e" : undefined,
                color: hasChecked && isCorrect ? "#fff" : undefined,
              }}
            >
              {hasChecked && isCorrect ? "Đã chính xác" : "Kiểm tra đáp án"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SortingElement
