import type { Product } from '@/types'

export const ALL_CATEGORIES = 'all'

export interface ProductFilter {
  search: string
  categoryId: string
  includeUnavailable?: boolean
}

export function filterProducts(products: Product[], filter: ProductFilter): Product[] {
  const term = filter.search.trim().toLowerCase()
  return products.filter((product) => {
    if (!filter.includeUnavailable && !product.isAvailable) return false
    if (filter.categoryId !== ALL_CATEGORIES && product.categoryId !== filter.categoryId) {
      return false
    }
    if (!term) return true
    return (
      product.name.toLowerCase().includes(term) || product.description.toLowerCase().includes(term)
    )
  })
}
