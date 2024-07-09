export const dashboardRoute = {
  path: '/dashboard',
  name: 'dashboard',
  meta: {
    requiresAuth:true,
    isSideBar: true,
    icon: 'mdi-home',
    localePath: '../views/Home/SubPages/Dashboard/locale'
  },
  component: () => import('./DashboardViews.vue')
}
