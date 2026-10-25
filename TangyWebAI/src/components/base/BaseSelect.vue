<script setup lang="ts">
import { useId } from 'vue'

defineProps<{
  label: string
  error?: string
  disabled?: boolean
  required?: boolean
  hideLabel?: boolean
}>()

const model = defineModel<string>({ default: '' })
const id = useId()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="text-sm font-semibold text-brand-900" :class="{ 'sr-only': hideLabel }">
      {{ label }}<span v-if="required" class="text-danger" aria-hidden="true"> *</span>
    </label>
    <select
      :id="id"
      v-model="model"
      :disabled="disabled"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      class="min-h-11 rounded-xl border border-line bg-white px-4 py-2 text-sm shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
      :class="{ 'border-danger': error }"
    >
      <slot />
    </select>
    <p v-if="error" :id="`${id}-error`" class="text-sm text-danger">{{ error }}</p>
  </div>
</template>
