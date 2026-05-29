import { useLessonsQuery } from "@/entities/lesson"
import { Play, Sliders, AlertCircle, Loader2 } from "lucide-react"

interface LessonsListProps {
  courseId: string
}

export function LessonsList({ courseId }: LessonsListProps) {
  const { data: lessons, isPending, isError, error } = useLessonsQuery(courseId)

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-6 text-slate-500 gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-cyan-500" />
        <span className="text-xs">Đang tải danh sách bài học...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 my-2">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{error?.message || "Lỗi tải danh sách bài học."}</span>
      </div>
    )
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/5 bg-slate-950/40 p-5 text-center text-xs text-slate-500">
        Chưa có bài học nào được khởi tạo cho khóa học này.
      </div>
    )
  }

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="space-y-2 mt-3 pl-2 border-l border-white/5">
      <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">
        Bài học trong khóa ({sortedLessons.length})
      </div>
      {sortedLessons.map((lesson) => (
        <div
          key={lesson.id}
          className="group/lesson flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-slate-900/50 p-3 transition hover:border-white/10 hover:bg-slate-900"
        >
          {/* Info */}
          <div className="min-w-0">
            <h5 className="truncate text-xs font-bold text-slate-200 group-hover/lesson:text-white transition">
              {lesson.title}
            </h5>
            {lesson.description && (
              <p className="truncate text-[10px] text-slate-500 mt-0.5">
                {lesson.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                window.history.pushState(null, "", `/edit?lessonId=${lesson.id}`)
                window.dispatchEvent(new PopStateEvent("popstate"))
              }}
              className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1.5 text-[10px] font-bold text-slate-300 hover:bg-cyan-500 hover:text-slate-950 transition active:scale-95"
              title="Thiết kế Slides tương tác"
            >
              <Sliders className="h-3 w-3" />
              <span>Thiết kế</span>
            </button>
            <button
              onClick={() => {
                window.history.pushState(null, "", `/viewer?lessonId=${lesson.id}`)
                window.dispatchEvent(new PopStateEvent("popstate"))
              }}
              className="flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1.5 text-[10px] font-bold text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition active:scale-95 animate-pulse-subtle"
              title="Trải nghiệm học tương tác"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Trải nghiệm</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
