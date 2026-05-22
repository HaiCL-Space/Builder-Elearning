import type React from "react"
import type { SlideElement } from "broker-core-sdk"

export type BuilderElement = SlideElement

export type ElementCategory = "basic" | "quiz" | "interactive"

export type ElementTypeItem = {
  type: BuilderElement["type"]
  label: string
  icon: React.ElementType
  category: ElementCategory
}

export type HotspotZone = {
  id: string
  xMin: number
  yMin: number
  xMax: number
  yMax: number
}
