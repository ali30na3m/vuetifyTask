export const logout = {
  path: '/logout',
  name: 'logout',
  component: () => import('./component/logoutCard.vue'),
  meta: {
    requiresAuth: true,
    isSideBar: true,
    icon: 'mdi-logout',
    localePath: '../views/Home/SubPages/Logout/locale'
  }
}
