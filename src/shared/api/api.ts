import { useAuthStore } from "@/shared/auth"


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/v1"

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options

  // 1. Build URL with query parameters
  let url = `${API_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  // 2. Build default headers
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    accept: "application/json",
  }

  // 3. Automatically inject active JWT token from Zustand store
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    defaultHeaders["Authorization"] = `Bearer ${accessToken}`
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  }

  const response = await fetch(url, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || `API request failed with status ${response.status}`)
  }

  return data as T
}

export const api = {
  get<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "GET" })
  },
  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  },
  put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    })
  },
  delete<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "DELETE" })
  },
}
