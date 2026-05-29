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

export type NormalizedLesson = Lesson

export interface RawServerLesson {
  _id?: string
  id?: string
  tenantId?: string
  courseId?: string
  title?: string
  description?: string
  order?: number
  status?: string
  createdAt?: string
  updatedAt?: string
}

export const mapLesson = (l: RawServerLesson): NormalizedLesson => {
  const id = l.id || l._id || ""
  return {
    id,
    tenantId: l.tenantId || "",
    courseId: l.courseId || "",
    title: l.title || "",
    description: l.description || "",
    order: l.order || 0,
    status: l.status || "draft",
    createdAt: l.createdAt || new Date().toISOString(),
    updatedAt: l.updatedAt || new Date().toISOString(),
  }
}

// Option builder for Lessons Query
export const lessonQueryOptions = (courseId: string) =>
  queryOptions<NormalizedLesson[], Error>({
    queryKey: lessonKeys.list(courseId),
    queryFn: async (): Promise<NormalizedLesson[]> => {
      try {
        const response = await api.get<RawServerLesson[] | { data: RawServerLesson[] }>(
          `/elearning-api/courses/${courseId}/lessons`
        )
        let rawData: RawServerLesson[] = []
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
        return rawData.map(mapLesson)
      } catch (error) {
        console.warn(
          `[React Query] Failed to fetch lessons for course ${courseId} from backend API, using local MOCK_LESSONS fallback. Reason:`,
          error instanceof Error ? error.message : error
        )
        return MOCK_LESSONS.filter((lesson) => lesson.courseId === courseId).map((l) => mapLesson(l as unknown as RawServerLesson))
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
