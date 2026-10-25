<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import type { Category, Product, ProductInput } from '@/types'
import { validateProduct, type Errors, type ProductFormValues } from '@/utils/validation'

const props = defineProps<{
  open: boolean
  product: Product | null
  categories: Category[]
  saving: boolean
  submitError: string
}>()
const emit = defineEmits<{ save: [input: ProductInput]; close: []; 'create-category': [] }>()

const form = reactive<ProductFormValues>({
  name: '',
  description: '',
  price: '',
  categoryId: '',
  imageUrl: '',
  isAvailable: true,
})
const errors = ref<Errors<ProductFormValues>>({})

watch(
  () => props.open,
  (open) => {
    if (!open) return
    errors.value = {}
    form.name = props.product?.name ?? ''
    form.description = props.product?.description ?? ''
    form.price = props.product ? String(props.product.price) : ''
    form.categoryId = props.product?.categoryId ?? ''
    form.imageUrl = props.product?.imageUrl ?? ''
    form.isAvailable = props.product?.isAvailable ?? true
  },
  { immediate: true },
)

function submit() {
  errors.value = validateProduct(form)
  if (Object.keys(errors.value).length > 0) return
  const imageUrl = form.imageUrl.trim()
  emit('save', {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    categoryId: form.categoryId,
    isAvailable: form.isAvailable,
    ...(imageUrl ? { imageUrl } : {}),
  })
}
</script>

<template>
  <BaseModal
    :open="open"
    :title="product ? 'Edit product' : 'New product'"
    size="lg"
    @close="!saving && emit('close')"
  >
    <p v-if="categories.length === 0" class="rounded-lg bg-brand-50 p-3 text-sm">
      Create a category first.
      <button type="button" class="font-semibold underline" @click="emit('create-category')">
        Go to categories
      </button>
    </p>
    <form v-else id="product-form" class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <p v-if="submitError" role="alert" class="rounded-lg bg-danger-soft p-3 text-sm text-danger">
        {{ submitError }}
      </p>
      <BaseInput v-model="form.name" label="Name" required :maxlength="100" :error="errors.name" />
      <BaseInput
        v-model="form.description"
        label="Description"
        required
        multiline
        :maxlength="1000"
        :error="errors.description"
      />
      <div class="grid gap-4 sm:grid-cols-2">
        <BaseInput
          v-model="form.price"
          label="Price (USD)"
          required
          inputmode="decimal"
          :error="errors.price"
        />
        <BaseSelect v-model="form.categoryId" label="Category" required :error="errors.categoryId">
          <option value="" disabled>Select a category</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </BaseSelect>
      </div>
      <BaseInput
        v-model="form.imageUrl"
        label="Image URL"
        type="url"
        inputmode="url"
        placeholder="https://..."
        :error="errors.imageUrl"
      />
      <label class="flex items-center gap-2 text-sm font-medium">
        <input v-model="form.isAvailable" type="checkbox" class="size-4 accent-brand-600" />
        Available on the menu
      </label>
    </form>
    <template #footer>
      <BaseButton variant="secondary" :disabled="saving" @click="emit('close')">Cancel</BaseButton>
      <BaseButton v-if="categories.length" type="submit" :loading="saving" @click="submit"
        >Save</BaseButton
      >
    </template>
  </BaseModal>
</template>
