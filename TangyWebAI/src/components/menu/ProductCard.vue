<script setup lang="ts">
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'

defineProps<{ product: Product; categoryName: string }>()
const emit = defineEmits<{ select: [product: Product] }>()
</script>

<template>
  <button
    type="button"
    class="group flex h-full w-full flex-col overflow-hidden rounded-card border border-line bg-white text-left shadow-sm transition-shadow hover:shadow-md"
    @click="emit('select', product)"
  >
    <div class="aspect-[4/3] w-full overflow-hidden bg-brand-100">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        loading="lazy"
        class="size-full object-cover transition-transform group-hover:scale-105"
      />
      <div
        v-else
        class="flex size-full items-center justify-center text-brand-600"
        role="img"
        :aria-label="`${product.name} (no photo available)`"
      >
        <svg
          class="size-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path
            d="M6 3v7a3 3 0 003 3v8M9 3v7M12 3v7M17 21V3c-2 2-3 5-3 8h3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="flex flex-1 flex-col gap-2 p-4">
      <div class="flex items-start justify-between gap-3">
        <h3 class="font-display text-lg font-semibold">{{ product.name }}</h3>
        <span class="shrink-0 font-semibold text-brand-700">{{ formatPrice(product.price) }}</span>
      </div>
      <span class="w-fit rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-900">
        {{ categoryName }}
      </span>
      <p class="line-clamp-2 text-sm text-ink-muted">{{ product.description }}</p>
    </div>
  </button>
</template>
