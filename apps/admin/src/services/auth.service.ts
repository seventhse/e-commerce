import { api } from '@/lib/api-client'

export interface SignInCredentials {
  account: string
  password: string
  type?: 'username' | 'email' | 'phone'
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface UserInfo {
  id: string
  username: string
  email: string
  realName: string
  isActive: boolean
  roles?: string[]
  permissions?: string[]
}

export const AuthService = {
  /**
   * Sign in with credentials
   */
  signIn: (credentials: SignInCredentials) => {
    return api.post<AuthTokens>('/v1/manage/auth/signIn', credentials)
  },

  /**
   * Sign out the current user
   */
  signOut: () => {
    return api.get('/v1/manage/auth/signOut')
  },

  /**
   * Get current user information
   */
  getUserInfo: () => {
    return api.get<UserInfo>('/v1/manage/auth/getUserInfo')
  },

  /**
   * Refresh the access token
   */
  refreshToken: () => {
    return api.get<AuthTokens>('/v1/manage/auth/refreshToken')
  }
}
