export const weatherRoute = {
  path: '/weather',
  name: 'weather',
  meta: {
    isSideBar:true,
    requiresAuth: true,
    icon: 'mdi-weather-sunny',
    localePath: '../views/Home/SubPages/Weather/locale'
  },
  component: () => import('./WeatherViews.vue')
}
