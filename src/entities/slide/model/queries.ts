import { useQuery, useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"
import { api } from "@/shared/api"
import { MOCK_SLIDES } from "@/shared/api"
import type { Slide } from "broker-core-sdk"

// Strict Type-Safe Query Keys Factory
export const slideKeys = {
  all: ["slides"] as const,
  lists: () => [...slideKeys.all, "list"] as const,
  list: (courseId: string) => [...slideKeys.lists(), { courseId }] as const,
  detail: (id: string) => [...slideKeys.all, "detail", id] as const,
}

// Option builder for Slide Query - facilitates prefetching or reuse
export const slideQueryOptions = (courseId: string = "course-demo") =>
  queryOptions<Slide[], Error>({
    queryKey: slideKeys.list(courseId),
    queryFn: async (): Promise<Slide[]> => {
      try {
        // Attempt to fetch slides from the actual backend
        const response = await api.get<Slide[] | { data: Slide[] }>(`/courses/${courseId}/slides`)
        if (Array.isArray(response)) {
          return response
        } else if (response && typeof response === "object" && "data" in response && Array.isArray(response.data)) {
          return response.data
        }
        throw new Error("Invalid response format from server")
      } catch (error) {
        console.warn(
          `[React Query] Failed to fetch slides from backend API, using local MOCK_SLIDES fallback. Reason:`,
          error instanceof Error ? error.message : error
        )
        // Fallback gracefully to MOCK_SLIDES for standalone offline operation
        return MOCK_SLIDES
      }
    },
  })

/**
 * Type-safe query hook to retrieve slides.
 * Highly robust: falls back to MOCK_SLIDES on API failure so the app never crashes.
 */
export function useSlidesQuery(courseId: string = "course-demo") {
  return useQuery(slideQueryOptions(courseId))
}

/**
 * Type-safe mutation hook to save slides.
 * Includes simulated latency and offline fallback storage for standard builder flow.
 */
export function useSaveSlidesMutation(courseId: string = "course-demo") {
  const queryClient = useQueryClient()

  return useMutation<boolean, Error, Slide[]>({
    mutationKey: [...slideKeys.all, "save", courseId],
    mutationFn: async (slides: Slide[]): Promise<boolean> => {
      try {
        // Attempt actual PUT request to save the design state
        await api.put(`/courses/${courseId}/slides`, { slides })
        return true
      } catch (error) {
        console.warn(
          `[React Query] Failed to save slides to backend API, falling back to local simulation. Reason:`,
          error instanceof Error ? error.message : error
        )
        // Simulate network latency (500ms) for professional UX spinner feedback
        await new Promise<void>((resolve) => setTimeout(resolve, 600))
        
        // Save to localStorage as a robust local backup
        if (typeof window !== "undefined") {
          localStorage.setItem(`previewer_slides_backup_${courseId}`, JSON.stringify(slides))
        }
        return false // Return false to indicate offline local-saved status
      }
    },
    onSuccess: (isOnlineSuccess) => {
      // Invalidate query to trigger fresh synchronization in the cache
      queryClient.invalidateQueries({
        queryKey: slideKeys.list(courseId),
      })
      console.log(
        isOnlineSuccess 
          ? "[React Query] Slides saved successfully to backend database."
          : "[React Query] Slides backup saved successfully to local storage (Offline Mode)."
      )
    },
  })
}
