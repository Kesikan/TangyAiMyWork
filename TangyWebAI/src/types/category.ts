export interface Category {
  id: string
  name: string
  /** Lowercased, trimmed name used for case-insensitive uniqueness checks. */
  nameKey: string
  description?: string
  sortOrder: number
  createdAt: Date | null
  updatedAt: Date | null
}

export interface CategoryInput {
  name: string
  description?: string
  sortOrder: number
}
