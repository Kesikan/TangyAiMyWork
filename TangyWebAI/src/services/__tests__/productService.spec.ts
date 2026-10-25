import { beforeEach, describe, expect, it, vi } from 'vitest'

const firestore = vi.hoisted(() => ({
  collection: vi.fn(() => ({ withConverter: () => ({ kind: 'collection' }) })),
  doc: vi.fn(() => ({
    id: 'new-id',
    withConverter() {
      return this
    },
  })),
  deleteDoc: vi.fn(),
  deleteField: vi.fn(() => 'DELETE'),
  getCountFromServer: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(() => 'TS'),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  where: vi.fn(),
}))

vi.mock('firebase/firestore', () => firestore)
vi.mock('@/firebase', () => ({ db: {} }))
vi.mock('../converters', () => ({ productConverter: {} }))

import {
  countProductsByCategory,
  createProduct,
  listProducts,
  updateProduct,
} from '../productService'

const input = {
  name: '  Soup ',
  description: ' Tomato ',
  price: 6.5,
  categoryId: 'c1',
  imageUrl: '  ',
  isAvailable: true,
}

beforeEach(() => vi.clearAllMocks())

describe('productService', () => {
  it('lists products from converted documents', async () => {
    firestore.getDocs.mockResolvedValue({ docs: [{ data: () => ({ id: '1' }) }] })

    await expect(listProducts()).resolves.toEqual([{ id: '1' }])
  })

  it('trims fields and omits an empty image URL on create', async () => {
    await expect(createProduct(input)).resolves.toBe('new-id')

    const written = firestore.setDoc.mock.calls[0]?.[1]
    expect(written).toMatchObject({ name: 'Soup', description: 'Tomato', createdAt: 'TS' })
    expect(written).not.toHaveProperty('imageUrl')
  })

  it('removes the image URL field on update when cleared', async () => {
    await updateProduct('p1', input)

    expect(firestore.updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ imageUrl: 'DELETE', updatedAt: 'TS' }),
    )
  })

  it('counts products for a category', async () => {
    firestore.getCountFromServer.mockResolvedValue({ data: () => ({ count: 4 }) })

    await expect(countProductsByCategory('c1')).resolves.toBe(4)
  })
})
