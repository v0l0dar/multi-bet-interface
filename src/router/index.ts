import { createRouter, createWebHistory } from 'vue-router'
import PageHome from '@/pages/PageHome.vue'

const routes = [{ path: '/', name: 'home', component: PageHome }]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
