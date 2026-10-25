<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{
    label: string
    type?: string
    multiline?: boolean
    error?: string
    placeholder?: string
    maxlength?: number
    required?: boolean
    inputmode?: 'text' | 'decimal' | 'numeric' | 'url'
  }>(),
  { type: 'text', multiline: false, required: false, inputmode: 'text' },
)

const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-semibold text-brand-900">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
    </label>
    <textarea
      v-if="multiline"
      :id="id"
      v-model="model"
      rows="4"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="rounded-xl border border-line bg-white px-4 py-2.5 text-sm shadow-sm transition placeholder:text-ink-muted/70 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
      :class="{ 'border-danger': error }"
    />
    <input
      v-else
      :id="id"
      v-model="model"
      :type="type"
      :inputmode="inputmode"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="min-h-11 rounded-xl border border-line bg-white px-4 py-2 text-sm shadow-sm transition placeholder:text-ink-muted/70 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
      :class="{ 'border-danger': error }"
    />
    <p v-if="error" :id="`${id}-error`" class="text-sm text-danger">{{ error }}</p>
  </div>
</template>
