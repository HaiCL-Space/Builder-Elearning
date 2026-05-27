import { type SlideElement } from "broker-core-sdk"
import React, { useState, useCallback } from "react"
import { CheckCircle2, XCircle, RefreshCw, Compass } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface CrosswordElementProps {
  element: Extract<SlideElement, { type: "CROSSWORD" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent, answer?: Record<string, string>) => void
}

const CrosswordElement: React.FC<CrosswordElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  const {
    gridRows = 5,
    gridCols = 5,
    clues = [],
    caseSensitive = false,
  } = element.data

  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [hasChecked, setHasChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [activeCell, setActiveCell] = useState<{
    row: number
    col: number
  } | null>(null)
  const [activeClueId, setActiveClueId] = useState<string | null>(null)

  const [prevElementId, setPrevElementId] = useState(element.id)

  const focusCellInput = useCallback((row: number, col: number) => {
    const cellKey = `${row}-${col}`
    const gridEl = document.getElementById(`crossword-grid-${element.id}`)
    const inputEl = gridEl?.querySelector(
      `input[data-cell="${cellKey}"]`
    ) as HTMLInputElement | null
    inputEl?.focus()
  }, [element.id])

  // Reset state when element changes
  if (element.id !== prevElementId) {
    setPrevElementId(element.id)
    setInputs({})
    setHasChecked(false)
    setIsCorrect(false)
    setActiveCell(null)
    setActiveClueId(null)
  }

  // Populate answer state with letter inputs mapped by coordinates
  // Grid layout helper: check which cell belongs to which clues
  const getCellClues = (row: number, col: number) => {
    return clues.filter((clue) => {
      const len = clue.answer.length
      if (clue.direction === "across") {
        return row === clue.row && col >= clue.col && col < clue.col + len
      } else {
        return col === clue.col && row >= clue.row && row < clue.row + len
      }
    })
  }

  const getCellActiveIndex = (row: number, col: number) => {
    const activeClue = clues.find((c) => c.id === activeClueId)
    if (!activeClue) return -1
    if (activeClue.direction === "across") {
      if (
        row === activeClue.row &&
        col >= activeClue.col &&
        col < activeClue.col + activeClue.answer.length
      ) {
        return col - activeClue.col
      }
    } else {
      if (
        col === activeClue.col &&
        row === activeClue.row &&
        row < activeClue.row + activeClue.answer.length
      ) {
        return row - activeClue.row
      }
    }
    return -1
  }

  // Build the cell letter validation state
  // We represent grid state: cells that are active in any clue
  const isPlayableCell = (row: number, col: number) => {
    return getCellClues(row, col).length > 0
  }

  // Find start clue numbers for cells
  const getCellClueNumber = (row: number, col: number) => {
    const startingClue = clues.find(
      (clue) => clue.row === row && clue.col === col
    )
    return startingClue ? startingClue.number : null
  }

  // Handle typing a character inside a cell
  const handleCellChange = (row: number, col: number, char: string) => {
    if (hasChecked && isCorrect) return

    const sanitizedChar = char.slice(-1).toUpperCase()
    const cellKey = `${row}-${col}`

    setInputs((prev) => ({
      ...prev,
      [cellKey]: sanitizedChar,
    }))

    // Shift focus automatically in active direction
    if (sanitizedChar && activeClueId) {
      const activeClue = clues.find((c) => c.id === activeClueId)
      if (activeClue) {
        let nextRow = row
        let nextCol = col
        if (activeClue.direction === "across") {
          nextCol = col + 1
        } else {
          nextRow = row + 1
        }

        const activeClueLen = activeClue.answer.length

        // Ensure the next cell is within the active clue
        const cellIdx =
          activeClue.direction === "across"
            ? nextCol - activeClue.col
            : nextRow - activeClue.row

        if (
          cellIdx >= 0 &&
          cellIdx < activeClueLen &&
          isPlayableCell(nextRow, nextCol)
        ) {
          setTimeout(() => {
            focusCellInput(nextRow, nextCol)
            setActiveCell({ row: nextRow, col: nextCol })
          }, 10)
        }
      }
    }
  }

  // Handle Backspace for focus back-shifting
  const handleKeyDown = (
    row: number,
    col: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      const cellKey = `${row}-${col}`
      // If cell is already empty, move focus back
      if (!inputs[cellKey] && activeClueId) {
        const activeClue = clues.find((c) => c.id === activeClueId)
        if (activeClue) {
          let prevRow = row
          let prevCol = col
          if (activeClue.direction === "across") {
            prevCol = col - 1
          } else {
            prevRow = row - 1
          }

          const prevKey = `${prevRow}-${prevCol}`
          const cellIdx =
            activeClue.direction === "across"
              ? prevCol - activeClue.col
              : prevRow - activeClue.row

          if (cellIdx >= 0 && isPlayableCell(prevRow, prevCol)) {
            e.preventDefault()
            focusCellInput(prevRow, prevCol)
            setActiveCell({ row: prevRow, col: prevCol })
            setInputs((prev) => ({
              ...prev,
              [prevKey]: "",
            }))
          }
        }
      }
    }
  }

  const handleCellFocus = (row: number, col: number) => {
    setActiveCell({ row, col })
    const cellClues = getCellClues(row, col)
    if (cellClues.length > 0) {
      // If cell belongs to current active clue, keep it. Otherwise, pick the first one
      const keepsActive = cellClues.some((c) => c.id === activeClueId)
      if (!keepsActive) {
        setActiveClueId(cellClues[0].id)
      }
    }
  }

  // Build the answer dictionary mapped by clueId
  const getAnswersByClue = () => {
    const answers: Record<string, string> = {}
    clues.forEach((clue) => {
      let clueAnswer = ""
      for (let i = 0; i < clue.answer.length; i++) {
        const r = clue.direction === "across" ? clue.row : clue.row + i
        const c = clue.direction === "across" ? clue.col + i : clue.col
        clueAnswer += inputs[`${r}-${c}`] || " "
      }
      answers[clue.id] = clueAnswer
    })
    return answers
  }

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation()
    const currentClueAnswers = getAnswersByClue()

    // Call gameEngine validation in Core SDK (which validates exactly like this)
    const allCorrect = clues.every((clue) => {
      const uAns = (currentClueAnswers[clue.id] || "").trim()
      const cAns = clue.answer.trim()
      return caseSensitive
        ? uAns === cAns
        : uAns.toLowerCase() === cAns.toLowerCase()
    })

    setIsCorrect(allCorrect)
    setHasChecked(true)

    // Trigger action evaluator globally
    handleClick(e, currentClueAnswers)
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation()
    setInputs({})
    setHasChecked(false)
    setIsCorrect(false)
    setActiveCell(null)
    setActiveClueId(null)
  }

  const handleClueClick = (clueId: string) => {
    const clue = clues.find((c) => c.id === clueId)
    if (clue) {
      setActiveClueId(clueId)
      setTimeout(() => {
        focusCellInput(clue.row, clue.col)
        setActiveCell({ row: clue.row, col: clue.col })
      }, 10)
    }
  }

  // Grid styling helpers
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
      }}
      onClick={(e) => handleClick(e, getAnswersByClue())}
    >
      {/* Title */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          gap: "6px",
        }}
      >
        <Compass style={{ height: "16px", width: "16px", color: "#6366f1" }} />
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#4f46e5",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Giải ô chữ bí ẩn
        </span>
      </div>

      <div style={{ display: "flex", gap: "16px", flex: 1, minHeight: 0 }}>
        {/* Left column: Crossword Grid */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <div
            id={`crossword-grid-${element.id}`}
            style={{
              display: "grid",
              gridTemplateRows: `repeat(${gridRows}, 1fr)`,
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gap: "4px",
              padding: "8px",
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
              width: "100%",
              maxWidth: "280px",
              aspectRatio: "1/1",
            }}
          >
            {Array.from({ length: gridRows }).map((_, r) => {
              return Array.from({ length: gridCols }).map((__, c) => {
                const playable = isPlayableCell(r, c)
                const clueNumber = getCellClueNumber(r, c)
                const cellKey = `${r}-${c}`
                const value = inputs[cellKey] || ""

                const isFocused = activeCell?.row === r && activeCell?.col === c
                const activeIndex = getCellActiveIndex(r, c)
                const isPartActiveClue = activeIndex !== -1

                if (!playable) {
                  return (
                    <div
                      key={cellKey}
                      style={{
                        backgroundColor: "#1e293b",
                        borderRadius: "6px",
                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
                      }}
                    />
                  )
                }

                // Check cell correct/incofarrect on verification
                let cellBorder = "1px solid #cbd5e1"
                let cellBg = "#ffffff"
                if (isFocused) {
                  cellBg = "#e0e7ff"
                  cellBorder = "2px solid #6366f1"
                } else if (isPartActiveClue) {
                  cellBg = "#f5f3ff"
                  cellBorder = "1px solid #c084fc"
                }

                if (hasChecked) {
                  // Find all clues for this cell, check if all of them are answered correctly
                  const cellClues = getCellClues(r, c)
                  const isCellCorrect = cellClues.every((clue) => {
                    const idx =
                      clue.direction === "across" ? c - clue.col : r - clue.row
                    const userLetter = value.trim()
                    const correctLetter = (clue.answer[idx] || "").trim()
                    return caseSensitive
                      ? userLetter === correctLetter
                      : userLetter.toLowerCase() === correctLetter.toLowerCase()
                  })
                  cellBg = isCellCorrect ? "#dcfce7" : "#fee2e2"
                  cellBorder = isCellCorrect
                    ? "1.5px solid #10b981"
                    : "1.5px solid #f87171"
                }

                return (
                  <div
                    key={cellKey}
                    style={{
                      position: "relative",
                      borderRadius: "6px",
                      backgroundColor: cellBg,
                      border: cellBorder,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s ease",
                      overflow: "hidden",
                    }}
                  >
                    {/* Clue Number Indicator */}
                    {clueNumber !== null && (
                      <span
                        style={{
                          position: "absolute",
                          top: "2px",
                          left: "3px",
                          fontSize: "8px",
                          fontWeight: 700,
                          color: "#64748b",
                          pointerEvents: "none",
                          lineHeight: 1,
                        }}
                      >
                        {clueNumber}
                      </span>
                    )}

                    {/* Cell Input */}
                    <input
                      data-cell={cellKey}
                      type="text"
                      maxLength={1}
                      value={value}
                      disabled={hasChecked && isCorrect}
                      onChange={(e) => handleCellChange(r, c, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(r, c, e)}
                      onFocus={() => handleCellFocus(r, c)}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        outline: "none",
                        backgroundColor: "transparent",
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "#0f172a",
                        textTransform: "uppercase",
                        padding: "4px 0 0 0",
                        caretColor: "#4f46e5",
                      }}
                    />
                  </div>
                )
              })
            })}
          </div>
        </div>

        {/* Right column: Clue List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "170px",
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
            CÁC MANH MỐI GỢI Ý
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              overflowY: "auto",
              flex: 1,
              paddingRight: "4px",
            }}
          >
            {clues.map((clue) => {
              const isActive = clue.id === activeClueId
              return (
                <button
                  key={clue.id}
                  onClick={() => handleClueClick(clue.id)}
                  style={{
                    textAlign: "left",
                    padding: "6px 8px",
                    borderRadius: "8px",
                    border: isActive
                      ? "1px solid #818cf8"
                      : "1px solid #e2e8f0",
                    backgroundColor: isActive ? "#e0e7ff" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    outline: "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 800,
                        color: isActive ? "#4f46e5" : "#64748b",
                        backgroundColor: isActive ? "#ffffff" : "#f1f5f9",
                        padding: "1px 4px",
                        borderRadius: "4px",
                        lineHeight: 1,
                      }}
                    >
                      {clue.number}
                    </span>
                    <span
                      style={{
                        fontSize: "8px",
                        fontWeight: 600,
                        color: isActive ? "#6366f1" : "#94a3b8",
                        textTransform: "uppercase",
                      }}
                    >
                      {clue.direction === "across" ? "Ngang" : "Dọc"}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 500,
                      color: isActive ? "#1e1b4b" : "#334155",
                      lineHeight: "1.2",
                      wordBreak: "break-word",
                    }}
                  >
                    {clue.question}
                  </span>
                </button>
              )
            })}
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
              <span>Tuyệt vời! Giải ô chữ hoàn toàn chính xác.</span>
            </>
          ) : (
            <>
              <XCircle
                style={{ height: "14px", width: "14px", flexShrink: 0 }}
              />
              <span>Chưa khớp rồi. Hãy soát lại các ô chữ nhé!</span>
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
              borderColor: "#ef4444",
              color: "#ef4444",
              fontSize: "0.7rem",
              padding: "4px 8px",
              height: "28px",
            }}
          >
            <RefreshCw
              style={{ height: "10px", width: "10px", marginRight: "4px" }}
            />
            Giải lại
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
          {hasChecked && isCorrect ? "Đã giải xong" : "Nộp đáp án"}
        </Button>
      </div>
    </div>
  )
}

export default CrosswordElement
