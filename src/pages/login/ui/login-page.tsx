import { useState, type FormEvent } from "react"
import { Lock, Mail, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/ui/card"
import { auth } from "@/shared/auth"

interface LoginPageProps {
  onLoginSuccess: () => void
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password.trim()) {
      setError("Vui lòng điền đầy đủ email và mật khẩu.")
      return
    }

    setIsLoading(true)

    try {
      const result = await auth.login(email, password)
      setIsLoading(false)

      if (result.success) {
        onLoginSuccess()
      } else {
        setError(
          result.message ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
        )
      }
    } catch (err) {
      console.error("Login submission error:", err)
      setIsLoading(false)
      setError("Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.")
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-4">
      {/* Decorative premium background blobs */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/5 blur-3xl" />

      {/* Main Glassmorphic Login Container */}
      <div className="animate-fade-in relative w-full max-w-md duration-500">
        <Card className="border border-white/10 bg-slate-900/60 shadow-2xl shadow-slate-950/80 backdrop-blur-xl">
          <CardHeader className="space-y-1 border-b border-white/5 pb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <LogIn className="h-6 w-6" />
            </div>
            <CardTitle className="font-heading text-2xl font-bold tracking-tight text-white">
              Chào mừng trở lại
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Đăng nhập hệ thống để tiếp tục chỉnh sửa dự án của bạn.
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError(null)
                    }}
                    placeholder="example@gmail.com"
                    className="w-full rounded-lg border border-white/10 bg-slate-950/50 py-2.5 pr-4 pl-10 text-sm text-white placeholder-slate-500 transition duration-250 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                    Mật khẩu
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (error) setError(null)
                    }}
                    placeholder="Nhập mật khẩu của bạn"
                    className="w-full rounded-lg border border-white/10 bg-slate-950/50 py-2.5 pr-10 pl-10 text-sm text-white placeholder-slate-500 transition duration-250 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 transition hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Announcement */}
              {error && (
                <div className="animate-slide-in flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 duration-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="leading-normal">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="mt-2 h-10 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:from-blue-500 hover:to-indigo-500 hover:shadow-indigo-500/30 active:scale-[0.99] disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <span>Đăng nhập</span>
                  </span>
                )}
              </Button>
            </form>
          </CardContent>

          {/* Prompting Default Credentials Footer */}
          <div className="mt-6 rounded-b-xl border-t border-white/5 bg-slate-950/40 p-4 text-center text-[11px] text-slate-500">
            Tài khoản mẫu:{" "}
            <span className="font-semibold text-slate-400">
              hien02@gmail.com
            </span>{" "}
            / Mật khẩu:{" "}
            <span className="font-semibold text-slate-400">12345678</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
