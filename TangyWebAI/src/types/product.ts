export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  imageUrl?: string
  isAvailable: boolean
  createdAt: Date | null
  updatedAt: Date | null
}

export interface ProductInput {
  name: string
  description: string
  price: number
  categoryId: string
  imageUrl?: string
  isAvailable: boolean
}
