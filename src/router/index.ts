import DashboardView from '@/views/DashboardView.vue'
import VehiclesView from '@/views/VehiclesView.vue'
import CustomersView from '@/views/CustomersView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuth } from '@/composables/useAuth'
import { createRouter, createWebHistory } from 'vue-router'
import RepairsView from '@/views/RepairsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: { name: 'repairs' },
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
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
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
    {
      path: '/repairs',
      name: 'repairs',
      component: RepairsView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const { getUserRole } = useAuth()
  
  if (to.name === 'login' && token) {
    return getUserRole() === 'ADMIN' ? { name: 'dashboard' } : { name: 'repairs' }
  }

  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }

  if (to.meta.requiresAdmin && getUserRole() !== 'ADMIN') {
    return { name: 'repairs' }
  }

  return true
})


export default router
