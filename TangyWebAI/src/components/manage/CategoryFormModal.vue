<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import type { Category, CategoryInput } from '@/types'
import { validateCategory, type CategoryFormValues, type Errors } from '@/utils/validation'

const props = defineProps<{
  open: boolean
  category: Category | null
  saving: boolean
  submitError: string
  nextSortOrder: number
}>()
const emit = defineEmits<{ save: [input: CategoryInput]; close: [] }>()

const form = reactive<CategoryFormValues>({ name: '', description: '', sortOrder: '0' })
const errors = ref<Errors<CategoryFormValues>>({})

watch(
  () => props.open,
  (open) => {
    if (!open) return
    errors.value = {}
    form.name = props.category?.name ?? ''
    form.description = props.category?.description ?? ''
    form.sortOrder = String(props.category?.sortOrder ?? props.nextSortOrder)
  },
  { immediate: true },
)

function submit() {
  errors.value = validateCategory(form)
  if (Object.keys(errors.value).length > 0) return
  emit('save', {
    name: form.name.trim(),
    description: form.description.trim() || undefined,
    sortOrder: Number(form.sortOrder),
  })
}
</script>

<template>
  <BaseModal
    :open="open"
    :title="category ? 'Edit category' : 'New category'"
    @close="!saving && emit('close')"
  >
    <form id="category-form" class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <p v-if="submitError" role="alert" class="rounded-lg bg-danger-soft p-3 text-sm text-danger">
        {{ submitError }}
      </p>
      <BaseInput v-model="form.name" label="Name" required :maxlength="60" :error="errors.name" />
      <BaseInput
        v-model="form.description"
        label="Description"
        multiline
        :maxlength="300"
        :error="errors.description"
      />
      <BaseInput
        v-model="form.sortOrder"
        label="Sort order"
        inputmode="numeric"
        :error="errors.sortOrder"
      />
    </form>
    <template #footer>
      <BaseButton variant="secondary" :disabled="saving" @click="emit('close')">Cancel</BaseButton>
      <BaseButton type="submit" :loading="saving" @click="submit">Save</BaseButton>
    </template>
  </BaseModal>
</template>
