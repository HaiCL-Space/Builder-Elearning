import { type SlideElement } from "broker-core-sdk"
import React, { useState } from "react"
import {
  Award,
  AlertTriangle,
  RefreshCw,
  GitCommit,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/shared/ui/button"

interface BranchingElementProps {
  element: Extract<SlideElement, { type: "BRANCHING" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent, finalNodeId?: string) => void
}

const BranchingElement: React.FC<BranchingElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  const { startNodeId = "", nodes = [] } = element.data

  const [currentNodeId, setCurrentNodeId] = useState<string>(startNodeId)
  const [hasChecked, setHasChecked] = useState(false)
  const [prevElementId, setPrevElementId] = useState(element.id)

  // Reset state when element changes
  if (element.id !== prevElementId) {
    setPrevElementId(element.id)
    setCurrentNodeId(startNodeId)
    setHasChecked(false)
  }

  const currentNode = nodes.find((n) => n.id === currentNodeId) || nodes[0]

  const handleChoiceSelect = (nextNodeId: string) => {
    if (hasChecked) return
    setCurrentNodeId(nextNodeId)
  }

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation()
    setHasChecked(true)
    // Pass finalNodeId as answer to evaluate globally
    handleClick(e, currentNode?.id)
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentNodeId(startNodeId)
    setHasChecked(false)
  }

  if (!currentNode) {
    return (
      <div
        style={{
          ...baseStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #cbd5e1",
          borderRadius: "12px",
          color: "#94a3b8",
          fontSize: "0.75rem",
        }}
      >
        Kịch bản chưa được cấu hình
      </div>
    )
  }

  const isSuccess = !!currentNode.isSuccessEnd
  const isFailure = !!currentNode.isFailureEnd
  const isEndNode = isSuccess || isFailure

  // Dynamic style based on node state
  let nodeBorder = "1px solid rgba(226, 232, 240, 0.8)"
  let nodeBg = "#ffffff"
  if (hasChecked) {
    nodeBg = isSuccess ? "#f0fdf4" : "#fef2f2"
    nodeBorder = isSuccess ? "2px solid #10b981" : "2px solid #ef4444"
  } else if (isSuccess) {
    nodeBg = "rgba(240, 253, 244, 0.6)"
    nodeBorder = "1.5px dashed #34d399"
  } else if (isFailure) {
    nodeBg = "rgba(254, 242, 242, 0.6)"
    nodeBorder = "1.5px dashed #f87171"
  }

  return (
    <div
      style={{
        ...baseStyle,
        backgroundColor: nodeBg,
        padding: "16px",
        borderRadius: "16px",
        border: nodeBorder,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "10px",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
      onClick={(e) => handleClick(e, currentNode?.id)}
    >
      {/* Title / Node context */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <GitCommit
          style={{ height: "16px", width: "16px", color: "#8b5cf6" }}
        />
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#6d28d9",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {currentNode.title || "Quyết định Tình huống"}
        </span>
      </div>

      {/* Main content body / Narrative */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "10px 16px",
          gap: "10px",
          minHeight: 0,
        }}
      >
        {isSuccess && (
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              padding: "10px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "bounce 2s infinite",
            }}
          >
            <Award
              style={{ height: "24px", width: "24px", color: "#10b981" }}
            />
          </div>
        )}

        {isFailure && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              padding: "10px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle
              style={{ height: "24px", width: "24px", color: "#ef4444" }}
            />
          </div>
        )}

        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#1e293b",
            lineHeight: "1.5",
            maxWidth: "400px",
            overflowY: "auto",
          }}
        >
          {currentNode.content}
        </p>
      </div>

      {/* Choice buttons list */}
      {!isEndNode && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            width: "100%",
            maxWidth: "380px",
            margin: "0 auto",
          }}
        >
          {currentNode.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={(e) => {
                e.stopPropagation()
                handleChoiceSelect(choice.nextNodeId)
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                color: "#334155",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
                textAlign: "left",
                outline: "none",
              }}
              className="hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
            >
              <span>{choice.text}</span>
              <ChevronRight
                style={{ height: "12px", width: "12px", opacity: 0.6 }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Node End Indicators / Alerts */}
      {isEndNode && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            fontSize: "0.75rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            maxWidth: "380px",
            margin: "0 auto",
            backgroundColor: isSuccess ? "#dcfce7" : "#fee2e2",
            color: isSuccess ? "#15803d" : "#b91c1c",
            border: isSuccess ? "1.5px solid #bbf7d0" : "1.5px solid #fecaca",
          }}
        >
          {isSuccess
            ? "🎉 Bạn đã đưa ra chuỗi quyết định xuất sắc!"
            : "❌ Thất bại rồi! Quyết định này dẫn tới kết quả không mong muốn."}
        </div>
      )}

      {/* Footer Controls */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
          marginTop: "auto",
          width: "100%",
        }}
      >
        {(isEndNode || hasChecked) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            style={{
              borderColor: "#8b5cf6",
              color: "#8b5cf6",
              fontSize: "0.7rem",
              padding: "4px 8px",
              height: "28px",
            }}
          >
            <RefreshCw
              style={{ height: "10px", width: "10px", marginRight: "4px" }}
            />
            Chơi lại
          </Button>
        )}

        {isEndNode && !hasChecked && (
          <Button
            variant="default"
            size="sm"
            onClick={handleCheck}
            style={{
              fontSize: "0.7rem",
              padding: "4px 10px",
              height: "28px",
              backgroundColor: "#8b5cf6",
            }}
          >
            Nộp quyết định
          </Button>
        )}

        {hasChecked && (
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: isSuccess ? "#10b981" : "#ef4444",
              display: "flex",
              alignItems: "center",
              padding: "0 8px",
            }}
          >
            {isSuccess ? "✓ Kịch bản hoàn thành" : "✗ Thất bại"}
          </div>
        )}
      </div>
    </div>
  )
}

export default BranchingElement
