import { useState } from "react"
import {
  useLessonsQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  type NormalizedLesson,
} from "@/entities/lesson"
import {
  Play,
  Sliders,
  AlertCircle,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
} from "lucide-react"

interface LessonsListProps {
  courseId: string
}

export function LessonsList({ courseId }: LessonsListProps) {
  const { data: lessons = [], isPending, isError, error } = useLessonsQuery(courseId)

  // Mutations
  const createMutation = useCreateLessonMutation(courseId)
  const updateMutation = useUpdateLessonMutation(courseId)
  const deleteMutation = useDeleteLessonMutation(courseId)

  // Form & Interaction states
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")

  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Handlers
  const handleCreate = () => {
    if (!newTitle.trim()) return
    createMutation.mutate(
      {
        title: newTitle.trim(),
        description: newDesc.trim(),
        order: lessons.length + 1,
        status: "draft",
      },
      {
        onSuccess: () => {
          setNewTitle("")
          setNewDesc("")
          setIsAdding(false)
        },
      }
    )
  }

  const startEdit = (lesson: NormalizedLesson) => {
    setEditingId(lesson.id)
    setEditTitle(lesson.title || "")
    setEditDesc(lesson.description || "")
  }

  const handleUpdate = (id: string) => {
    if (!editTitle.trim()) return
    updateMutation.mutate(
      {
        id,
        dto: {
          title: editTitle.trim(),
          description: editDesc.trim(),
        },
      },
      {
        onSuccess: () => {
          setEditingId(null)
        },
      }
    )
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setDeletingId(null)
      },
    })
  }

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

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="space-y-2 mt-4 pl-3.5 border-l-2 border-cyan-500/20">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          Bài học trong khóa ({sortedLessons.length})
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-[10px] font-black text-cyan-400 hover:text-cyan-300 transition cursor-pointer select-none bg-cyan-950/20 px-2 py-1 rounded-md border border-cyan-500/10 hover:border-cyan-500/30"
          >
            <Plus className="h-3 w-3" />
            <span>Tạo bài học</span>
          </button>
        )}
      </div>

      {/* Lesson List */}
      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {sortedLessons.length === 0 && !isAdding ? (
          <div className="rounded-xl border border-dashed border-white/5 bg-slate-950/40 p-5 text-center text-xs text-slate-500">
            Chưa có bài học nào được khởi tạo cho khóa học này.
          </div>
        ) : (
          sortedLessons.map((lesson) => {
            const isEditing = editingId === lesson.id
            const isDeleting = deletingId === lesson.id
            const isLoading =
              (isEditing && updateMutation.isPending) ||
              (isDeleting && deleteMutation.isPending)

            return (
              <div
                key={lesson.id}
                className={`group/lesson relative flex flex-col gap-2 rounded-xl border p-3 transition duration-200 ${
                  isEditing
                    ? "border-cyan-500/50 bg-slate-900"
                    : isDeleting
                    ? "border-red-500/50 bg-red-950/10"
                    : "border-white/5 bg-slate-900/50 hover:border-white/10 hover:bg-slate-900"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center py-2 gap-2 text-slate-400 text-[11px] font-medium">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-500" />
                    <span>Đang thực hiện yêu cầu...</span>
                  </div>
                ) : isEditing ? (
                  /* Inline Edit Form */
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Tên bài học..."
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-cyan-500/50"
                      maxLength={100}
                    />
                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Mô tả bài học (không bắt buộc)..."
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 outline-none focus:border-cyan-500/50 resize-none h-14"
                      maxLength={200}
                    />
                    <div className="flex justify-end gap-2 pt-1 border-t border-white/5">
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[10px] font-bold text-slate-400 hover:bg-white/5 hover:text-white transition"
                      >
                        <X className="h-3 w-3" />
                        Hủy
                      </button>
                      <button
                        onClick={() => handleUpdate(lesson.id)}
                        disabled={!editTitle.trim()}
                        className="flex items-center gap-1 rounded-lg bg-cyan-500 px-2.5 py-1 text-[10px] font-black text-slate-950 hover:bg-cyan-400 transition disabled:opacity-40"
                      >
                        <Check className="h-3 w-3" />
                        Lưu thay đổi
                      </button>
                    </div>
                  </div>
                ) : isDeleting ? (
                  /* Inline Delete Confirmation */
                  <div className="flex flex-col gap-2 py-1 items-center text-center">
                    <span className="text-[11px] font-bold text-slate-200">
                      Xác nhận xóa vĩnh viễn bài học này?
                    </span>
                    <p className="text-[10px] text-red-400 font-medium">
                      Mọi slides liên kết sẽ bị xóa và không thể khôi phục.
                    </p>
                    <div className="flex gap-2.5 mt-1.5 w-full justify-center">
                      <button
                        onClick={() => setDeletingId(null)}
                        className="rounded-lg border border-white/10 px-3 py-1 text-[10px] font-bold text-slate-400 hover:bg-white/5 hover:text-white transition"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="flex items-center gap-1 rounded-lg bg-red-500 px-3.5 py-1 text-[10px] font-black text-slate-950 hover:bg-red-400 transition"
                      >
                        <Trash2 className="h-3 w-3" />
                        Đồng ý xóa
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Lesson Item */
                  <div className="flex items-start justify-between gap-4">
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h5 className="truncate text-xs font-bold text-slate-200 group-hover/lesson:text-cyan-400 transition duration-150">
                        {lesson.title}
                      </h5>
                      {lesson.description && (
                        <p className="truncate text-[10px] text-slate-500 mt-0.5 font-medium leading-tight">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    {/* Action Panel */}
                    <div className="flex items-center gap-1.5 shrink-0 select-none">
                      {/* Interactive Edit / Delete on Hover */}
                      <div className="flex items-center gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity duration-200 border-r border-white/10 pr-1.5">
                        <button
                          onClick={() => startEdit(lesson)}
                          className="rounded p-1 text-slate-500 hover:bg-white/5 hover:text-cyan-400 transition"
                          title="Sửa bài học"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setDeletingId(lesson.id)}
                          className="rounded p-1 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition"
                          title="Xóa bài học"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Design & Play Buttons */}
                      <button
                        onClick={() => {
                          window.history.pushState(
                            null,
                            "",
                            `/edit?lessonId=${lesson.id}`
                          )
                          window.dispatchEvent(new PopStateEvent("popstate"))
                        }}
                        className="flex items-center gap-1 rounded-lg bg-white/5 px-2 py-1.5 text-[10px] font-bold text-slate-300 hover:bg-cyan-500 hover:text-slate-950 transition active:scale-95 cursor-pointer"
                        title="Thiết kế Slides tương tác"
                      >
                        <Sliders className="h-2.5 w-2.5" />
                        <span>Thiết kế</span>
                      </button>
                      <button
                        onClick={() => {
                          window.history.pushState(
                            null,
                            "",
                            `/viewer?lessonId=${lesson.id}`
                          )
                          window.dispatchEvent(new PopStateEvent("popstate"))
                        }}
                        className="flex items-center gap-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 px-2 py-1.5 text-[10px] font-bold text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition active:scale-95 cursor-pointer"
                        title="Trải nghiệm học tương tác"
                      >
                        <Play className="h-2.5 w-2.5 fill-current" />
                        <span>Trải nghiệm</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Inline Create Form */}
      {isAdding && (
        <div className="rounded-xl border border-cyan-500/30 bg-slate-900/60 p-3 space-y-2 mt-2 shadow-lg shadow-cyan-950/20 animate-fade-in">
          {createMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-4 gap-2 text-slate-400 text-xs">
              <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
              <span>Đang tạo bài học trên máy chủ...</span>
            </div>
          ) : (
            <>
              <div className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase mb-1">
                Tạo bài học mới
              </div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài học..."
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500/50"
                maxLength={100}
                autoFocus
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Mô tả ngắn (không bắt buộc)..."
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-300 placeholder-slate-600 outline-none focus:border-cyan-500/50"
                maxLength={150}
              />
              <div className="flex justify-end gap-2 pt-1.5 border-t border-white/5">
                <button
                  onClick={() => {
                    setNewTitle("")
                    setNewDesc("")
                    setIsAdding(false)
                  }}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-[10px] font-bold text-slate-400 hover:bg-white/5 hover:text-white transition"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newTitle.trim()}
                  className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-3.5 py-1.5 text-[10px] font-black text-slate-950 hover:brightness-110 transition active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Plus className="h-3 w-3 text-slate-950" />
                  Tạo bài học
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

