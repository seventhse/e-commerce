import { api } from '@/lib/api-client'

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  price: number
  productImage?: string
}

export interface Order {
  id: string
  orderNumber: string
  consumerId: string
  consumer?: {
    id: string
    username?: string
    email?: string
    phone?: string
  }
  status: OrderStatus
  totalAmount: number
  items: OrderItem[]
  address: string
  phone: string
  paymentMethod?: string
  createdAt: string
  updatedAt: string
  paidAt?: string
  shippedAt?: string
  deliveredAt?: string
  cancelledAt?: string
  refundedAt?: string
}

export interface OrderListParams {
  page?: number
  pageSize?: number
  orderNumber?: string
  consumerId?: string
  status?: OrderStatus
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
}

export interface OrderListResponse {
  items: Order[]
  total: number
  page: number
  pageSize: number
}

export interface UpdateOrderStatusDto {
  id: string
  status: OrderStatus
}

export const OrderService = {
  /**
   * Get a list of orders with pagination
   */
  getOrders: (params: OrderListParams = {}) => {
    return api.get<OrderListResponse>('/v1/manage/orders/page', { params })
  },

  /**
   * Get an order by ID
   */
  getOrderById: (id: string) => {
    return api.get<Order>(`/v1/manage/orders/${id}`)
  },

  /**
   * Update order status
   */
  updateOrderStatus: (data: UpdateOrderStatusDto) => {
    return api.put<void>(`/v1/manage/orders/${data.id}/status`, { status: data.status })
  },

  /**
   * Get order statistics
   */
  getOrderStatistics: (startDate?: string, endDate?: string) => {
    return api.get<{
      totalOrders: number
      totalSales: number
      averageOrderValue: number
      statusCounts: Record<OrderStatus, number>
    }>('/v1/manage/orders/statistics', {
      params: { startDate, endDate }
    })
  }
}
