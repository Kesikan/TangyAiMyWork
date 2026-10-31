import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Product } from '@/types'

const service = vi.hoisted(() => ({
  listProducts: vi.fn(),
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}))

vi.mock('@/services/productService', () => service)

import { useProductStore } from '../productStore'

const product: Product = {
  id: 'p1',
  name: 'Pasta',
  description: 'Fresh pasta',
  price: 18,
  categoryId: 'c1',
  isAvailable: true,
  createdAt: null,
  updatedAt: null,
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  service.listProducts.mockResolvedValue([product])
})

describe('product store', () => {
  it('loads products once and skips redundant loads', async () => {
    const store = useProductStore()
    await store.load()
    await store.load()

    expect(store.items).toEqual([product])
    expect(service.listProducts).toHaveBeenCalledOnce()
    expect(store.error).toBeNull()
  })

  it('can force a reload', async () => {
    const store = useProductStore()
    await store.load()
    await store.load(true)

    expect(service.listProducts).toHaveBeenCalledTimes(2)
  })

  it('records a friendly error if loading fails', async () => {
    const store = useProductStore()
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    service.listProducts.mockRejectedValueOnce(new Error('offline'))

    await store.load()

    expect(store.error).toMatch(/could not load the menu/i)
    expect(store.loading).toBe(false)
    log.mockRestore()
  })

  it('delegates create, update and remove then reloads data', async () => {
    const store = useProductStore()
    const input = {
      name: 'Soup',
      description: 'Tomato',
      price: 7,
      categoryId: 'c1',
      isAvailable: true,
    }
    await store.create(input)
    await store.update('p1', input)
    await store.remove('p1')

    expect(service.createProduct).toHaveBeenCalledWith(input)
    expect(service.updateProduct).toHaveBeenCalledWith('p1', input)
    expect(service.deleteProduct).toHaveBeenCalledWith('p1')
    expect(service.listProducts).toHaveBeenCalledTimes(3)
  })
})
