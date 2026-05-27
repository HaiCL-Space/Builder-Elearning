import { type SlideElement } from "broker-core-sdk"
import React, { useState } from "react"
import { CheckCircle2, XCircle, RefreshCw, Image, Tag, X } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface LabelImageElementProps {
  element: Extract<SlideElement, { type: "LABEL_IMAGE" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent, answer?: Record<string, string>) => void
  isInteractive?: boolean
}

const LabelImageElement: React.FC<LabelImageElementProps> = ({
  element,
  baseStyle,
  handleClick,
  isInteractive = true,
}) => {
  const { imageUri = "", zones = [], labels = [] } = element.data

  // State maps: zoneId -> labelId
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null)
  const [hasChecked, setHasChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [prevElementId, setPrevElementId] = useState(element.id)

  // Reset state when element changes
  if (element.id !== prevElementId) {
    setPrevElementId(element.id)
    setAssignments({})
    setSelectedLabelId(null)
    setHasChecked(false)
    setIsCorrect(false)
  }

  // Get currently unassigned labels
  const assignedLabelIds = Object.values(assignments)
  const availableLabels = labels.filter(
    (lbl) => !assignedLabelIds.includes(lbl.id)
  )

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, labelId: string) => {
    if (hasChecked && isCorrect) return
    e.dataTransfer.setData("text/plain", labelId)
    setSelectedLabelId(labelId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault()
    if (hasChecked && isCorrect) return
    const labelId = e.dataTransfer.getData("text/plain") || selectedLabelId
    if (labelId) {
      assignLabel(zoneId, labelId)
    }
  }

  // Click-to-assign fallback handlers
  const handleLabelClick = (e: React.MouseEvent, labelId: string) => {
    e.stopPropagation()
    if (hasChecked && isCorrect) return
    if (selectedLabelId === labelId) {
      setSelectedLabelId(null)
    } else {
      setSelectedLabelId(labelId)
    }
  }

  const handleZoneClick = (e: React.MouseEvent, zoneId: string) => {
    e.stopPropagation()
    if (hasChecked && isCorrect) return

    // If click on a zone while a label is selected, assign it
    if (selectedLabelId) {
      assignLabel(zoneId, selectedLabelId)
      setSelectedLabelId(null)
    } else if (assignments[zoneId]) {
      // If click on a zone with already assigned label, remove it
      removeAssignment(zoneId)
    }
  }

  const assignLabel = (zoneId: string, labelId: string) => {
    setAssignments((prev) => {
      const next = { ...prev }
      // Remove this label from any other zone it might be assigned to
      Object.keys(next).forEach((zId) => {
        if (next[zId] === labelId) {
          delete next[zId]
        }
      })
      next[zoneId] = labelId
      return next
    })
    setHasChecked(false)
  }

  const removeAssignment = (zoneId: string) => {
    setAssignments((prev) => {
      const next = { ...prev }
      delete next[zoneId]
      return next
    })
    setHasChecked(false)
  }

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Check if all zones are assigned
    if (Object.keys(assignments).length < zones.length) {
      handleClick(e, assignments) // Propagate to let global alerts warn
      return
    }

    // Call gameEngine validator (conforms to: assignments[zone.id] === zone.correctLabelId)
    const allCorrect = zones.every((zone) => {
      return assignments[zone.id] === zone.correctLabelId
    })

    setIsCorrect(allCorrect)
    setHasChecked(true)

    // Trigger action evaluator globally
    handleClick(e, assignments)
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAssignments({})
    setSelectedLabelId(null)
    setHasChecked(false)
    setIsCorrect(false)
  }

  let statusBorder = "1px solid rgba(226, 232, 240, 0.8)"
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
        padding: "16px",
        borderRadius: "16px",
        border: statusBorder,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: "12px",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
      onClick={(e) => handleClick(e, assignments)}
    >
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Tag style={{ height: "16px", width: "16px", color: "#ec4899" }} />
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#db2777",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Kéo thả nhãn ảnh
        </span>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0, gap: "16px" }}>
        {/* Left pane: Droppable Image Canvas */}
        <div
          style={{
            flex: 1.3,
            position: "relative",
            borderRadius: "12px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#f8fafc",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          {imageUri ? (
            <img
              src={imageUri}
              alt="Label Background"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                color: "#94a3b8",
              }}
            >
              <Image style={{ height: "32px", width: "32px", opacity: 0.5 }} />
              <span style={{ fontSize: "0.6875rem" }}>Chưa có hình nền</span>
            </div>
          )}

          {/* Interactive Absolute Placed Drop Zones */}
          {isInteractive &&
            zones.map((zone) => {
              const w = zone.xMax - zone.xMin
              const h = zone.yMax - zone.yMin

              const assignedLabelId = assignments[zone.id]
              const assignedLabel = labels.find((l) => l.id === assignedLabelId)

              let zoneBorder = "2px dashed #6366f1"
              let zoneBg = "rgba(99, 102, 241, 0.1)"

              if (assignedLabel) {
                zoneBorder = "2px solid #8b5cf6"
                zoneBg = "rgba(139, 92, 246, 0.15)"
              }

              if (hasChecked) {
                const correct = assignedLabelId === zone.correctLabelId
                zoneBorder = correct
                  ? "2.5px solid #10b981"
                  : "2.5px solid #ef4444"
                zoneBg = correct
                  ? "rgba(16, 185, 129, 0.12)"
                  : "rgba(239, 68, 68, 0.12)"
              }

              return (
                <div
                  key={zone.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, zone.id)}
                  onClick={(e) => handleZoneClick(e, zone.id)}
                  style={{
                    position: "absolute",
                    left: `${zone.xMin}%`,
                    top: `${zone.yMin}%`,
                    width: `${w}%`,
                    height: `${h}%`,
                    border: zoneBorder,
                    backgroundColor: zoneBg,
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxSizing: "border-box",
                    transition: "all 0.15s ease",
                    zIndex: 20,
                  }}
                >
                  {assignedLabel ? (
                    <div
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        backgroundColor: "#8b5cf6",
                        color: "#ffffff",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        pointerEvents: "none",
                      }}
                    >
                      <span>{assignedLabel.content}</span>
                      {!hasChecked && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            removeAssignment(zone.id)
                          }}
                          style={{
                            cursor: "pointer",
                            color: "rgba(255,255,255,0.7)",
                          }}
                        >
                          <X style={{ height: "8px", width: "8px" }} />
                        </span>
                      )}
                    </div>
                  ) : (
                    <span
                      style={{
                        fontSize: "8px",
                        fontWeight: 700,
                        color: "#6366f1",
                        textTransform: "uppercase",
                        opacity: 0.8,
                        pointerEvents: "none",
                      }}
                    >
                      Thả vào đây
                    </span>
                  )}
                </div>
              )
            })}
        </div>

        {/* Right pane: Label Catalog */}
        <div
          style={{
            flex: 0.8,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            gap: "6px",
          }}
        >
          <span
            style={{
              fontSize: "9px",
              fontWeight: 700,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            DANH SÁCH NHÃN DÁN
          </span>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              alignContent: "flex-start",
              gap: "6px",
              overflowY: "auto",
              flex: 1,
              padding: "4px",
              backgroundColor: "#f8fafc",
              borderRadius: "10px",
              border: "1px dashed #e2e8f0",
            }}
          >
            {availableLabels.length === 0 ? (
              <div
                style={{
                  fontSize: "9px",
                  color: "#94a3b8",
                  textAlign: "center",
                  width: "100%",
                  padding: "16px 0",
                  fontStyle: "italic",
                }}
              >
                Đã dán tất cả nhãn
              </div>
            ) : (
              availableLabels.map((lbl) => {
                const isSelected = selectedLabelId === lbl.id
                return (
                  <div
                    key={lbl.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lbl.id)}
                    onClick={(e) => handleLabelClick(e, lbl.id)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: isSelected
                        ? "1.5px solid #ec4899"
                        : "1px solid #e2e8f0",
                      backgroundColor: isSelected ? "#fdf2f8" : "#ffffff",
                      color: isSelected ? "#db2777" : "#475569",
                      fontSize: "9px",
                      fontWeight: 700,
                      cursor: "grab",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      transition: "all 0.15s ease",
                      userSelect: "none",
                    }}
                    className="hover:scale-[1.03]"
                  >
                    {lbl.content}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {hasChecked && (
        <div
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            fontSize: "0.75rem",
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
                style={{ height: "14px", width: "14px", flexShrink: 0 }}
              />
              <span>Chính xác! Bạn dán toàn bộ nhãn ảnh hoàn hảo!</span>
            </>
          ) : (
            <>
              <XCircle
                style={{ height: "14px", width: "14px", flexShrink: 0 }}
              />
              <span>
                Chưa hoàn toàn đúng. Hãy kiểm tra và điều chỉnh lại nhé!
              </span>
            </>
          )}
        </div>
      )}

      {/* Footer Controls */}
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
              borderColor: "#ec4899",
              color: "#ec4899",
              fontSize: "0.7rem",
              padding: "4px 8px",
              height: "28px",
            }}
          >
            <RefreshCw
              style={{ height: "10px", width: "10px", marginRight: "4px" }}
            />
            Xếp lại
          </Button>
        )}
        <Button
          variant={hasChecked && isCorrect ? "secondary" : "default"}
          size="sm"
          onClick={handleCheck}
          disabled={hasChecked && isCorrect}
          style={{
            fontSize: "0.7rem",
            padding: "4px 10px",
            height: "28px",
            backgroundColor: hasChecked && isCorrect ? "#10b981" : undefined,
            color: hasChecked && isCorrect ? "#ffffff" : undefined,
          }}
        >
          {hasChecked && isCorrect ? "Đã dán xong" : "Kiểm tra nhãn"}
        </Button>
      </div>
    </div>
  )
}

export default LabelImageElement
