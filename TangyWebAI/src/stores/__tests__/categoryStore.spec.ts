import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Category } from '@/types'

const service = vi.hoisted(() => ({
  listCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}))

vi.mock('@/services/categoryService', () => service)

import { useCategoryStore } from '../categoryStore'

const category: Category = {
  id: 'c1',
  name: 'Entree',
  nameKey: 'entree',
  sortOrder: 1,
  createdAt: null,
  updatedAt: null,
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  service.listCategories.mockResolvedValue([category])
})

describe('category store', () => {
  it('loads categories once and skips redundant loads', async () => {
    const store = useCategoryStore()
    await store.load()
    await store.load()

    expect(store.items).toEqual([category])
    expect(service.listCategories).toHaveBeenCalledOnce()
    expect(store.error).toBeNull()
  })

  it('can force a reload', async () => {
    const store = useCategoryStore()
    await store.load()
    await store.load(true)

    expect(service.listCategories).toHaveBeenCalledTimes(2)
  })

  it('records a friendly error if loading fails', async () => {
    const store = useCategoryStore()
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    service.listCategories.mockRejectedValueOnce(new Error('offline'))

    await store.load()

    expect(store.error).toMatch(/could not load the categories/i)
    expect(store.loading).toBe(false)
    log.mockRestore()
  })

  it('delegates create, update and remove then reloads data', async () => {
    const store = useCategoryStore()
    const input = { name: 'Dessert', sortOrder: 2 }
    await store.create(input)
    await store.update('c1', input)
    await store.remove('c1')

    expect(service.createCategory).toHaveBeenCalledWith(input)
    expect(service.updateCategory).toHaveBeenCalledWith('c1', input)
    expect(service.deleteCategory).toHaveBeenCalledWith('c1')
    expect(service.listCategories).toHaveBeenCalledTimes(3)
  })
})
