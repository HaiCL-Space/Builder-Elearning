import { type SlideElement } from "broker-core-sdk"
import React, { useState } from "react"
import { Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/shared/ui/button"

interface MemoryCardElementProps {
  element: Extract<SlideElement, { type: "MEMORY_CARD" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

interface CardItem {
  uniqueId: string
  id: string
  value: string
  isFlipped: boolean
  isMatched: boolean
}

const getInitialCards = (rawCards: Array<{ id: string; value: string }>): CardItem[] => {
  const values = rawCards.map(c => c.value)
  const uniqueValues = Array.from(new Set(values))
  
  let listToUse = [...rawCards]
  if (uniqueValues.length === rawCards.length) {
    listToUse = [
      ...rawCards.map(c => ({ ...c, id: `${c.id}-a` })),
      ...rawCards.map(c => ({ ...c, id: `${c.id}-b` }))
    ]
  }

  const formatted: CardItem[] = listToUse.map((c, idx) => ({
    uniqueId: `${c.id}-${idx}`,
    id: c.id,
    value: c.value,
    isFlipped: false,
    isMatched: false,
  }))

  return [...formatted].sort(() => Math.random() - 0.5)
}

const MemoryCardElement: React.FC<MemoryCardElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  const [cards, setCards] = useState<CardItem[]>(() => getInitialCards(element.data.cards || []))
  const [selectedIds, setSelectedIds] = useState<string[]>([]) // Track uniqueIds of currently flipped cards
  const [attempts, setAttempts] = useState(0)
  const [prevElementId, setPrevElementId] = useState(element.id)

  // Initialize cards
  const initializeCards = () => {
    setCards(getInitialCards(element.data.cards || []))
    setSelectedIds([])
    setAttempts(0)
  }

  // React-recommended pattern to reset state when element changes
  if (element.id !== prevElementId) {
    setPrevElementId(element.id)
    initializeCards()
  }

  const handleCardClick = (e: React.MouseEvent, uniqueId: string) => {
    e.stopPropagation()
    // Avoid double clicks, clicks on already flipped/matched cards, or when 2 are already chosen
    if (selectedIds.length >= 2) return
    const clickedCard = cards.find((c) => c.uniqueId === uniqueId)
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return

    // Flip card
    setCards((prev) =>
      prev.map((c) => (c.uniqueId === uniqueId ? { ...c, isFlipped: true } : c))
    )

    const newSelected = [...selectedIds, uniqueId]
    setSelectedIds(newSelected)

    // Check match when two cards are flipped
    if (newSelected.length === 2) {
      setAttempts((prev) => prev + 1)
      const [firstUniqueId, secondUniqueId] = newSelected
      const card1 = cards.find((c) => c.uniqueId === firstUniqueId)
      const card2 = cards.find((c) => c.uniqueId === secondUniqueId)

      if (card1 && card2 && card1.value === card2.value) {
        // MATCHED
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uniqueId === firstUniqueId || c.uniqueId === secondUniqueId
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          )
          setSelectedIds([])
        }, 500)
      } else {
        // MISMATCHED - Flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uniqueId === firstUniqueId || c.uniqueId === secondUniqueId
                ? { ...c, isFlipped: false }
                : c
            )
          )
          setSelectedIds([])
        }, 1000)
      }
    }
  }

  const isAllMatched = cards.length > 0 && cards.every((c) => c.isMatched)

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
        userSelect: "none",
      }}
      onClick={handleClick}
    >
      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Sparkles style={{ height: "16px", width: "16px", color: "#6366f1" }} />
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Lật thẻ nhớ
          </span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
          Lượt thử: <strong style={{ color: "#334155" }}>{attempts}</strong>
        </span>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: cards.length > 8 ? "repeat(4, 1fr)" : "repeat(3, 1fr)",
          gap: "8px",
          flex: 1,
          alignContent: "center",
        }}
      >
        {cards.map((card) => {
          const showFace = card.isFlipped || card.isMatched
          return (
            <div
              key={card.uniqueId}
              onClick={(e) => handleCardClick(e, card.uniqueId)}
              style={{
                aspectRatio: "1/1",
                cursor: card.isMatched ? "default" : "pointer",
                perspective: "1000px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transition: "transform 0.4s",
                  transformStyle: "preserve-3d",
                  transform: showFace ? "rotateY(180deg)" : "rotateY(0deg)",
                  position: "relative",
                }}
              >
                {/* Back Face (Unflipped) */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    backgroundColor: "#e0e7ff",
                    border: "2px solid #c7d2fe",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#6366f1",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                  className="hover:scale-[1.03] transition-all duration-150 hover:border-indigo-400"
                >
                  ?
                </div>

                {/* Front Face (Flipped) */}
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backfaceVisibility: "hidden",
                    backgroundColor: card.isMatched ? "#ecfdf5" : "#ffffff",
                    border: card.isMatched ? "2px solid #10b981" : "2px solid #6366f1",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: card.isMatched ? "#047857" : "#1e293b",
                    transform: "rotateY(180deg)",
                    padding: "4px",
                    wordBreak: "break-word",
                  }}
                >
                  {card.value}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Completion & Actions */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" }}>
        {isAllMatched && (
          <div
            style={{
              flex: 1,
              backgroundColor: "#dcfce7",
              color: "#15803d",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "0.75rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            🎉 Hoàn thành xuất sắc!
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            initializeCards()
          }}
          style={{ fontSize: "0.75rem", height: "28px" }}
        >
          <RefreshCw style={{ height: "12px", width: "12px", marginRight: "4px" }} />
          Chơi lại
        </Button>
      </div>
    </div>
  )
}

export default MemoryCardElement
