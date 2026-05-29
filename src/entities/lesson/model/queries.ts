import { useQuery, useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"
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

export interface CreateLessonDto {
  title: string
  description?: string
  order?: number
  status?: string
}

export interface UpdateLessonDto {
  title?: string
  description?: string
  order?: number
  status?: string
}

/**
 * Mutation hook to create a lesson.
 */
export function useCreateLessonMutation(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation<NormalizedLesson, Error, CreateLessonDto>({
    mutationKey: [...lessonKeys.all, "create", courseId],
    mutationFn: async (dto: CreateLessonDto): Promise<NormalizedLesson> => {
      try {
        const result = await api.post<RawServerLesson>(
          `/elearning-api/courses/${courseId}/lessons`,
          dto
        )
        return mapLesson(result)
      } catch (error) {
        console.warn(
          `[React Query] Failed to create lesson on backend API, using local simulation. Reason:`,
          error instanceof Error ? error.message : error
        )
        await new Promise<void>((resolve) => setTimeout(resolve, 400))

        const newLesson: NormalizedLesson = {
          id: `lesson-${Math.random().toString(36).substring(2, 11)}`,
          tenantId: "tenant-demo",
          courseId: courseId,
          title: dto.title,
          description: dto.description || "",
          order: dto.order ?? (MOCK_LESSONS.filter((l) => l.courseId === courseId).length + 1),
          status: dto.status || "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        MOCK_LESSONS.push(newLesson)
        return newLesson
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.list(courseId) })
    },
  })
}

/**
 * Mutation hook to update a lesson.
 */
export function useUpdateLessonMutation(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation<NormalizedLesson, Error, { id: string; dto: UpdateLessonDto }>({
    mutationKey: [...lessonKeys.all, "update", courseId],
    mutationFn: async ({ id, dto }): Promise<NormalizedLesson> => {
      try {
        const result = await api.put<RawServerLesson>(`/elearning-api/lessons/${id}`, dto)
        return mapLesson(result)
      } catch (error) {
        console.warn(
          `[React Query] Failed to update lesson on backend API, using local simulation. Reason:`,
          error instanceof Error ? error.message : error
        )
        await new Promise<void>((resolve) => setTimeout(resolve, 400))

        const existingIdx = MOCK_LESSONS.findIndex((l) => l.id === id)
        if (existingIdx === -1) throw new Error("Lesson not found")

        const updatedLesson: NormalizedLesson = {
          ...MOCK_LESSONS[existingIdx] as unknown as RawServerLesson,
          ...dto,
          updatedAt: new Date().toISOString(),
        } as NormalizedLesson

        MOCK_LESSONS[existingIdx] = updatedLesson
        return updatedLesson
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.list(courseId) })
      queryClient.invalidateQueries({ queryKey: lessonKeys.detail(variables.id) })
    },
  })
}

/**
 * Mutation hook to delete a lesson.
 */
export function useDeleteLessonMutation(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationKey: [...lessonKeys.all, "delete", courseId],
    mutationFn: async (
      id: string
    ): Promise<{ success: boolean; message: string }> => {
      try {
        return await api.delete<{ success: boolean; message: string }>(
          `/elearning-api/lessons/${id}`
        )
      } catch (error) {
        console.warn(
          `[React Query] Failed to delete lesson on backend API, using local simulation. Reason:`,
          error instanceof Error ? error.message : error
        )
        await new Promise<void>((resolve) => setTimeout(resolve, 400))

        const existingIdx = MOCK_LESSONS.findIndex((l) => l.id === id)
        if (existingIdx === -1) throw new Error("Lesson not found")

        MOCK_LESSONS.splice(existingIdx, 1)
        return { success: true, message: "Lesson deleted successfully" }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.list(courseId) })
    },
  })
}

