export const notFoundRoutes = {
  path: '/:catchAll(.*)',
  name: 'notFound',
  component: () => import('@/views/NotFound/NotFound.vue'),
  meta: {
    isSideBar: false,
    localePath:'../views/NotFound/locale'
  }
}
