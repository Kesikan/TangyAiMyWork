import { createRouter, createWebHistory } from 'vue-router'
import MenuView from '@/views/MenuView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'menu', component: MenuView, meta: { title: 'Menu' } },
    {
      path: '/manage',
      name: 'manage',
      component: () => import('@/views/ManageView.vue'),
      meta: { title: 'Manage Menu' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page not found' },
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = `${String(to.meta.title ?? 'Menu')} | Tangy Restaurant`
})

export default router
