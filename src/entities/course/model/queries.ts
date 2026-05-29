import {
  useQuery,
  useMutation,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query"
import { api, MOCK_COURSES } from "@/shared/api"
import type { Course } from "broker-core-sdk"

// Strict Type-Safe Query Keys Factory
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: () => [...courseKeys.lists()] as const,
  detail: (id: string) => [...courseKeys.all, "detail", id] as const,
}

export interface NormalizedCourse extends Course {
  thumbnailUrl?: string
}

export interface RawServerCourse {
  _id?: string
  id?: string
  tenantId?: string
  title?: string
  description?: string
  thumbnailUrl?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export const mapCourse = (c: RawServerCourse): NormalizedCourse => {
  const id = c.id || c._id || ""
  return {
    id,
    tenantId: c.tenantId || "",
    title: c.title || "",
    description: c.description || "",
    thumbnailUrl: c.thumbnailUrl || "",
    status: c.status || "draft",
    createdAt: c.createdAt || new Date().toISOString(),
    updatedAt: c.updatedAt || new Date().toISOString(),
  }
}

// Option builder for Courses Query
export const courseQueryOptions = () =>
  queryOptions<NormalizedCourse[], Error>({
    queryKey: courseKeys.list(),
    queryFn: async (): Promise<NormalizedCourse[]> => {
      try {
        const response = await api.get<RawServerCourse[] | { data: RawServerCourse[] }>(
          "/elearning-api/courses"
        )
        let rawData: RawServerCourse[] = []
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
        return rawData.map(mapCourse)
      } catch (error) {
        console.warn(
          `[React Query] Failed to fetch courses from backend API, using local MOCK_COURSES fallback. Reason:`,
          error instanceof Error ? error.message : error
        )
        return MOCK_COURSES.map((c) => mapCourse(c as unknown as RawServerCourse))
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

export interface CreateCourseDto {
  title: string
  description?: string
  thumbnailUrl?: string
  status?: string
}

export interface UpdateCourseDto {
  title?: string
  description?: string
  thumbnailUrl?: string
  status?: string
}

/**
 * Mutation hook to create a course.
 */
export function useCreateCourseMutation() {
  const queryClient = useQueryClient()

  return useMutation<NormalizedCourse, Error, CreateCourseDto>({
    mutationKey: [...courseKeys.all, "create"],
    mutationFn: async (dto: CreateCourseDto): Promise<NormalizedCourse> => {
      try {
        const result = await api.post<RawServerCourse>("/elearning-api/courses", dto)
        return mapCourse(result)
      } catch (error) {
        console.warn(
          `[React Query] Failed to create course on backend API, using local simulation. Reason:`,
          error instanceof Error ? error.message : error
        )
        await new Promise<void>((resolve) => setTimeout(resolve, 400))

        const newCourse: NormalizedCourse = {
          id: `course-${Math.random().toString(36).substring(2, 11)}`,
          tenantId: "tenant-demo",
          title: dto.title,
          description: dto.description || "",
          thumbnailUrl: dto.thumbnailUrl || "",
          status: dto.status || "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        MOCK_COURSES.push(newCourse)
        return newCourse
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list() })
    },
  })
}

/**
 * Mutation hook to update a course.
 */
export function useUpdateCourseMutation() {
  const queryClient = useQueryClient()

  return useMutation<NormalizedCourse, Error, { id: string; dto: UpdateCourseDto }>({
    mutationKey: [...courseKeys.all, "update"],
    mutationFn: async ({ id, dto }): Promise<NormalizedCourse> => {
      try {
        const result = await api.put<RawServerCourse>(`/elearning-api/courses/${id}`, dto)
        return mapCourse(result)
      } catch (error) {
        console.warn(
          `[React Query] Failed to update course on backend API, using local simulation. Reason:`,
          error instanceof Error ? error.message : error
        )
        await new Promise<void>((resolve) => setTimeout(resolve, 400))

        const existingIdx = MOCK_COURSES.findIndex((c) => c.id === id)
        if (existingIdx === -1) throw new Error("Course not found")

        const updatedCourse: NormalizedCourse = {
          ...MOCK_COURSES[existingIdx],
          ...dto,
          updatedAt: new Date().toISOString(),
        }

        MOCK_COURSES[existingIdx] = updatedCourse
        return updatedCourse
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list() })
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.id),
      })
    },
  })
}

/**
 * Mutation hook to delete a course.
 */
export function useDeleteCourseMutation() {
  const queryClient = useQueryClient()

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationKey: [...courseKeys.all, "delete"],
    mutationFn: async (
      id: string
    ): Promise<{ success: boolean; message: string }> => {
      try {
        return await api.delete<{ success: boolean; message: string }>(
          `/elearning-api/courses/${id}`
        )
      } catch (error) {
        console.warn(
          `[React Query] Failed to delete course on backend API, using local simulation. Reason:`,
          error instanceof Error ? error.message : error
        )
        await new Promise<void>((resolve) => setTimeout(resolve, 400))

        const existingIdx = MOCK_COURSES.findIndex((c) => c.id === id)
        if (existingIdx === -1) throw new Error("Course not found")

        MOCK_COURSES.splice(existingIdx, 1)
        return { success: true, message: "Course deleted successfully" }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.list() })
    },
  })
}
