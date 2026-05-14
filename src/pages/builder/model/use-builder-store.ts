import { create } from "zustand"
import type { BuilderElement } from "@/pages/builder/model/types"
import { MOCK_SLIDES } from "@/shared/api/mock-slides"
import { ELEMENT_TEMPLATES } from "@/pages/builder/model/templates"
import { uid } from "@/shared/lib/utils"
import type { Slide, ElementAction } from "@broker/core-sdk"

interface BuilderState {
  slides: Slide[]
  currentSlideIndex: number
  selectedElementId: string | null
  isInteractiveMode: boolean
  guidelines: { x?: number; y?: number } | null
  activeTooltip: {
    x: number
    y: number
    w: number
    h: number
  } | null
  draggingId: string | null
  dragOffset: { x: number; y: number }
  resizing: {
    id: string
    handle: string
  } | null
  draggingZone: {
    elementId: string
    zoneId: string
    offsetX: number
    offsetY: number
  } | null

  // Basic Setters
  setSlides: (slides: Slide[] | ((prev: Slide[]) => Slide[])) => void
  setCurrentSlideIndex: (index: number | ((prev: number) => number)) => void
  setSelectedElementId: (id: string | null) => void
  setIsInteractiveMode: (interactive: boolean) => void
  setGuidelines: (guidelines: { x?: number; y?: number } | null) => void
  setActiveTooltip: (
    tooltip: {
      x: number
      y: number
      w: number
      h: number
    } | null
  ) => void
  setDraggingId: (id: string | null) => void
  setDragOffset: (offset: { x: number; y: number }) => void
  setResizing: (resizing: { id: string; handle: string } | null) => void
  setDraggingZone: (
    zone: {
      elementId: string
      zoneId: string
      offsetX: number
      offsetY: number
    } | null
  ) => void

  // Core Operations
  updateElement: (
    slideIndex: number,
    elementId: string,
    updater: (el: BuilderElement) => BuilderElement
  ) => void
  updateSelectedPosition: (patch: Partial<BuilderElement["position"]>) => void
  updateSelectedStyle: (patch: Record<string, unknown>) => void
  updateSelectedData: (patch: Record<string, unknown>) => void
  updateSelectedActions: (actions: ElementAction[]) => void
  updateSelectedAnimations: (patch: {
    enterAnimation?: BuilderElement["enterAnimation"]
    exitAnimation?: BuilderElement["exitAnimation"]
  }) => void

  // Handlers
  handleAddElement: (type: string) => void
  handleDeleteElement: (id: string) => void
  handleSelectSlide: (index: number) => void
  handleAddSlide: () => void
  handleDeleteSlide: (index: number) => void
  handleDuplicateSlide: (index: number) => void
  handleMoveSlide: (index: number, direction: "up" | "down") => void
  handleToggleMode: (interactive: boolean) => void
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  slides: JSON.parse(JSON.stringify(MOCK_SLIDES)),
  currentSlideIndex: 0,
  selectedElementId: null,
  isInteractiveMode: false,
  guidelines: null,
  activeTooltip: null,
  draggingId: null,
  dragOffset: { x: 0, y: 0 },
  resizing: null,
  draggingZone: null,

  // Basic Setters
  setSlides: (slides) =>
    set((state) => ({
      slides: typeof slides === "function" ? slides(state.slides) : slides,
    })),
  setCurrentSlideIndex: (index) =>
    set((state) => ({
      currentSlideIndex:
        typeof index === "function" ? index(state.currentSlideIndex) : index,
    })),
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  setIsInteractiveMode: (interactive) => set({ isInteractiveMode: interactive }),
  setGuidelines: (guidelines) => set({ guidelines }),
  setActiveTooltip: (tooltip) => set({ activeTooltip: tooltip }),
  setDraggingId: (id) => set({ draggingId: id }),
  setDragOffset: (offset) => set({ dragOffset: offset }),
  setResizing: (resizing) => set({ resizing }),
  setDraggingZone: (zone) => set({ draggingZone: zone }),

  // Core Operations
  updateElement: (slideIndex, elementId, updater) =>
    set((state) => ({
      slides: state.slides.map((slide, idx) =>
        idx === slideIndex
          ? {
              ...slide,
              elements: slide.elements.map((el: BuilderElement) =>
                el.id === elementId ? updater(el) : el
              ),
            }
          : slide
      ),
    })),

  updateSelectedPosition: (patch) => {
    const { selectedElementId, currentSlideIndex, updateElement } = get()
    if (!selectedElementId) return
    updateElement(currentSlideIndex, selectedElementId, (el) => ({
      ...el,
      position: { ...el.position, ...patch } as BuilderElement["position"],
    }))
  },

