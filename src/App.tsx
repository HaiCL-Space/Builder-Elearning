import { useState, useEffect } from "react"
import { BuilderPage } from "./pages/builder"
import { ViewerPage } from "./pages/viewer"
import { LoginPage } from "@/pages/login"
import { auth } from "@/shared/lib/auth"

export function App() {
  const [pathname, setPathname] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  )

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname)
    }
    window.addEventListener("popstate", handlePopState)
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

  // Dynamic Loading/Fallback state
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500">
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        <span className="text-xs">Đang chuyển hướng...</span>
      </div>
    </div>
  )
}

export default App
