import { dashboardRoute } from './Dashboard'
import { profileRoute } from './Profile'
import { todosRoute } from './Todos'
import { weatherRoute } from './Weather'

export const homeRoutes = {
  path: '/',
  redirect: '/dashboard',
  name: 'home',
  component: () => import('@/common/layout/layoutPanel.vue'),
  meta: {
    isSideBar: true,
    localePath: '../locale'
  },
  children: [dashboardRoute, todosRoute, weatherRoute, profileRoute]
}
