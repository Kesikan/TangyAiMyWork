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
vi.mock('../converters', () => ({ categoryConverter: {} }))
vi.mock('../productService', () => ({ countProductsByCategory: vi.fn() }))

import { createCategory, deleteCategory, toNameKey, updateCategory } from '../categoryService'
import { CategoryInUseError, DuplicateCategoryNameError } from '../errors'
import { countProductsByCategory } from '../productService'

const noMatches = { docs: [] }

beforeEach(() => {
  vi.clearAllMocks()
  firestore.getDocs.mockResolvedValue(noMatches)
})

describe('toNameKey', () => {
  it('trims and lowercases', () => {
    expect(toNameKey('  Main Dishes ')).toBe('main dishes')
  })
})

describe('deleteCategory', () => {
  it('blocks deletion when products still use the category', async () => {
    vi.mocked(countProductsByCategory).mockResolvedValue(3)

    const result = deleteCategory('c1')

    await expect(result).rejects.toBeInstanceOf(CategoryInUseError)
    await expect(result).rejects.toThrow('Reassign or delete its 3 products first.')
    expect(firestore.deleteDoc).not.toHaveBeenCalled()
  })

  it('deletes when the category has no products', async () => {
    vi.mocked(countProductsByCategory).mockResolvedValue(0)

    await deleteCategory('c1')

    expect(firestore.deleteDoc).toHaveBeenCalledOnce()
  })
})

describe('category name uniqueness', () => {
  it('rejects creating a duplicate name', async () => {
    firestore.getDocs.mockResolvedValue({ docs: [{ id: 'existing' }] })

    await expect(createCategory({ name: 'Drinks', sortOrder: 1 })).rejects.toBeInstanceOf(
      DuplicateCategoryNameError,
    )
    expect(firestore.setDoc).not.toHaveBeenCalled()
  })

  it('stores a trimmed name and lowercase key on create', async () => {
    await createCategory({ name: '  Drinks ', sortOrder: 1 })

    expect(firestore.setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'Drinks', nameKey: 'drinks', sortOrder: 1 }),
    )
  })

  it('allows an update to keep its own name', async () => {
    firestore.getDocs.mockResolvedValue({ docs: [{ id: 'c1' }] })

    await updateCategory('c1', { name: 'Drinks', sortOrder: 2 })

    expect(firestore.updateDoc).toHaveBeenCalledOnce()
  })

  it('rejects renaming to another category name', async () => {
    firestore.getDocs.mockResolvedValue({ docs: [{ id: 'other' }] })

    await expect(updateCategory('c1', { name: 'Drinks', sortOrder: 2 })).rejects.toBeInstanceOf(
      DuplicateCategoryNameError,
    )
  })
})
