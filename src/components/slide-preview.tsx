import { type SlideElement, type ElementAction } from "@broker/core-sdk"
import React, { useState } from "react"
import { MOCK_SLIDES } from "../lib/mock-slides"

const SlidePreviewApp = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const currentSlide = MOCK_SLIDES[currentSlideIndex]

  // STATE: Quản lý danh sách các Element đang bị ẩn (dành cho action TOGGLE_VISIBILITY)
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(() => {
    const initiallyHidden = new Set<string>()
    currentSlide.elements.forEach((el) => {
      if (el.style?.opacity === 0) initiallyHidden.add(el.id)
    })
    return initiallyHidden
  })
  const [prevSlideIndex, setPrevSlideIndex] = useState(currentSlideIndex)

  // Reset state when slide changes during render (recommended standard pattern)
  if (currentSlideIndex !== prevSlideIndex) {
    setPrevSlideIndex(currentSlideIndex)
    const initiallyHidden = new Set<string>()
    currentSlide.elements.forEach((el) => {
      if (el.style?.opacity === 0) initiallyHidden.add(el.id)
    })
    setHiddenElements(initiallyHidden)
  }

  const handleNext = () => {
    if (currentSlideIndex < MOCK_SLIDES.length - 1)
      setCurrentSlideIndex((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (currentSlideIndex > 0) setCurrentSlideIndex((prev) => prev - 1)
  }

  // BỘ PHÂN PHỐI SỰ KIỆN (ACTION DISPATCHER)
  const executeAction = (action: ElementAction) => {
    switch (action.type) {
      case "NAVIGATE_SLIDE":
        if (action.payload.direction === "NEXT") handleNext()
        if (action.payload.direction === "PREV") handlePrev()
        break

      case "TOGGLE_VISIBILITY": {
        const targetId = action.payload.targetElementId
        setHiddenElements((prev) => {
          const next = new Set(prev)
          if (action.payload.action === "SHOW") next.delete(targetId)
          else if (action.payload.action === "HIDE") next.add(targetId)
          else {
            // TOGGLE
            if (next.has(targetId)) next.delete(targetId)
            else next.add(targetId)
          }
          return next
        })
        break
      }

      case "EVALUATE_ANSWER":
        alert(
          `[Learning Engine] Đang chấm điểm cho Element: ${action.payload.targetElementId}\nCập nhật tiến trình cho Concept: ${action.payload.conceptId}`
        )
        break

      case "PLAY_MEDIA":
        console.log("Phát media:", action.payload.mediaUrl)
        break
    }
  }

  return (
    <div
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>
          Preview: Slide {currentSlide.order} / {MOCK_SLIDES.length}
        </h2>
        <div>
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            style={{ padding: "8px 16px", marginRight: "10px" }}
          >
            Quay lại
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlideIndex === MOCK_SLIDES.length - 1}
            style={{ padding: "8px 16px" }}
          >
            Tiếp theo
          </button>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          backgroundColor: "#f8f9fa",
          border: "1px solid #ddd",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {currentSlide.elements.map((element) => {
          // Ghi đè opacity nếu element nằm trong danh sách bị ẩn
          const isHidden = hiddenElements.has(element.id)
          const overrideStyle = isHidden
            ? { opacity: 0, pointerEvents: "none" as const }
            : { opacity: 1 }

          return (
            <ElementRenderer
              key={element.id}
              element={element}
              onAction={executeAction}
              overrideStyle={overrideStyle}
            />
          )
        })}
      </div>
    </div>
  )
}

// ==========================================
// RENDERER ĐIỀU PHỐI (CÓ LẮNG NGHE SỰ KIỆN)
// ==========================================
const ElementRenderer = ({
  element,
  onAction,
  overrideStyle,
}: {
  element: SlideElement
  onAction: (action: ElementAction) => void
  overrideStyle: React.CSSProperties
}) => {
  // 1. Lọc ra các action có trigger là ON_CLICK
  const clickActions =
    element.actions?.filter((a) => a.trigger === "ON_CLICK") || []

  // 2. Hàm xử lý khi user click vào phần tử
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Ngăn chặn sự kiện sủi bọt (bubbling)
    clickActions.forEach((action) => onAction(action))
  }

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: `${element.position.x}%`,
    top: `${element.position.y}%`,
    width: `${element.position.w}%`,
    height: `${element.position.h}%`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    cursor: clickActions.length > 0 ? "pointer" : "default", // Đổi con trỏ chuột nếu có action
    transition: "opacity 0.3s ease", // Hiệu ứng mờ dần khi ẩn/hiện
    ...element.style,
    ...overrideStyle, // Chèn overrideStyle để kiểm soát ẩn/hiện
  }

  switch (element.type) {
    case "TEXT":
      return (
        <div style={baseStyle} onClick={handleClick}>
          {element.data.content}
        </div>
      )

    case "VIDEO":
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: "#000",
            color: "#fff",
            alignItems: "center",
          }}
          onClick={handleClick}
        >
          <span>🎥 Video: {element.data.src}</span>
        </div>
      )

    case "QUIZ":
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: "#fff",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
          onClick={handleClick}
        >
          <h3 style={{ marginTop: 0 }}>{element.data.question}</h3>
          {element.data.options.map((opt) => (
            <div
              key={opt.id}
              style={{
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="radio"
                name={element.id}
                id={opt.id}
                style={{ cursor: "pointer" }}
              />
              <label
                htmlFor={opt.id}
                style={{ marginLeft: "8px", cursor: "pointer", flex: 1 }}
              >
                {opt.content}
              </label>
            </div>
          ))}
        </div>
      )

    case "HOTSPOT":
      return (
        <div
          style={{
            ...baseStyle,
            backgroundImage: `url(${element.data.imageUri})`,
            backgroundSize: "cover",
            border: "2px dashed #007bff",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "rgba(255,255,255,0.8)",
              padding: "4px",
            }}
          >
            👆 Vùng Hotspot
          </div>
          {element.data.zones.map((zone) => (
            <div
              key={zone.id}
              onClick={handleClick} // Gắn action vào các vùng zone
              style={{
                position: "absolute",
                left: `${zone.xMin}%`,
                top: `${zone.yMin}%`,
                width: `${zone.xMax - zone.xMin}%`,
                height: `${zone.yMax - zone.yMin}%`,
                backgroundColor: "rgba(255, 0, 0, 0.3)",
                cursor: "pointer",
                border: "1px solid red",
              }}
              title={`Zone: ${zone.id}`}
            />
          ))}
        </div>
      )

    case "SORTING":
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: "#e9ecef",
            padding: "16px",
            borderRadius: "8px",
          }}
          onClick={handleClick}
        >
          {element.data.items.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "12px",
                margin: "8px 0",
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                cursor: "grab",
              }}
            >
              ↕️ {item.content}
            </div>
          ))}
        </div>
      )

    case "MATCHING":
      return (
        <div
          style={{
            ...baseStyle,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          onClick={handleClick}
        >
          <div
            style={{
              width: "45%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {element.data.leftColumn.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "16px",
                  backgroundColor: "#e3f2fd",
                  border: "1px solid #90caf9",
                  textAlign: "center",
                }}
              >
                {item.content}
              </div>
            ))}
          </div>
          <div
            style={{
              width: "45%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {element.data.rightColumn.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "16px",
                  backgroundColor: "#fce4ec",
                  border: "1px solid #f48fb1",
                  textAlign: "center",
                }}
              >
                {item.content}
              </div>
            ))}
          </div>
        </div>
      )

    default:
      return <div style={baseStyle}>[Unsupported Element: {element.type}]</div>
  }
}

export default SlidePreviewApp
