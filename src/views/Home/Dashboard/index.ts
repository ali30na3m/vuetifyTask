export const dashboardRoute = {
  path: '/dashboard',
  name: 'dashboard',
  meta: {
    isSideBar: true,
    icon: 'mdi-home',
    localePath: '../views/Home/Dashboard/locale'
  },
  component: () => import('./DashboardViews.vue')
}
