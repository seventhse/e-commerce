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
  mainImage?: string
  images?: ProductImage[]
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id?: string
  image: string
  sortOrder?: number
  alt?: string
  commodityId?: string
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
    return api.get<ProductListResponse>('/v1/manage/commodity/page', { params })
  },

  /**
   * Get all products (no pagination)
   */
  getAllProducts: (params: Omit<ProductListParams, 'page' | 'pageSize'> = {}) => {
    return api.get<Product[]>('/v1/manage/commodity/list', { params })
  },

  /**
   * Get a product by ID
   */
  getProductById: (id: string) => {
    return api.get<Product>(`/v1/manage/commodity/detail/${id}`)
  },

  /**
   * Create a new product
   */
  createProduct: (data: CreateProductDto) => {
    return api.post<void>('/v1/manage/commodity/create', data)
  },

  /**
   * Update an existing product
   */
  updateProduct: (data: UpdateProductDto) => {
    return api.post<void>('/v1/manage/commodity/update', data)
  },

  /**
   * Delete a product
   */
  deleteProduct: (id: string) => {
    return api.post<void>('/v1/manage/commodity/delete', { id })
  },

  /**
   * Get all categories
   */
  getCategories: () => {
    return api.get<Category[]>('/v1/manage/commodity-category/list')
  },

  /**
   * Get categories with pagination
   */
  getCategoriesPage: (params: { page?: number, pageSize?: number, name?: string } = {}) => {
    return api.get<{ items: Category[], total: number, page: number, pageSize: number }>('/v1/manage/commodity-category/page', { params })
  },

  /**
   * Get a category by ID
   */
  getCategoryById: (id: string) => {
    return api.get<Category>(`/v1/manage/commodity-category/detail/${id}`)
  },

  /**
   * Create a new category
   */
  createCategory: (data: Omit<Category, 'id'>) => {
    return api.post<void>('/v1/manage/commodity-category/create', data)
  },

  /**
   * Update an existing category
   */
  updateCategory: (data: Category) => {
    return api.post<void>('/v1/manage/commodity-category/update', data)
  },

  /**
   * Delete a category
   */
  deleteCategory: (id: string) => {
    return api.post<void>('/v1/manage/commodity-category/delete', { id })
  }
}
