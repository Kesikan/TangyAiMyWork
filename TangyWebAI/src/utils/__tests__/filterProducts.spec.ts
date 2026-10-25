import { describe, expect, it } from 'vitest'
import type { Product } from '@/types'
import { ALL_CATEGORIES, filterProducts } from '../filterProducts'

function product(overrides: Partial<Product>): Product {
  return {
    id: 'p',
    name: 'Item',
    description: 'Description',
    price: 5,
    categoryId: 'c1',
    isAvailable: true,
    createdAt: null,
    updatedAt: null,
    ...overrides,
  }
}

const products = [
  product({
    id: '1',
    name: 'Grilled Salmon',
    description: 'With citrus butter',
    categoryId: 'mains',
  }),
  product({ id: '2', name: 'Lemonade', description: 'Fresh squeezed lemon', categoryId: 'drinks' }),
  product({ id: '3', name: 'Tart', description: 'Sharp LEMON curd', categoryId: 'desserts' }),
  product({ id: '4', name: 'Hidden dish', categoryId: 'mains', isAvailable: false }),
]

const ids = (list: Product[]) => list.map((p) => p.id)

describe('filterProducts', () => {
  it('returns every available product for All with no search', () => {
    expect(ids(filterProducts(products, { search: '', categoryId: ALL_CATEGORIES }))).toEqual([
      '1',
      '2',
      '3',
    ])
  })

  it('matches on name, case-insensitively and partially', () => {
    expect(ids(filterProducts(products, { search: 'SALM', categoryId: ALL_CATEGORIES }))).toEqual([
      '1',
    ])
  })

  it('matches on description only', () => {
    expect(ids(filterProducts(products, { search: 'citrus', categoryId: ALL_CATEGORIES }))).toEqual(
      ['1'],
    )
  })

  it('matches name OR description', () => {
    expect(ids(filterProducts(products, { search: 'lemon', categoryId: ALL_CATEGORIES }))).toEqual([
      '2',
      '3',
    ])
  })

  it('combines search with category using AND', () => {
    expect(ids(filterProducts(products, { search: 'lemon', categoryId: 'drinks' }))).toEqual(['2'])
  })

  it('filters by category alone', () => {
    expect(ids(filterProducts(products, { search: '  ', categoryId: 'desserts' }))).toEqual(['3'])
  })

  it('hides unavailable products unless requested', () => {
    expect(ids(filterProducts(products, { search: '', categoryId: 'mains' }))).toEqual(['1'])
    expect(
      ids(filterProducts(products, { search: '', categoryId: 'mains', includeUnavailable: true })),
    ).toEqual(['1', '4'])
  })
})
