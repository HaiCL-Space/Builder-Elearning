import { api } from "@/shared/api"
import { useAuthStore, type AuthUser } from "./auth-store"

const AUTH_REFRESH_TOKEN_KEY = "refreshToken"
const AUTH_USER_KEY = "previewer_auth_user"

let refreshTimeoutId: number | null = null

function scheduleTokenRefresh(expiresInSeconds: number) {
  if (typeof window === "undefined") return
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId)
  }

  // Refresh 30 seconds before the access token expires
  const delayMs = Math.max(10, expiresInSeconds - 30) * 1000

  refreshTimeoutId = window.setTimeout(async () => {
    try {
      const success = await auth.refresh()
      if (!success) {
        console.warn("Auto token refresh failed.")
      }
    } catch (err) {
      console.error("Failed to automatically refresh token:", err)
    }
  }, delayMs)
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const cookies = document.cookie.split("; ")
  for (const cookie of cookies) {
    const [key, ...valParts] = cookie.split("=")
    if (key === name) {
      return decodeURIComponent(valParts.join("="))
    }
  }
  return null
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; max-age=-1; SameSite=Lax`
}

export { useAuthStore }
export type { AuthUser }

export const auth = {
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!useAuthStore.getState().accessToken || !!getCookie(AUTH_REFRESH_TOKEN_KEY)
  },

  getUser(): AuthUser | null {
    return useAuthStore.getState().user
  },

  getAccessToken(): string | null {
    return useAuthStore.getState().accessToken
  },

  hasRefreshToken(): boolean {
    return !!getCookie(AUTH_REFRESH_TOKEN_KEY)
  },

  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      interface LoginApiResponse {
        success: boolean
        message: string
        data: {
          user: AuthUser
          tokens: {
            accessToken: string
            refreshToken: string
            expiresIn: number
          }
        }
      }

      const resData = await api.post<LoginApiResponse>("/auth/login", {
        email,
        password,
      })

      const { user, tokens } = resData.data

      // 1. Save accessToken in memory store (Zustand)
      useAuthStore.getState().setToken(tokens.accessToken)

      // 2. Save user profile in memory and localStorage
      useAuthStore.getState().setUser(user)
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
      }

      // 3. Save refreshToken in cookie
      const maxAge = tokens.expiresIn || 3600
      setCookie(AUTH_REFRESH_TOKEN_KEY, tokens.refreshToken, maxAge)

      // 4. Schedule automatic background token refresh
      scheduleTokenRefresh(maxAge)

      return { success: true, message: resData.message }
    } catch (error: any) {
      console.error("Login API error:", error)
      return {
        success: false,
        message:
          error.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      }
    }
  },

  async refresh(): Promise<boolean> {
    const refreshToken = getCookie(AUTH_REFRESH_TOKEN_KEY)
    if (!refreshToken) return false

    try {
      interface RefreshApiResponse {
        success: boolean
        data: {
          accessToken: string
          refreshToken: string
          expiresIn: number
        }
      }

      const resData = await api.post<RefreshApiResponse>(
        "/auth/refresh-token",
        { refreshToken }
      )

      const tokens = resData.data

      // 1. Update accessToken in memory store (Zustand)
      useAuthStore.getState().setToken(tokens.accessToken)

      // 2. Refresh standard cookie expiration
      const maxAge = tokens.expiresIn || 3600
      setCookie(AUTH_REFRESH_TOKEN_KEY, tokens.refreshToken, maxAge)

      // 3. Schedule next background token refresh
      scheduleTokenRefresh(maxAge)

      return true
    } catch (error) {
      console.error("Token refresh error:", error)
      return false
    }
  },

  logout(): void {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId)
      refreshTimeoutId = null
    }
    useAuthStore.getState().setToken(null)
    useAuthStore.getState().setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_USER_KEY)
    }
    deleteCookie(AUTH_REFRESH_TOKEN_KEY)
  },
}
