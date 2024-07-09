export const registerRoutes = {
    path: '/register',
    name: 'register',
    meta: {
      localePath:'../views/Register/locale'
    },
    component: () => import('@/views/Register/RegsterViews.vue')
  }
  