<script setup lang="ts">
import BaseModal from '@/components/base/BaseModal.vue'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'

defineProps<{ product: Product | null; categoryName: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <BaseModal :open="!!product" :title="product?.name ?? ''" size="lg" @close="emit('close')">
    <div v-if="product" class="flex flex-col gap-5">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        class="max-h-96 w-full rounded-2xl object-cover shadow-soft"
      />
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span class="rounded-full bg-accent-100 px-4 py-1 text-sm font-semibold text-accent-700">
          {{ categoryName }}
        </span>
        <span class="font-display text-3xl font-bold text-brand-600">
          {{ formatPrice(product.price) }}
        </span>
      </div>
      <p class="whitespace-pre-line text-lg leading-relaxed text-ink-muted">
        {{ product.description }}
      </p>
    </div>
  </BaseModal>
</template>
