<script setup lang="ts">
import BaseModal from '@/components/base/BaseModal.vue'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'

defineProps<{ product: Product | null; categoryName: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <BaseModal :open="!!product" :title="product?.name ?? ''" size="lg" @close="emit('close')">
    <div v-if="product" class="flex flex-col gap-4">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        class="max-h-80 w-full rounded-card object-cover"
      />
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-900">
          {{ categoryName }}
        </span>
        <span class="text-xl font-semibold text-brand-700">{{ formatPrice(product.price) }}</span>
      </div>
      <p class="whitespace-pre-line text-ink-muted">{{ product.description }}</p>
    </div>
  </BaseModal>
</template>
