import { create } from "zustand"

export interface AuthUser {
  id: string
  email: string
  name: string
  phoneNumber?: string
  gender?: string
  avatar?: string
  bod?: string
  provider?: string
  createdAt?: string
}

interface AuthState {
  accessToken: string | null
  user: AuthUser | null
  setToken: (token: string | null) => void
  setUser: (user: AuthUser | null) => void
}

const AUTH_USER_KEY = "previewer_auth_user"

const getInitialUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem(AUTH_USER_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr) as AuthUser
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: getInitialUser(),
  setToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
}))