  updateSelectedStyle: (patch) => {
    const { selectedElementId, currentSlideIndex, updateElement } = get()
    if (!selectedElementId) return
    updateElement(currentSlideIndex, selectedElementId, (el) => ({
      ...el,
      style: { ...el.style, ...patch },
    }))
  },

  updateSelectedData: (patch) => {
    const { selectedElementId, currentSlideIndex, updateElement } = get()
    if (!selectedElementId) return
    updateElement(currentSlideIndex, selectedElementId, (el) => ({
      ...el,
      data: { ...el.data, ...patch },
    }))
  },

  updateSelectedActions: (actions) => {
    const { selectedElementId, currentSlideIndex, updateElement } = get()
    if (!selectedElementId) return
    updateElement(currentSlideIndex, selectedElementId, (el) => ({
      ...el,
      actions,
    }))
  },

  updateSelectedAnimations: (patch) => {
    const { selectedElementId, currentSlideIndex, updateElement } = get()
    if (!selectedElementId) return
    updateElement(currentSlideIndex, selectedElementId, (el) => ({
      ...el,
      ...patch,
    }))
  },

  // Handlers
  handleAddElement: (type) => {
    const { currentSlideIndex, setSlides, setSelectedElementId } = get()
    const template = ELEMENT_TEMPLATES[type]
    if (!template) return
    const newEl = {
      id: `el-${uid()}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: type as any,
      position: { x: 20, y: 20, w: 35, h: 25 },
      style: {
        borderRadius: 8,
      },
      data: {},
      ...template,
    } as BuilderElement

    setSlides((prev) =>
      prev.map((slide, idx) =>
        idx === currentSlideIndex
          ? { ...slide, elements: [...slide.elements, newEl] }
          : slide
      )
    )
    setSelectedElementId(newEl.id)
  },

  handleDeleteElement: (id) => {
    const { currentSlideIndex, setSlides, selectedElementId, setSelectedElementId } = get()
    setSlides((prev) =>
      prev.map((slide, idx) =>
        idx === currentSlideIndex
          ? {
              ...slide,
              elements: slide.elements.filter(
                (e: BuilderElement) => e.id !== id
              ),
            }
          : slide
      )
    )
    if (selectedElementId === id) setSelectedElementId(null)
  },

  handleSelectSlide: (index) => {
    set({
      currentSlideIndex: index,
      selectedElementId: null,
    })
  },

  handleAddSlide: () => {
    const { slides } = get()
    const nextSlide = {
      id: `slide-${uid()}`,
      tenant_id: "tenant-demo",
      course_id: "course-demo",
      order: slides.length + 1,
      elements: [],
      config: { aspectRatio: "16:9", theme: "light" as const },
    }
    set({
      slides: [...slides, nextSlide],
      currentSlideIndex: slides.length,
      selectedElementId: null,
    })
  },

  handleDeleteSlide: (index) => {
    const { slides, currentSlideIndex } = get()
    if (slides.length <= 1) return
    const nextSlides = slides.filter((_, idx) => idx !== index)
    const nextIndex =
      currentSlideIndex >= index ? Math.max(0, currentSlideIndex - 1) : currentSlideIndex
    set({
      slides: nextSlides,
      currentSlideIndex: nextIndex,
      selectedElementId: null,
    })
  },

  handleDuplicateSlide: (index) => {
    const { slides } = get()
    const original = slides[index]
    const cloned = JSON.parse(JSON.stringify(original))
    cloned.id = `slide-${uid()}`
    cloned.elements = (cloned.elements as BuilderElement[]).map(
      (el: BuilderElement) => ({
        ...el,
        id: `el-${uid()}`,
      })
    )
    const nextSlides = [...slides]
    nextSlides.splice(index + 1, 0, cloned)

    set({
      slides: nextSlides.map((s, idx) => ({ ...s, order: idx + 1 })),
      currentSlideIndex: index + 1,
      selectedElementId: null,
    })
  },

  handleMoveSlide: (index, direction) => {
    const { slides } = get()
    const targetIdx = direction === "up" ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= slides.length) return
    const nextSlides = [...slides]
    const temp = nextSlides[index]
    nextSlides[index] = nextSlides[targetIdx]
    nextSlides[targetIdx] = temp

    set({
      slides: nextSlides.map((s, idx) => ({ ...s, order: idx + 1 })),
      currentSlideIndex: targetIdx,
    })
  },

  handleToggleMode: (interactive) => {
    set({
      isInteractiveMode: interactive,
      selectedElementId: null,
    })
  },
}))
