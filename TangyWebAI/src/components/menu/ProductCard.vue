<script setup lang="ts">
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'

defineProps<{ product: Product; categoryName: string }>()
const emit = defineEmits<{ select: [product: Product] }>()
</script>

<template>
  <button
    type="button"
    class="group flex h-full w-full animate-fade-up flex-col overflow-hidden rounded-card border border-line bg-white text-left shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    @click="emit('select', product)"
  >
    <div class="relative aspect-[4/3] w-full overflow-hidden bg-brand-100">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        loading="lazy"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-110"
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
      <span
        class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-accent-700 shadow-sm backdrop-blur"
      >
        {{ categoryName }}
      </span>
      <span
        class="absolute bottom-3 right-3 rounded-full bg-brand-600 px-3 py-1 text-sm font-bold text-white shadow-soft"
      >
        {{ formatPrice(product.price) }}
      </span>
    </div>
    <div class="flex flex-1 flex-col gap-2 p-5">
      <h3 class="font-display text-xl font-semibold text-brand-900">{{ product.name }}</h3>
      <p class="line-clamp-2 text-sm leading-relaxed text-ink-muted">{{ product.description }}</p>
      <span
        class="mt-auto pt-2 text-sm font-semibold text-brand-600 transition-colors group-hover:text-brand-700"
      >
        View details &rarr;
      </span>
    </div>
  </button>
</template>
