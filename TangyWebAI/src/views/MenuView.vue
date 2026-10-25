<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import ErrorMessage from '@/components/base/ErrorMessage.vue'
import Spinner from '@/components/base/Spinner.vue'
import ProductCard from '@/components/menu/ProductCard.vue'
import HeroBanner from '@/components/menu/HeroBanner.vue'
import ProductDetailsModal from '@/components/menu/ProductDetailsModal.vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useProductStore } from '@/stores/productStore'
import type { Product } from '@/types'
import { ALL_CATEGORIES, filterProducts } from '@/utils/filterProducts'

const categoryStore = useCategoryStore()
const productStore = useProductStore()

const searchInput = ref('')
const search = ref('')
const categoryId = ref(ALL_CATEGORIES)
const selected = ref<Product | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | undefined
watch(searchInput, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => (search.value = value), 300)
})
onUnmounted(() => clearTimeout(debounceTimer))

const categoryNames = computed(
  () => new Map(categoryStore.items.map((category) => [category.id, category.name])),
)

const results = computed(() =>
  filterProducts(productStore.items, { search: search.value, categoryId: categoryId.value }),
)

const hasFilters = computed(() => search.value.trim() !== '' || categoryId.value !== ALL_CATEGORIES)
const selectedCategoryName = computed(() => nameFor(selected.value))
const loading = computed(() => productStore.loading || categoryStore.loading)

function nameFor(product: Product | null): string {
  return (product && categoryNames.value.get(product.categoryId)) || 'Uncategorized'
}

function clearFilters() {
  clearTimeout(debounceTimer)
  searchInput.value = ''
  search.value = ''
  categoryId.value = ALL_CATEGORIES
}

function loadAll() {
  void productStore.load(true)
  void categoryStore.load(true)
}

onMounted(() => {
  void productStore.load()
  void categoryStore.load()
})
</script>

<template>
  <div class="flex flex-col gap-10">
    <HeroBanner target-id="menu-heading" />

    <section aria-labelledby="menu-heading" class="flex flex-col gap-6">
      <div class="text-center">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Discover</p>
        <h2
          id="menu-heading"
          tabindex="-1"
          class="scroll-mt-24 font-display text-4xl font-bold text-brand-900 focus:outline-none"
        >
          Our Menu
        </h2>
        <p class="mx-auto mt-2 max-w-xl text-ink-muted">
          Browse our dishes, search for something specific or filter by category.
        </p>
      </div>

      <form
        class="grid gap-4 rounded-card border border-line bg-white p-4 shadow-soft sm:grid-cols-[1fr_14rem] sm:p-5"
        role="search"
        @submit.prevent
      >
        <BaseInput
          v-model="searchInput"
          label="Search the menu"
          type="search"
          placeholder="Search by name or description"
        />
        <BaseSelect
          v-model="categoryId"
          label="Category"
          :disabled="!!categoryStore.error || categoryStore.loading"
        >
          <option :value="ALL_CATEGORIES">All</option>
          <option v-for="category in categoryStore.items" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </BaseSelect>
      </form>

      <p
        v-if="categoryStore.error"
        class="rounded-lg bg-brand-50 p-3 text-sm text-ink-muted"
        role="status"
      >
        Categories could not be loaded, so category filtering is unavailable.
        <button type="button" class="font-semibold underline" @click="categoryStore.load(true)">
          Retry
        </button>
      </p>

      <div v-if="loading && !productStore.items.length" class="flex justify-center py-16">
        <Spinner size="lg" label="Loading menu" />
      </div>

      <ErrorMessage v-else-if="productStore.error" :message="productStore.error" @retry="loadAll" />

      <template v-else>
        <p class="text-sm font-medium text-ink-muted" aria-live="polite">
          {{ results.length }} {{ results.length === 1 ? 'item' : 'items' }}
        </p>

        <ul v-if="results.length" class="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="product in results" :key="product.id">
            <ProductCard
              :product="product"
              :category-name="nameFor(product)"
              @select="selected = $event"
            />
          </li>
        </ul>

        <div
          v-else
          class="flex flex-col items-center gap-3 rounded-card border border-dashed border-brand-200 bg-brand-50 py-14 text-center"
        >
          <p class="text-lg font-medium">No items match your search</p>
          <BaseButton v-if="hasFilters" variant="secondary" @click="clearFilters"
            >Clear filters</BaseButton
          >
        </div>
      </template>

      <ProductDetailsModal
        :product="selected"
        :category-name="selectedCategoryName"
        @close="selected = null"
      />
    </section>
  </div>
</template>
