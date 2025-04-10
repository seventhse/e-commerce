import { api } from '@/lib/api-client'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  isActive: boolean
  categoryId: string
  category?: Category
  images?: string[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
}

export interface ProductListParams {
  page?: number
  pageSize?: number
  name?: string
  categoryId?: string
  isActive?: boolean
  minPrice?: number
  maxPrice?: number
}

export interface ProductListResponse {
  items: Product[]
  total: number
  page: number
  pageSize: number
}

export interface CreateProductDto {
  name: string
  description: string
  price: number
  stock: number
  isActive?: boolean
  categoryId: string
  images?: string[]
}

export interface UpdateProductDto {
  id: string
  name?: string
  description?: string
  price?: number
  stock?: number
  isActive?: boolean
  categoryId?: string
  images?: string[]
}

export const ProductService = {
  /**
   * Get a list of products with pagination
   */
  getProducts: (params: ProductListParams = {}) => {
    return api.get<ProductListResponse>('/v1/manage/products/page', { params })
  },

  /**
   * Get a product by ID
   */
  getProductById: (id: string) => {
    return api.get<Product>(`/v1/manage/products/${id}`)
  },

  /**
   * Create a new product
   */
  createProduct: (data: CreateProductDto) => {
    return api.post<void>('/v1/manage/products', data)
  },

  /**
   * Update an existing product
   */
  updateProduct: (data: UpdateProductDto) => {
    return api.put<void>(`/v1/manage/products/${data.id}`, data)
  },

  /**
   * Delete a product
   */
  deleteProduct: (id: string) => {
    return api.delete<void>(`/v1/manage/products/${id}`)
  },

  /**
   * Get all categories
   */
  getCategories: () => {
    return api.get<Category[]>('/v1/manage/categories')
  },

  /**
   * Create a new category
   */
  createCategory: (data: Omit<Category, 'id'>) => {
    return api.post<void>('/v1/manage/categories', data)
  },

  /**
   * Update an existing category
   */
  updateCategory: (data: Category) => {
    return api.put<void>(`/v1/manage/categories/${data.id}`, data)
  },

  /**
   * Delete a category
   */
  deleteCategory: (id: string) => {
    return api.delete<void>(`/v1/manage/categories/${id}`)
  }
}
