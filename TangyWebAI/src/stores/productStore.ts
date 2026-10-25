import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Product, ProductInput } from '@/types'
import * as productService from '@/services/productService'

export const useProductStore = defineStore('products', () => {
  const items = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  async function load(force = false) {
    if (loading.value || (loaded.value && !force)) return
    loading.value = true
    error.value = null
    try {
      items.value = await productService.listProducts()
      loaded.value = true
    } catch (e) {
      console.error('Failed to load products', e)
      error.value = 'We could not load the menu. Please try again.'
    } finally {
      loading.value = false
    }
  }

  async function create(input: ProductInput) {
    await productService.createProduct(input)
    await load(true)
  }

  async function update(id: string, input: ProductInput) {
    await productService.updateProduct(id, input)
    await load(true)
  }

  async function remove(id: string) {
    await productService.deleteProduct(id)
    await load(true)
  }

  return { items, loading, error, loaded, load, create, update, remove }
})
