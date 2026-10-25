<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import CategoryManager from '@/components/manage/CategoryManager.vue'
import ProductManager from '@/components/manage/ProductManager.vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useProductStore } from '@/stores/productStore'

const categoryStore = useCategoryStore()
const productStore = useProductStore()
const tab = ref(0)

const tabClass = (selected: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold ${
    selected ? 'bg-brand-600 text-white' : 'text-ink hover:bg-brand-100'
  }`

onMounted(() => {
  void categoryStore.load()
  void productStore.load()
})
</script>

<template>
  <section aria-labelledby="manage-heading" class="flex flex-col gap-6">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Admin</p>
      <h1 id="manage-heading" class="font-display text-3xl font-bold text-brand-900">
        Menu Studio
      </h1>
      <p class="text-ink-muted">Manage products and categories.</p>
    </div>
    <p
      role="note"
      class="rounded-lg border border-danger/30 bg-danger-soft p-3 text-sm text-danger"
    >
      Not protected: anyone with this URL can edit data.
    </p>

    <TabGroup :selected-index="tab" @change="tab = $event">
      <TabList class="flex gap-2">
        <Tab v-slot="{ selected }" as="template"
          ><button type="button" :class="tabClass(selected)">Products</button></Tab
        >
        <Tab v-slot="{ selected }" as="template"
          ><button type="button" :class="tabClass(selected)">Categories</button></Tab
        >
      </TabList>
      <TabPanels>
        <TabPanel><ProductManager @go-categories="tab = 1" /></TabPanel>
        <TabPanel><CategoryManager /></TabPanel>
      </TabPanels>
    </TabGroup>
  </section>
</template>
