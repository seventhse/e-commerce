import { api } from '@/lib/api-client'

export interface User {
  id: string
  username: string
  email: string
  realName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  roles?: Role[]
}

export interface Role {
  id: string
  name: string
  description?: string
}

export interface UserListParams {
  page?: number
  pageSize?: number
  username?: string
  email?: string
  isActive?: boolean
}

export interface UserListResponse {
  items: User[]
  total: number
  page: number
  pageSize: number
}

export interface CreateUserDto {
  username: string
  email: string
  realName?: string
  password: string
  roleIds?: string[]
}

export interface UpdateUserDto {
  id: string
  username?: string
  email?: string
  realName?: string
  password?: string
  isActive?: boolean
  roleIds?: string[]
}

export const UserService = {
  /**
   * Get a list of users with pagination
   */
  getUsers: (params: UserListParams = {}) => {
    return api.get<UserListResponse>('/v1/manage/users/page', { params })
  },

  /**
   * Get a user by ID
   */
  getUserById: (id: string) => {
    return api.get<User>(`/v1/manage/users/${id}`)
  },

  /**
   * Create a new user
   */
  createUser: (data: CreateUserDto) => {
    return api.post<void>('/v1/manage/users', data)
  },

  /**
   * Update an existing user
   */
  updateUser: (data: UpdateUserDto) => {
    return api.put<void>(`/v1/manage/users/${data.id}`, data)
  },

  /**
   * Delete a user
   */
  deleteUser: (id: string) => {
    return api.delete<void>(`/v1/manage/users/${id}`)
  },

  /**
   * Get all roles
   */
  getRoles: () => {
    return api.get<Role[]>('/v1/manage/roles')
  }
}
