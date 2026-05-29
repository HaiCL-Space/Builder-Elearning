import { useQuery, queryOptions } from "@tanstack/react-query"
import { api, MOCK_LESSONS } from "@/shared/api"
import type { Lesson } from "broker-core-sdk"

// Strict Type-Safe Query Keys Factory
export const lessonKeys = {
  all: ["lessons"] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  list: (courseId: string) => [...lessonKeys.lists(), { courseId }] as const,
  detail: (id: string) => [...lessonKeys.all, "detail", id] as const,
}

// Option builder for Lessons Query
export const lessonQueryOptions = (courseId: string) =>
  queryOptions<Lesson[], Error>({
    queryKey: lessonKeys.list(courseId),
    queryFn: async (): Promise<Lesson[]> => {
      try {
        const response = await api.get<Lesson[] | { data: Lesson[] }>(
          `/courses/${courseId}/lessons`
        )
        if (Array.isArray(response)) {
          return response
        } else if (
          response &&
          typeof response === "object" &&
          "data" in response &&
          Array.isArray(response.data)
        ) {
          return response.data
        }
        throw new Error("Invalid response format from server")
      } catch (error) {
        console.warn(
          `[React Query] Failed to fetch lessons for course ${courseId} from backend API, using local MOCK_LESSONS fallback. Reason:`,
          error instanceof Error ? error.message : error
        )
        return MOCK_LESSONS.filter((lesson) => lesson.courseId === courseId)
      }
    },
  })

/**
 * Type-safe query hook to retrieve lessons for a course.
 * Falls back to MOCK_LESSONS on API failure.
 */
export function useLessonsQuery(courseId: string) {
  return useQuery(lessonQueryOptions(courseId))
}
