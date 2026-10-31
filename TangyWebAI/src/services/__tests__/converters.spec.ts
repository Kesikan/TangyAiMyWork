import { Timestamp } from 'firebase/firestore'
import { describe, expect, it } from 'vitest'
import { categoryConverter, productConverter } from '../converters'

function snapshot(id: string, value: Record<string, unknown>) {
  return { id, data: () => value } as never
}

describe('Firestore converters', () => {
  it('converts category timestamps and fields', () => {
    const created = Timestamp.fromDate(new Date('2026-01-01T00:00:00Z'))
    const category = categoryConverter.fromFirestore(
      snapshot('category-1', {
        name: 'Entree',
        nameKey: 'entree',
        description: 'Main courses',
        sortOrder: 1,
        createdAt: created,
        updatedAt: 'not-a-timestamp',
      }),
    )

    expect(category).toMatchObject({
      id: 'category-1',
      name: 'Entree',
      nameKey: 'entree',
      description: 'Main courses',
      sortOrder: 1,
      createdAt: created.toDate(),
      updatedAt: null,
    })
  })

  it('converts products, defaults availability, and handles absent timestamps', () => {
    const product = productConverter.fromFirestore(
      snapshot('product-1', {
        name: 'Pasta',
        description: 'Fresh pasta',
        price: 18,
        categoryId: 'category-1',
        isAvailable: undefined,
      }),
    )

    expect(product).toMatchObject({
      id: 'product-1',
      name: 'Pasta',
      isAvailable: true,
      createdAt: null,
      updatedAt: null,
    })
  })

  it('strips document IDs and undefined values on writes', () => {
    expect(categoryConverter.toFirestore({ id: 'category-1', name: 'Entree' } as never)).toEqual({
      name: 'Entree',
    })
    expect(productConverter.toFirestore({ id: 'product-1', imageUrl: undefined } as never)).toEqual(
      {},
    )
  })
})
