import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  Award,
  BookOpen, 
  ArrowRight 
} from "lucide-react"

interface SpacedRepetitionData {
  conceptId: string
  userAnswerDesc: string
  days: number
  nextReviewDateStr: string
  isMastered: boolean
}

export interface CustomAlertDialogProps {
  isOpen: boolean
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  spacedRepetition?: SpacedRepetitionData
  onClose: () => void
}

export function CustomAlertDialog({
  isOpen,
  type,
  title,
  message,
  spacedRepetition,
  onClose
}: CustomAlertDialogProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Get color schemes based on alert type
  const theme = {
    success: {
      bg: "bg-emerald-950/40 border-emerald-500/30 text-emerald-300",
      accent: "text-emerald-400",
      icon: <CheckCircle2 className="size-12 text-emerald-400" />,
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      button: "bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-emerald-500/20",
      glow: "shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]",
      gradient: "from-emerald-500/20 via-transparent to-transparent",
    },
    error: {
      bg: "bg-rose-950/40 border-rose-500/30 text-rose-300",
      accent: "text-rose-400",
      icon: <XCircle className="size-12 text-rose-400" />,
      badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      button: "bg-rose-500 hover:bg-rose-400 text-rose-950 shadow-rose-500/20",
      glow: "shadow-[0_0_50px_-12px_rgba(244,63,94,0.3)]",
      gradient: "from-rose-500/20 via-transparent to-transparent",
    },
    warning: {
      bg: "bg-amber-950/40 border-amber-500/30 text-amber-300",
      accent: "text-amber-400",
      icon: <AlertCircle className="size-12 text-amber-400" />,
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      button: "bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-amber-500/20",
      glow: "shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)]",
      gradient: "from-amber-500/20 via-transparent to-transparent",
    },
    info: {
      bg: "bg-cyan-950/40 border-cyan-500/30 text-cyan-300",
      accent: "text-cyan-400",
      icon: <AlertCircle className="size-12 text-cyan-400" />,
      badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      button: "bg-cyan-500 hover:bg-cyan-400 text-cyan-950 shadow-cyan-500/20",
      glow: "shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]",
      gradient: "from-cyan-500/20 via-transparent to-transparent",
    }
  }[type]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className={`relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 p-6 text-slate-100 shadow-2xl backdrop-blur-xl ${theme.glow}`}
          >
            {/* Ambient Background Glow Effect */}
            <div className={`absolute -top-40 -left-40 size-80 rounded-full bg-gradient-to-br ${theme.gradient} blur-3xl pointer-events-none`} />

            {/* Header / Icon section */}
            <div className="relative flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.5, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
                className="mb-4 flex size-20 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-inner"
              >
                {theme.icon}
              </motion.div>

              <h3 className="text-xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
                {title}
              </h3>
              
              {!spacedRepetition && (
                <p className="mt-2 text-sm text-slate-400 max-w-sm">
                  {message}
                </p>
              )}
            </div>

            {/* Spaced Repetition Content Detail */}
            {spacedRepetition && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 space-y-4 relative"
              >
                {/* Concept / Lesson Badge */}
                <div className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-400">Học phần</span>
                  </div>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs font-semibold text-slate-200">
                    {spacedRepetition.conceptId}
                  </span>
                </div>

                {/* Selected Answer block */}
                <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                    Phương án của bạn
                  </div>
                  <div className="text-sm font-medium text-slate-300 italic border-l-2 border-white/20 pl-2">
                    "{spacedRepetition.userAnswerDesc}"
                  </div>
                </div>

                {/* Spaced Repetition Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Review Interval */}
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3 flex flex-col justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Kế hoạch ôn tập
                    </span>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className={`text-2xl font-black ${theme.accent}`}>
                        +{spacedRepetition.days}
                      </span>
                      <span className="text-[11px] text-slate-400">ngày</span>
                    </div>
                  </div>

                  {/* Backup Review Date */}
                  <div className="rounded-lg bg-white/5 border border-white/10 p-3 flex flex-col justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Ngày ôn tiếp theo
                    </span>
                    <div className="mt-2 flex items-center gap-1.5 text-slate-200 font-semibold text-sm">
                      <Calendar className="size-4 text-slate-400" />
                      {spacedRepetition.nextReviewDateStr}
                    </div>
                  </div>
                </div>

                {/* Mastery Level Status */}
                <div className="rounded-lg bg-white/5 border border-white/10 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                      <Award className="size-3.5" /> Trạng thái Mastery (Thành thạo)
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                      spacedRepetition.isMastered 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {spacedRepetition.isMastered ? "Đạt ✅" : "Chưa đạt ⚠️"}
                    </span>
                  </div>

                  {/* Modern micro progress bar */}
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: spacedRepetition.isMastered ? "100%" : "33%" }}
                      transition={{ type: "spring", delay: 0.3 }}
                      className={`h-full rounded-full bg-gradient-to-r ${
                        spacedRepetition.isMastered 
                          ? "from-emerald-500 to-teal-400" 
                          : "from-amber-500 to-orange-400"
                      }`}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    {spacedRepetition.isMastered 
                      ? "Tuyệt vời! Bạn đã thành thạo kiến thức học phần này." 
                      : "Cần trả lời đúng liên tục 3 lần để đạt trạng thái thành thạo."}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="mt-6 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`relative flex items-center justify-center gap-1.5 w-full rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer ${theme.button}`}
              >
                Tiếp tục
                <ArrowRight className="size-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
