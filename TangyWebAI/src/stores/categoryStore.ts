import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Category, CategoryInput } from '@/types'
import * as categoryService from '@/services/categoryService'

export const useCategoryStore = defineStore('categories', () => {
  const items = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  async function load(force = false) {
    if (loading.value || (loaded.value && !force)) return
    loading.value = true
    error.value = null
    try {
      items.value = await categoryService.listCategories()
      loaded.value = true
    } catch (e) {
      console.error('Failed to load categories', e)
      error.value = 'We could not load the categories. Please try again.'
    } finally {
      loading.value = false
    }
  }

  async function create(input: CategoryInput) {
    await categoryService.createCategory(input)
    await load(true)
  }

  async function update(id: string, input: CategoryInput) {
    await categoryService.updateCategory(id, input)
    await load(true)
  }

  async function remove(id: string) {
    await categoryService.deleteCategory(id)
    await load(true)
  }

  return { items, loading, error, loaded, load, create, update, remove }
})
