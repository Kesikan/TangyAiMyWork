<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import ConfirmDialog from '@/components/base/ConfirmDialog.vue'
import ErrorMessage from '@/components/base/ErrorMessage.vue'
import Spinner from '@/components/base/Spinner.vue'
import ProductFormModal from '@/components/manage/ProductFormModal.vue'
import { useToast } from '@/composables/useToast'
import { useCategoryStore } from '@/stores/categoryStore'
import { useProductStore } from '@/stores/productStore'
import type { Product, ProductInput } from '@/types'
import { ALL_CATEGORIES, filterProducts } from '@/utils/filterProducts'
import { formatPrice } from '@/utils/format'

const emit = defineEmits<{ 'go-categories': [] }>()

const categoryStore = useCategoryStore()
const productStore = useProductStore()
const toast = useToast()

const search = ref('')
const categoryId = ref(ALL_CATEGORIES)
const formOpen = ref(false)
const editing = ref<Product | null>(null)
const saving = ref(false)
const submitError = ref('')
const deleting = ref<Product | null>(null)
const deletingBusy = ref(false)

const categoryNames = computed(
  () => new Map(categoryStore.items.map((category) => [category.id, category.name])),
)
const rows = computed(() =>
  filterProducts(productStore.items, {
    search: search.value,
    categoryId: categoryId.value,
    includeUnavailable: true,
  }),
)

function openCreate() {
  editing.value = null
  submitError.value = ''
  formOpen.value = true
}

function openEdit(product: Product) {
  editing.value = product
  submitError.value = ''
  formOpen.value = true
}

function goToCategories() {
  formOpen.value = false
  emit('go-categories')
}

async function save(input: ProductInput) {
  saving.value = true
  submitError.value = ''
  try {
    if (editing.value) await productStore.update(editing.value.id, input)
    else await productStore.create(input)
    toast.success(editing.value ? 'Product updated.' : 'Product created.')
    formOpen.value = false
  } catch (e) {
    console.error('Failed to save product', e)
    submitError.value = 'We could not save the product. Please try again.'
    toast.error('Saving the product failed.')
  } finally {
    saving.value = false
  }
}

async function confirmDelete() {
  if (!deleting.value) return
  deletingBusy.value = true
  try {
    await productStore.remove(deleting.value.id)
    toast.success('Product deleted.')
  } catch (e) {
    console.error('Failed to delete product', e)
    toast.error('Deleting the product failed.')
  } finally {
    deletingBusy.value = false
    deleting.value = null
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between gap-4">
      <h2 class="font-display text-xl font-semibold">Products</h2>
      <BaseButton @click="openCreate">Add product</BaseButton>
    </div>

    <div class="grid gap-4 sm:grid-cols-[1fr_14rem]">
      <BaseInput v-model="search" label="Search products" type="search" />
      <BaseSelect v-model="categoryId" label="Category">
        <option :value="ALL_CATEGORIES">All</option>
        <option v-for="category in categoryStore.items" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </BaseSelect>
    </div>

    <div
      v-if="productStore.loading && !productStore.items.length"
      class="flex justify-center py-10"
    >
      <Spinner label="Loading products" />
    </div>
    <ErrorMessage
      v-else-if="productStore.error"
      :message="productStore.error"
      @retry="productStore.load(true)"
    />
    <p
      v-else-if="!rows.length"
      class="rounded-card border border-dashed border-line p-8 text-center text-ink-muted"
    >
      No products found.
    </p>
    <div v-else class="overflow-x-auto rounded-card border border-line">
      <table class="w-full min-w-[40rem] text-left text-sm">
        <thead class="bg-brand-50">
          <tr>
            <th scope="col" class="p-3">Name</th>
            <th scope="col" class="p-3">Category</th>
            <th scope="col" class="p-3">Price</th>
            <th scope="col" class="p-3">Status</th>
            <th scope="col" class="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in rows" :key="product.id" class="border-t border-line">
            <th scope="row" class="p-3 font-medium">{{ product.name }}</th>
            <td class="p-3">{{ categoryNames.get(product.categoryId) ?? 'Uncategorized' }}</td>
            <td class="p-3">{{ formatPrice(product.price) }}</td>
            <td class="p-3">{{ product.isAvailable ? 'Available' : 'Hidden' }}</td>
            <td class="p-3">
              <div class="flex justify-end gap-2">
                <BaseButton
                  variant="secondary"
                  :aria-label="`Edit ${product.name}`"
                  @click="openEdit(product)"
                  >Edit</BaseButton
                >
                <BaseButton
                  variant="danger"
                  :aria-label="`Delete ${product.name}`"
                  @click="deleting = product"
                  >Delete</BaseButton
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProductFormModal
      :open="formOpen"
      :product="editing"
      :categories="categoryStore.items"
      :saving="saving"
      :submit-error="submitError"
      @save="save"
      @close="formOpen = false"
      @create-category="goToCategories"
    />
    <ConfirmDialog
      :open="!!deleting"
      title="Delete product"
      :message="`Delete &quot;${deleting?.name ?? ''}&quot;? This cannot be undone.`"
      :loading="deletingBusy"
      @confirm="confirmDelete"
      @cancel="deleting = null"
    />
  </div>
</template>
