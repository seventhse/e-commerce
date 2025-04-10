import { api } from '@/lib/api-client'

export interface Consumer {
  id: string
  username: string
  email: string
  phone?: string
  realName?: string
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface ConsumerListParams {
  page?: number
  pageSize?: number
  username?: string
  email?: string
  phone?: string
  isActive?: boolean
}

export interface ConsumerListResponse {
  items: Consumer[]
  total: number
  page: number
  pageSize: number
}

export interface CreateConsumerDto {
  username: string
  email: string
  phone?: string
  realName?: string
  password: string
  avatar?: string
}

export interface UpdateConsumerDto {
  id: string
  username?: string
  email?: string
  phone?: string
  realName?: string
  password?: string
  avatar?: string
  isActive?: boolean
}

export const ConsumerService = {
  /**
   * Get a list of consumers with pagination
   */
  getConsumers: (params: ConsumerListParams = {}) => {
    return api.get<ConsumerListResponse>('/v1/manage/consumers/page', { params })
  },

  /**
   * Get a consumer by ID
   */
  getConsumerById: (id: string) => {
    return api.get<Consumer>(`/v1/manage/consumers/${id}`)
  },

  /**
   * Create a new consumer
   */
  createConsumer: (data: CreateConsumerDto) => {
    return api.post<void>('/v1/manage/consumers', data)
  },

  /**
   * Update an existing consumer
   */
  updateConsumer: (data: UpdateConsumerDto) => {
    return api.put<void>(`/v1/manage/consumers/${data.id}`, data)
  },

  /**
   * Delete a consumer
   */
  deleteConsumer: (id: string) => {
    return api.delete<void>(`/v1/manage/consumers/${id}`)
  },

  /**
   * Get consumer statistics
   */
  getConsumerStatistics: () => {
    return api.get<{
      totalConsumers: number
      activeConsumers: number
      newConsumersThisMonth: number
      newConsumersLastMonth: number
    }>('/v1/manage/consumers/statistics')
  }
}
