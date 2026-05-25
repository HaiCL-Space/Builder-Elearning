const AUTH_TOKEN_KEY = "previewer_auth_token"
const AUTH_USER_KEY = "previewer_auth_user"

export interface AuthUser {
  username: string
  email: string
}

export const auth = {
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem(AUTH_TOKEN_KEY)
  },

  getUser(): AuthUser | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem(AUTH_USER_KEY)
    if (!userStr) return null
    try {
      return JSON.parse(userStr) as AuthUser
    } catch {
      return null
    }
  },

  login(username: string): boolean {
    if (typeof window === "undefined") return false
    if (!username.trim()) return false

    // Simulate token and user data saving
    localStorage.setItem(AUTH_TOKEN_KEY, "simulated-jwt-token-xyz")
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({
        username: username,
        email: `${username.toLowerCase()}@previewer.com`,
      })
    )
    return true
  },

  logout(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  },
}
