export const todosRoute = {
  path: '/todos',
  name: 'todos',
  meta: {
    isSideBar:true,
    requiresAuth: true,
    icon: 'mdi-check',
    localePath:'../views/Home/SubPages/Todos/locale'
  },
  component: () => import('./TodoViews.vue')
}
