export const loginRoutes = {
  path: '/login',
  name: 'login',
  meta: {
    localePath:'../views/Login/locale'
  },
  component: () => import('@/views/Login/LoginViews.vue')
}
