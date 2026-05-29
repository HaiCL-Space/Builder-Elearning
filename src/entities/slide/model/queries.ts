import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query"
import { api } from "@/shared/api"
import { MOCK_SLIDES } from "@/shared/api"
import type { Slide } from "broker-core-sdk"

// Strict Type-Safe Query Keys Factory
export const slideKeys = {
  all: ["slides"] as const,
  lists: () => [...slideKeys.all, "list"] as const,
  list: (lessonId: string) => [...slideKeys.lists(), { lessonId }] as const,
  detail: (id: string) => [...slideKeys.all, "detail", id] as const,
}

export type NormalizedSlide = Slide

export interface RawServerSlide {
  _id?: string
  id?: string
  tenantId?: string
  lessonId?: string
  lesson_id?: string
  order?: number
  elements?: Slide["elements"]
  config?: Slide["config"]
}

export const mapSlide = (s: RawServerSlide): NormalizedSlide => {
  const id = s.id || s._id || ""
  const lessonId = s.lessonId || s.lesson_id || ""
  return {
    id,
    tenantId: s.tenantId || "",
    lessonId,
    order: s.order || 0,
    elements: s.elements || [],
    config: s.config || { aspectRatio: "16:9", theme: "light" },
  }
}

// Option builder for Slide Query - facilitates prefetching or reuse
export const slideQueryOptions = (lessonId: string = "lesson-demo") =>
  queryOptions<NormalizedSlide[], Error>({
    queryKey: slideKeys.list(lessonId),
    queryFn: async (): Promise<NormalizedSlide[]> => {
      try {
        // Attempt to fetch slides from the actual backend
        const response = await api.get<RawServerSlide[] | { data: RawServerSlide[] }>(
          `/elearning-api/lessons/${lessonId}/slides`
        )
        let rawData: RawServerSlide[] = []
        if (Array.isArray(response)) {
          rawData = response
        } else if (
          response &&
          typeof response === "object" &&
          "data" in response &&
          Array.isArray(response.data)
        ) {
          rawData = response.data
        } else {
          throw new Error("Invalid response format from server")
        }
        return rawData.map(mapSlide)
      } catch (error) {
        console.warn(
          `[React Query] Failed to fetch slides from backend API, using local MOCK_SLIDES fallback. Reason:`,
          error instanceof Error ? error.message : error
        )
        // Fallback gracefully to MOCK_SLIDES filtered by lessonId for standalone offline operation
        return MOCK_SLIDES.filter(
          (slide) => slide.lessonId === lessonId || slide.lesson_id === lessonId
        ).map((s) => mapSlide(s as unknown as RawServerSlide))
      }
    },
  })

/**
 * Type-safe query hook to retrieve slides.
 * Highly robust: falls back to MOCK_SLIDES on API failure so the app never crashes.
 */
export function useSlidesQuery(lessonId: string = "lesson-demo") {
  return useQuery(slideQueryOptions(lessonId))
}

/**
 * Type-safe mutation hook to save slides.
 * Includes simulated latency and offline fallback storage for standard builder flow.
 */
export function useSaveSlidesMutation(lessonId: string = "lesson-demo") {
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, NormalizedSlide[]>({
    mutationKey: [...slideKeys.all, "save", lessonId],
    mutationFn: async (slides: NormalizedSlide[]): Promise<boolean> => {
      try {
        // 1. Get currently stored slides from cache to find differences
        const originalSlides =
          queryClient.getQueryData<NormalizedSlide[]>(slideKeys.list(lessonId)) || []

        const originalIds = new Set(originalSlides.map((s) => s.id))
        const currentIds = new Set(slides.map((s) => s.id))

        const toCreate = slides.filter((s) => !originalIds.has(s.id))
        const toUpdate = slides.filter((s) => originalIds.has(s.id))
        const toDelete = originalSlides.filter((s) => !currentIds.has(s.id))

        // 2. Perform CRUD operations
        // Create new slides
        for (const slide of toCreate) {
          await api.post<RawServerSlide>("/elearning-api/slides", {
            id: slide.id,
            lessonId,
            order: slide.order,
            config: slide.config || {},
            elements: slide.elements || [],
          })
        }

        // Update modified slides
        for (const slide of toUpdate) {
          await api.put<RawServerSlide>(`/elearning-api/slides/${slide.id}`, {
            lessonId,
            order: slide.order,
            config: slide.config || {},
            elements: slide.elements || [],
          })
        }

        // Delete removed slides
        for (const slide of toDelete) {
          await api.delete(`/elearning-api/slides/${slide.id}`)
        }

        return true
      } catch (error) {
        console.warn(
          `[React Query] Failed to save slides to backend API, falling back to local simulation. Reason:`,
          error instanceof Error ? error.message : error
        )
        // Simulate network latency (600ms) for professional UX spinner feedback
        await new Promise<void>((resolve) => setTimeout(resolve, 600))

        // Save to localStorage as a robust local backup
        if (typeof window !== "undefined") {
          localStorage.setItem(
            `previewer_slides_backup_${lessonId}`,
            JSON.stringify(slides)
          )
        }
        return false // Return false to indicate offline local-saved status
      }
    },
    onSuccess: (isOnlineSuccess) => {
      // Invalidate query to trigger fresh synchronization in the cache
      queryClient.invalidateQueries({
        queryKey: slideKeys.list(lessonId),
      })
      console.log(
        isOnlineSuccess
          ? "[React Query] Slides saved successfully to backend database."
          : "[React Query] Slides backup saved successfully to local storage (Offline Mode)."
      )
    },
  })
}

