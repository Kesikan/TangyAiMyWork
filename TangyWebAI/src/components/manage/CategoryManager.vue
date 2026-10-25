<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ConfirmDialog from '@/components/base/ConfirmDialog.vue'
import ErrorMessage from '@/components/base/ErrorMessage.vue'
import Spinner from '@/components/base/Spinner.vue'
import CategoryFormModal from '@/components/manage/CategoryFormModal.vue'
import { useToast } from '@/composables/useToast'
import { CategoryInUseError, DuplicateCategoryNameError } from '@/services/errors'
import { useCategoryStore } from '@/stores/categoryStore'
import { useProductStore } from '@/stores/productStore'
import type { Category, CategoryInput } from '@/types'

const categoryStore = useCategoryStore()
const productStore = useProductStore()
const toast = useToast()

const formOpen = ref(false)
const editing = ref<Category | null>(null)
const saving = ref(false)
const submitError = ref('')
const deleting = ref<Category | null>(null)
const deletingBusy = ref(false)

const productCounts = computed(() => {
  const counts = new Map<string, number>()
  for (const product of productStore.items) {
    counts.set(product.categoryId, (counts.get(product.categoryId) ?? 0) + 1)
  }
  return counts
})

const nextSortOrder = computed(
  () => Math.max(0, ...categoryStore.items.map((category) => category.sortOrder)) + 1,
)

function openCreate() {
  editing.value = null
  submitError.value = ''
  formOpen.value = true
}

function openEdit(category: Category) {
  editing.value = category
  submitError.value = ''
  formOpen.value = true
}

async function save(input: CategoryInput) {
  saving.value = true
  submitError.value = ''
  try {
    if (editing.value) await categoryStore.update(editing.value.id, input)
    else await categoryStore.create(input)
    toast.success(editing.value ? 'Category updated.' : 'Category created.')
    formOpen.value = false
  } catch (e) {
    if (e instanceof DuplicateCategoryNameError) submitError.value = e.message
    else {
      console.error('Failed to save category', e)
      submitError.value = 'We could not save the category. Please try again.'
      toast.error('Saving the category failed.')
    }
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!deleting.value) return
  deletingBusy.value = true
  try {
    await categoryStore.remove(deleting.value.id)
    toast.success('Category deleted.')
  } catch (e) {
    if (e instanceof CategoryInUseError) toast.error(e.message)
    else {
      console.error('Failed to delete category', e)
      toast.error('Deleting the category failed.')
    }
  } finally {
    deletingBusy.value = false
    deleting.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-4">
      <h2 class="font-display text-xl font-semibold">Categories</h2>
      <BaseButton @click="openCreate">Add category</BaseButton>
    </div>

    <div
      v-if="categoryStore.loading && !categoryStore.items.length"
      class="flex justify-center py-10"
    >
      <Spinner label="Loading categories" />
    </div>
    <ErrorMessage
      v-else-if="categoryStore.error"
      :message="categoryStore.error"
      @retry="categoryStore.load(true)"
    />
    <p
      v-else-if="!categoryStore.items.length"
      class="rounded-card border border-dashed border-line p-8 text-center text-ink-muted"
    >
      No categories yet. Add one to get started.
    </p>
    <div v-else class="overflow-x-auto rounded-card border border-line">
      <table class="w-full min-w-[36rem] text-left text-sm">
        <thead class="bg-brand-50">
          <tr>
            <th scope="col" class="p-3">Name</th>
            <th scope="col" class="p-3">Description</th>
            <th scope="col" class="p-3">Products</th>
            <th scope="col" class="p-3">Order</th>
            <th scope="col" class="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in categoryStore.items"
            :key="category.id"
            class="border-t border-line"
          >
            <th scope="row" class="p-3 font-medium">{{ category.name }}</th>
            <td class="p-3 text-ink-muted">{{ category.description }}</td>
            <td class="p-3">{{ productCounts.get(category.id) ?? 0 }}</td>
            <td class="p-3">{{ category.sortOrder }}</td>
            <td class="p-3">
              <div class="flex justify-end gap-2">
                <BaseButton
                  variant="secondary"
                  :aria-label="`Edit ${category.name}`"
                  @click="openEdit(category)"
                  >Edit</BaseButton
                >
                <BaseButton
                  variant="danger"
                  :aria-label="`Delete ${category.name}`"
                  @click="deleting = category"
                  >Delete</BaseButton
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <CategoryFormModal
      :open="formOpen"
      :category="editing"
      :saving="saving"
      :submit-error="submitError"
      :next-sort-order="nextSortOrder"
      @save="save"
      @close="formOpen = false"
    />
    <ConfirmDialog
      :open="!!deleting"
      title="Delete category"
      :message="`Delete &quot;${deleting?.name ?? ''}&quot;? This cannot be undone.`"
      :loading="deletingBusy"
      @confirm="confirmDelete"
      @cancel="deleting = null"
    />
  </div>
</template>
