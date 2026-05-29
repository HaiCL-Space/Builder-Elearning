import { useState } from "react"
import { motion } from "framer-motion"
import { X, Save, AlertCircle } from "lucide-react"
import { useCreateCourseMutation, useUpdateCourseMutation, type NormalizedCourse } from "@/entities/course"

interface CourseDialogProps {
  isOpen?: boolean
  onClose: () => void
  course?: NormalizedCourse | null
}

export function CourseDialog({ onClose, course }: CourseDialogProps) {
  const isEditMode = !!course

  const createMutation = useCreateCourseMutation()
  const updateMutation = useUpdateCourseMutation()

  const [title, setTitle] = useState(course?.title || "")
  const [description, setDescription] = useState(course?.description || "")
  const [thumbnailUrl, setThumbnailUrl] = useState(course?.thumbnailUrl || "")
  const [status, setStatus] = useState(course?.status || "draft")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setErrorMsg("Vui lòng nhập tiêu đề khóa học!")
      return
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      status,
    }

    if (isEditMode && course) {
      updateMutation.mutate(
        { id: course.id, dto: payload },
        {
          onSuccess: () => {
            onClose()
          },
          onError: (err) => {
            setErrorMsg(err.message || "Không thể cập nhật khóa học")
          },
        }
      )
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          onClose()
        },
        onError: (err) => {
          setErrorMsg(err.message || "Không thể tạo khóa học mới")
        },
      })
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white">
                {isEditMode ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                  Tiêu đề khóa học <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Luật Kinh doanh Bất động sản 2023..."
                  disabled={isPending}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                  Mô tả khóa học
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả tóm tắt về nội dung cốt lõi của khóa học này..."
                  rows={3}
                  disabled={isPending}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 resize-none"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                  Ảnh bìa (URL hình ảnh)
                </label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  disabled={isPending}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1.5">
                  Trạng thái phát hành
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus("draft")}
                    className={`flex items-center justify-center rounded-xl border py-2.5 text-sm font-semibold transition ${
                      status === "draft"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                        : "border-white/10 bg-slate-950 text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    Bản nháp (Draft)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("published")}
                    className={`flex items-center justify-center rounded-xl border py-2.5 text-sm font-semibold transition ${
                      status === "published"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 bg-slate-950 text-slate-400 hover:bg-slate-900"
                    }`}
                  >
                    Xuất bản (Published)
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2.5 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="rounded-xl px-4 py-2 text-xs font-bold tracking-wide text-slate-400 hover:bg-white/5 hover:text-white transition disabled:opacity-40"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-xs font-bold tracking-wide text-slate-950 shadow-lg shadow-cyan-900/20 hover:brightness-110 transition active:scale-[0.98] disabled:opacity-50"
                >
                  {isPending ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  <span>Lưu thông tin</span>
                </button>
              </div>
            </form>
          </motion.div>
      </div>
  )
}
