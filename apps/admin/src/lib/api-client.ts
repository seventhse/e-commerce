import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { AuthService } from '@/services'

// Define the base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10086/api'

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== 200) {
      return Promise.reject(data)
    }

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshResponse = await AuthService.refreshToken()
        const { access_token } = refreshResponse

        // Update the tokens in the store
        useAuthStore.getState().auth.setAccessToken(access_token)
        // Store the refresh token if needed in the future
        // Currently, the refresh token is automatically included in the request by the server

        // Retry the original request with the new token
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${access_token}`,
        }

        return apiClient(originalRequest)
      } catch (refreshError) {
        // If refresh token fails, logout the user
        useAuthStore.getState().auth.reset()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Generic request function with type safety
export const request = async <T = unknown>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<{
      code: number
      data: T
      message: string
      timestamp: string
    }> = await apiClient(config)

    return response.data.data
  } catch (error) {
    return Promise.reject(error)
  }
}

// Export HTTP methods with type safety
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'GET', url }),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data }),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PUT', url, data }),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
}

export default apiClient
