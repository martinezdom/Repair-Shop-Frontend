import DashboardView from '@/views/DashboardView.vue'
import VehiclesView from '@/views/VehiclesView.vue'
import CustomersView from '@/views/CustomersView.vue'
import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'dashboard' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: VehiclesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomersView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }

  if (to.name === 'login' && isAuthenticated) {
    return { name: 'dashboard' }
  }

  return true
})

export default router
