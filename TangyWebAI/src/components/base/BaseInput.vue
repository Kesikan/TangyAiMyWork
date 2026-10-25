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
  <div class="flex flex-col gap-1">
    <label :for="id" class="text-sm font-medium">
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
      class="rounded-lg border border-line bg-white px-3 py-2 text-sm"
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
      class="min-h-10 rounded-lg border border-line bg-white px-3 py-2 text-sm"
      :class="{ 'border-danger': error }"
    />
    <p v-if="error" :id="`${id}-error`" class="text-sm text-danger">{{ error }}</p>
  </div>
</template>
