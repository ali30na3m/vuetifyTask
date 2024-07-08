export const todosRoute = {
  path: '/todos',
  name: 'todos',
  meta: {
    requiresAuth: true,
    icon: 'mdi-check',
    localePath:'../views/Home/Todos/locale'
  },
  component: () => import('./TodoViews.vue')
}
