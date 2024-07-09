export const profileRoute = {
  path: '/profile',
  name: 'profile',
  meta: {
    isSideBar:true,
    requiresAuth: true,
    icon: 'mdi-account',
    localePath:'../views/Home/SubPages/Profile/locale'
  },
  component: () => import('./ProfileView.vue')
}
