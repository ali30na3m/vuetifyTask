import { createRouter, createWebHistory } from 'vue-router'
import { homeRoutes } from './Home/SubPages'
import { loginRoutes } from './Login'
import { notFoundRoutes } from './NotFound'
import { registerRoutes } from './Register'
import { useI18n } from '@/composables/useI18n'

export const routes = [homeRoutes, loginRoutes, registerRoutes, notFoundRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

const { loadLocaleMessages } = useI18n()

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('username')

  if (to.meta.localePath) {
    loadLocaleMessages([to.meta.localePath, '../locale'])
  }

  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
