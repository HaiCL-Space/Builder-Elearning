import { type SlideElement } from "broker-core-sdk"
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { useBuilderStore } from "@/pages/builder/model/use-builder-store"
import { cn } from "@/shared/lib/utils"

interface MatchingElementProps {
  element: Extract<SlideElement, { type: "MATCHING" }>
  baseStyle: React.CSSProperties
  handleClick: (e: React.MouseEvent) => void
}

interface Point {
  x: number
  y: number
}

const MatchingElement: React.FC<MatchingElementProps> = ({
  element,
  baseStyle,
  handleClick,
}) => {
  const isInteractiveMode = useBuilderStore((state) => state.isInteractiveMode)
  const [leftSelected, setLeftSelected] = useState<string | null>(null)
  const [rightSelected, setRightSelected] = useState<string | null>(null)
  const [matches, setMatches] = useState<[string, string][]>([])
  const [lineCoords, setLineCoords] = useState<{ [key: string]: { start: Point; end: Point } }>({})
  
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const colors = useMemo(() => ["#6366f1", "#ec4899", "#22c55e", "#eab308", "#a855f7", "#f97316"], [])

  const updateLineCoords = useCallback(() => {
    if (!containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const newCoords: { [key: string]: { start: Point; end: Point } } = {}

    matches.forEach(([leftId, rightId]) => {
      const leftEl = itemRefs.current.get(leftId)
      const rightEl = itemRefs.current.get(rightId)

      if (leftEl && rightEl) {
        const leftRect = leftEl.getBoundingClientRect()
        const rightRect = rightEl.getBoundingClientRect()

        newCoords[`${leftId}-${rightId}`] = {
          start: {
            x: leftRect.right - containerRect.left,
            y: leftRect.top + leftRect.height / 2 - containerRect.top,
          },
          end: {
            x: rightRect.left - containerRect.left,
            y: rightRect.top + rightRect.height / 2 - containerRect.top,
          },
        }
      }
    })
    setLineCoords(newCoords)
  }, [matches])

  useEffect(() => {
    updateLineCoords()
    window.addEventListener("resize", updateLineCoords)
    return () => window.removeEventListener("resize", updateLineCoords)
  }, [updateLineCoords])

  const handleItemClick = (id: string, side: "left" | "right") => {
    if (!isInteractiveMode) return

    if (side === "left") {
      const nextLeft = id === leftSelected ? null : id
      if (nextLeft && rightSelected) {
        setMatches((prev) => {
          const filtered = prev.filter(([l, r]) => l !== nextLeft && r !== rightSelected)
          return [...filtered, [nextLeft, rightSelected]]
        })
        setLeftSelected(null)
        setRightSelected(null)
      } else {
        setLeftSelected(nextLeft)
      }
    } else {
      const nextRight = id === rightSelected ? null : id
      if (leftSelected && nextRight) {
        setMatches((prev) => {
          const filtered = prev.filter(([l, r]) => l !== leftSelected && r !== nextRight)
          return [...filtered, [leftSelected, nextRight]]
        })
        setLeftSelected(null)
        setRightSelected(null)
      } else {
        setRightSelected(nextRight)
      }
    }
  }

  const getMatchColor = (id: string, side: "left" | "right") => {
    const index = matches.findIndex((m) =>
      side === "left" ? m[0] === id : m[1] === id
    )
    if (index === -1) return null
    return colors[index % colors.length]
  }

  return (
    <div
      ref={containerRef}
      data-matching-id={element.id}
      data-user-matches={JSON.stringify(matches)}
      style={{
        ...baseStyle,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: "24px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "16px",
        boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        position: "relative",
      }}
      onClick={handleClick}
    >
      {/* SVG Overlay for Lines */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {Object.entries(lineCoords).map(([key, coords], idx) => {
          const color = colors[idx % colors.length]
          return (
            <React.Fragment key={key}>
              <line
                x1={coords.start.x}
                y1={coords.start.y}
                x2={coords.end.x}
                y2={coords.end.y}
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                style={{ transition: "all 0.3s ease" }}
                strokeDasharray="5,5"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="100"
                  to="0"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </line>
              <circle cx={coords.start.x} cy={coords.start.y} r="4" fill={color} />
              <circle cx={coords.end.x} cy={coords.end.y} r="4" fill={color} />
            </React.Fragment>
          )
        })}
      </svg>

      <div
        style={{
          width: "42%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          zIndex: 2,
        }}
      >
        {element.data.leftColumn.map((item) => {
          const matchedColor = getMatchColor(item.id, "left")
          const isSelected = leftSelected === item.id
          return (
            <div
              key={item.id}
              ref={(el) => { if (el) itemRefs.current.set(item.id, el) }}
              onClick={(e) => {
                e.stopPropagation()
                handleItemClick(item.id, "left")
              }}
              className={cn(
                "group relative cursor-pointer rounded-xl border p-4 text-center text-sm font-medium transition-all duration-300",
                isSelected ? "border-indigo-500 bg-indigo-500 text-white shadow-lg scale-[1.02]" : 
                matchedColor ? "border-transparent text-white shadow-md" : 
                "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
              )}
              style={{
                backgroundColor: isSelected ? "#6366f1" : matchedColor ? matchedColor : undefined,
                cursor: isInteractiveMode ? "pointer" : "default",
              }}
            >
              {item.content}
              {/* Dot indicator */}
              <div
                className={cn(
                  "absolute -right-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white shadow-sm transition-colors duration-300",
                  isSelected ? "bg-indigo-500" : matchedColor ? "bg-white" : "bg-slate-300"
                )}
                style={{ backgroundColor: matchedColor ? "#fff" : undefined }}
              />
            </div>
          )
        })}
      </div>

      <div
        style={{
          width: "42%",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          zIndex: 2,
        }}
      >
        {element.data.rightColumn.map((item) => {
          const matchedColor = getMatchColor(item.id, "right")
          const isSelected = rightSelected === item.id
          return (
            <div
              key={item.id}
              ref={(el) => { if (el) itemRefs.current.set(item.id, el) }}
              onClick={(e) => {
                e.stopPropagation()
                handleItemClick(item.id, "right")
              }}
              className={cn(
                "group relative cursor-pointer rounded-xl border p-4 text-center text-sm font-medium transition-all duration-300",
                isSelected ? "border-pink-500 bg-pink-500 text-white shadow-lg scale-[1.02]" : 
                matchedColor ? "border-transparent text-white shadow-md" : 
                "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
              )}
              style={{
                backgroundColor: isSelected ? "#ec4899" : matchedColor ? matchedColor : undefined,
                cursor: isInteractiveMode ? "pointer" : "default",
              }}
            >
              {item.content}
              {/* Dot indicator */}
              <div
                className={cn(
                  "absolute -left-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white shadow-sm transition-colors duration-300",
                  isSelected ? "bg-pink-500" : matchedColor ? "bg-white" : "bg-slate-300"
                )}
                style={{ backgroundColor: matchedColor ? "#fff" : undefined }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MatchingElement
