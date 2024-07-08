export const profileRoute = {
  path: '/profile',
  name: 'profile',
  meta: {
    requiresAuth: true,
    icon: 'mdi-account',
    localePath:'../views/Home/Profile/locale'
  },
  component: () => import('./ProfileView.vue')
}
