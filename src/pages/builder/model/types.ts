import type React from "react"
import type { SlideElement } from "broker-core-sdk"

export type BuilderElement = SlideElement

export type ElementTypeItem = {
  type: BuilderElement["type"]
  label: string
  icon: React.ElementType
}

export type HotspotZone = {
  id: string
  xMin: number
  yMin: number
  xMax: number
  yMax: number
}
