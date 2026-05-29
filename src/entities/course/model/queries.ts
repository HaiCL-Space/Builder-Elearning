import { useQuery, queryOptions } from "@tanstack/react-query"
import { api, MOCK_COURSES } from "@/shared/api"
import type { Course } from "broker-core-sdk"

// Strict Type-Safe Query Keys Factory
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: () => [...courseKeys.lists()] as const,
  detail: (id: string) => [...courseKeys.all, "detail", id] as const,
}

// Option builder for Courses Query
export const courseQueryOptions = () =>
  queryOptions<Course[], Error>({
    queryKey: courseKeys.list(),
    queryFn: async (): Promise<Course[]> => {
      try {
        const response = await api.get<Course[] | { data: Course[] }>(
          "/courses"
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
          `[React Query] Failed to fetch courses from backend API, using local MOCK_COURSES fallback. Reason:`,
          error instanceof Error ? error.message : error
        )
        return MOCK_COURSES
      }
    },
  })

/**
 * Type-safe query hook to retrieve courses.
 * Falls back to MOCK_COURSES on API failure.
 */
export function useCoursesQuery() {
  return useQuery(courseQueryOptions())
}
