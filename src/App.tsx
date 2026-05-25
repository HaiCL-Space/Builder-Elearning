import { useState, useEffect } from "react"
import { BuilderPage } from "./pages/builder"
import { ViewerPage } from "./pages/viewer"
import { LoginPage } from "@/pages/login"
import { auth } from "@/shared/auth"

export function App() {
  const [pathname, setPathname] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  )
  const [isResolvingAuth, setIsResolvingAuth] = useState(true)

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname)
    }
    window.addEventListener("popstate", handlePopState)

    // Attempt to silently restore the session on initial app load if a refresh token exists
    const restoreSession = async () => {
      const hasToken = auth.hasRefreshToken()
      console.log("[App Init] Checking refresh token cookie in document.cookie:", document.cookie)
      console.log("[App Init] auth.hasRefreshToken():", hasToken)
      
      if (hasToken) {
        try {
          console.log("[App Init] Refresh token detected. Requesting silent token refresh...")
          const success = await auth.refresh()
          console.log("[App Init] Silent refresh success status:", success)
        } catch (err) {
          console.error("[App Init] Failed to restore session on app boot:", err)
        }
      } else {
        console.log("[App Init] No refresh token found. Redirecting to login if needed.")
      }
      setIsResolvingAuth(false)
    }
    restoreSession()

    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const navigate = (path: string) => {
    window.history.pushState(null, "", path)
    setPathname(path)
  }

  const handleLogout = () => {
    auth.logout()
    window.history.replaceState(null, "", "/login")
    setPathname("/login")
  }

  // Display a dark premium loading page during initial authentication check
  if (isResolvingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-blue-500" />
          <span className="text-xs font-medium tracking-wide">Đang xác thực phiên làm việc...</span>
        </div>
      </div>
    )
  }

  // Auth Guards and Route Resolution during render
  const isLoggedIn = auth.isAuthenticated()
  let resolvedPath = pathname

  if (resolvedPath === "/") {
    resolvedPath = "/edit"
  }

  if (resolvedPath === "/edit" && !isLoggedIn) {
    resolvedPath = "/login"
  } else if (resolvedPath === "/login" && isLoggedIn) {
    resolvedPath = "/edit"
  }

  // If a guard redirects, update state and browser history synchronously during render.
  // React will immediately trigger a re-render with the new state, avoiding layout shifts.
  if (resolvedPath !== pathname) {
    setPathname(resolvedPath)
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", resolvedPath)
    }
  }

  // Router Rendering
  if (resolvedPath.startsWith("/viewer")) {
    return <ViewerPage />
  }

  if (resolvedPath === "/login") {
    return <LoginPage onLoginSuccess={() => navigate("/edit")} />
  }

  if (resolvedPath === "/edit") {
    return <BuilderPage onLogout={handleLogout} />
  }

  // Fallback / Redirect state
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-blue-500" />
        <span className="text-xs">Đang chuyển hướng...</span>
      </div>
    </div>
  )
}

export default App
