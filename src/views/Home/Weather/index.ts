export const weatherRoute = {
  path: '/weather',
  name: 'weather',
  meta: {
    requiresAuth: true,
    icon: 'mdi-weather-sunny',
    localePath: '../views/Home/Weather/locale'
  },
  component: () => import('./WeatherViews.vue')
}
