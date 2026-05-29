import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  LogOut, 
  BookMarked, 
  GraduationCap, 
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Layers
} from "lucide-react"
import { useAuthStore } from "@/shared/auth"
import { useCoursesQuery, useDeleteCourseMutation, type NormalizedCourse } from "@/entities/course"
import { CourseDialog } from "./CourseDialog"
import { LessonsList } from "./LessonsList"

interface HomePageProps {
  onLogout?: () => void
}

export function HomePage({ onLogout }: HomePageProps) {
  const user = useAuthStore((state) => state.user)
  const { data: courses = [], isPending, isError, error } = useCoursesQuery()
  const deleteMutation = useDeleteCourseMutation()

  // Local state
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null)
  
  // Dialog controls
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<NormalizedCourse | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<NormalizedCourse | null>(null)

  // Filters logic
  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" ? true : c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOpenCreateDialog = () => {
    setSelectedCourse(null)
    setIsCourseDialogOpen(true)
  }

  const handleOpenEditDialog = (course: NormalizedCourse) => {
    setSelectedCourse(course)
    setIsCourseDialogOpen(true)
  }

  const handleOpenDeleteDialog = (course: NormalizedCourse) => {
    setCourseToDelete(course)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      deleteMutation.mutate(courseToDelete.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false)
          setCourseToDelete(null)
        }
      })
    }
  }

  const toggleExpandCourse = (courseId: string) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-cyan-900/10 blur-[120px]" />
        <div className="absolute top-[30%] -right-[30%] w-[90%] h-[90%] rounded-full bg-indigo-900/10 blur-[130px]" />
      </div>

      {/* 1. Header with Glassmorphism */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-white/5 shadow-lg shadow-slate-950/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md shadow-cyan-500/20">
              <GraduationCap className="h-5.5 w-5.5 text-slate-950" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white">
                BROKER<span className="text-cyan-400">CORE</span>
              </span>
              <div className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase leading-none mt-0.5">
                E-LEARNING SUITE
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-r border-white/10 pr-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "User"}
                  className="h-8.5 w-8.5 rounded-xl object-cover ring-1 ring-white/10 shadow-md"
                />
              ) : (
                <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-xs font-black text-slate-950 ring-1 ring-white/10 shadow-md">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-200">
                  {user?.name || "Giảng viên"}
                </span>
                <span className="text-[9px] text-slate-500 font-semibold truncate max-w-[120px]">
                  {user?.email || "admin@brokercore.vn"}
                </span>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center justify-center rounded-xl p-2 bg-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all active:scale-95"
                title="Đăng xuất"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 z-10 relative">
        
        {/* 2. Hero banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 shadow-2xl mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 z-0 pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-cyan-500/10 blur-3xl" />
          
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Quản lý và thiết kế khóa học <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">tương tác</span>
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Chào mừng trở lại! Tại đây, bạn có thể tổ chức các khóa học bất động sản chuyên sâu, thêm bài học mới và trực tiếp thiết kế các slides câu hỏi, trò chơi tương tác cao cấp phục vụ học viên.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 border border-white/5">
                <BookMarked className="h-4 w-4 text-cyan-400" />
                <span>Khóa học trực tuyến</span>
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 border border-white/5">
                <Layers className="h-4 w-4 text-cyan-400" />
                <span>Thiết kế Slides kéo thả</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* 3. Toolbar (Search, Filter, Create) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/40 border border-white/5 p-4 rounded-2xl mb-8 backdrop-blur">
          {/* Search box */}
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm khóa học..."
              className="w-full bg-slate-950 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Filters & Create button */}
          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-4">
            <div className="flex bg-slate-950 p-1 border border-white/5 rounded-xl text-xs font-bold text-slate-400 shrink-0">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === "all" 
                    ? "bg-slate-900 text-cyan-400 border border-white/5" 
                    : "hover:text-white"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setStatusFilter("published")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === "published" 
                    ? "bg-slate-900 text-emerald-400 border border-white/5" 
                    : "hover:text-white"
                }`}
              >
                Xuất bản
              </button>
              <button
                onClick={() => setStatusFilter("draft")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  statusFilter === "draft" 
                    ? "bg-slate-900 text-amber-400 border border-white/5" 
                    : "hover:text-white"
                }`}
              >
                Bản nháp
              </button>
            </div>

            <button
              onClick={handleOpenCreateDialog}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-cyan-500/10 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition active:scale-98 cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>Tạo khóa học</span>
            </button>
          </div>
        </div>

        {/* 4. Main grid of courses */}
        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div 
                key={n} 
                className="h-80 rounded-2xl border border-white/5 bg-slate-900/30 p-5 space-y-4 animate-pulse"
              >
                <div className="h-32 bg-white/5 rounded-xl" />
                <div className="h-4 bg-white/10 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-5/6" />
                <div className="h-8 bg-white/5 rounded-xl" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center border border-red-500/20 bg-red-500/5 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-xl font-bold text-red-500 mb-4">
              !
            </div>
            <h2 className="text-base font-bold text-white mb-2">Lỗi truy xuất hệ thống</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {error?.message || "Đã xảy ra lỗi không xác định từ máy chủ khi tải danh sách khóa học."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold transition"
            >
              Tải lại trang
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-white/5 bg-slate-900/20 rounded-3xl p-16 text-center max-w-lg mx-auto">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-slate-400 mb-5">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-base font-bold text-white mb-1.5">Không tìm thấy khóa học</h2>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              {searchQuery || statusFilter !== "all" 
                ? "Thử thay đổi từ khóa tìm kiếm hoặc lọc theo trạng thái khác." 
                : "Danh sách hiện tại trống. Hãy bắt đầu bằng cách tạo khóa học tương tác đầu tiên của bạn!"}
            </p>
            {!(searchQuery || statusFilter !== "all") && (
              <button
                onClick={handleOpenCreateDialog}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:brightness-110 transition active:scale-95 cursor-pointer"
              >
                <Plus className="h-4.5 w-4.5" />
                <span>Bắt đầu ngay</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isExpanded = expandedCourseId === course.id
              return (
                <div
                  key={course.id}
                  className={`group relative flex flex-col rounded-2xl border transition-all duration-300 bg-slate-900/40 backdrop-blur-sm overflow-hidden ${
                    isExpanded 
                      ? "border-cyan-500/30 ring-1 ring-cyan-500/10 shadow-cyan-950/20 shadow-xl" 
                      : "border-white/5 hover:border-white/10 hover:bg-slate-900/70 hover:shadow-2xl hover:shadow-slate-950/50"
                  }`}
                >
                  {/* Thumbnail / Header */}
                  {course.thumbnailUrl ? (
                    <div className="h-32 w-full overflow-hidden relative border-b border-white/5">
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-32 w-full bg-gradient-to-tr from-slate-950 to-slate-900 relative border-b border-white/5 flex items-center justify-center p-4">
                      {/* Generative decorative patterns */}
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]" />
                      <div className="absolute top-4 left-4 h-1.5 w-1.5 rounded-full bg-cyan-500/30" />
                      <div className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-indigo-500/20" />
                      <BookOpen className="h-10 w-10 text-slate-700 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                      course.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}>
                      {course.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                    </span>
                  </div>

                  {/* Course Details */}
                  <div className="p-5 flex-1 flex flex-col min-w-0">
                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition duration-200">
                      {course.title}
                    </h3>
                    
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 min-h-[32px] leading-relaxed">
                      {course.description || "Không có mô tả chi tiết."}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-4 border-b border-white/5 pb-4 font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Cập nhật {new Date(course.updatedAt || course.createdAt || "").toLocaleDateString("vi-VN")}</span>
                    </div>

                    {/* Dynamic Lessons Container */}
                    {isExpanded && (
                      <LessonsList courseId={course.id} />
                    )}

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between mt-4 pt-1">
                      <button
                        onClick={() => toggleExpandCourse(course.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer select-none ${
                          isExpanded 
                            ? "bg-cyan-500/10 text-cyan-400" 
                            : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>Danh sách bài học</span>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditDialog(course)}
                          className="rounded-lg p-2 bg-white/5 text-slate-400 hover:bg-cyan-500/10 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/20 transition cursor-pointer"
                          title="Sửa thông tin"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteDialog(course)}
                          className="rounded-lg p-2 bg-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition cursor-pointer"
                          title="Xóa khóa học"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* 5. Create/Edit Course Dialog */}
      <AnimatePresence>
        {isCourseDialogOpen && (
          <CourseDialog
            key={selectedCourse?.id || "new-course"}
            isOpen={isCourseDialogOpen}
            onClose={() => setIsCourseDialogOpen(false)}
            course={selectedCourse}
          />
        )}
      </AnimatePresence>

      {/* 6. Custom Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          <div 
            onClick={() => setIsDeleteDialogOpen(false)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-xl font-bold text-red-500 mb-4 mx-auto">
              !
            </div>
            <h3 className="text-base font-bold text-white text-center">Xóa khóa học này?</h3>
            <p className="text-xs text-slate-400 text-center leading-relaxed mt-2">
              Hành động này sẽ xóa vĩnh viễn khóa học <span className="font-bold text-white">"{courseToDelete?.title}"</span> và không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?
            </p>
            <div className="flex gap-3 mt-6 border-t border-white/5 pt-4">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={deleteMutation.isPending}
                className="flex-1 rounded-xl py-2.5 text-xs font-bold tracking-wide text-slate-400 hover:bg-white/5 hover:text-white transition disabled:opacity-40"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-500 px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-red-400 transition active:scale-95 disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                <span>Đồng ý xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
