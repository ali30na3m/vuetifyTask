export const getWeatherDescription = (
  weatherCode: number,
  t: (key: string) => string
): string[] => {
  switch (weatherCode) {
    case 0:
      return [t('weather_clearSky'), 'mdi-weather-sunny']
    case 1:
    case 2:
    case 3:
      return [t('weather_partyCloudy'), 'mdi-weather-cloudy']
    case 45:
    case 48:
      return [t('weather_foggy'), 'mdi-weather-partly-rainy']
    case 51:
    case 53:
    case 55:
      return [t('weather_drizzle'), 'mdi-weather-rainy']
    case 61:
    case 63:
    case 65:
      return [t('weather_rainy'), 'mdi-weather-fog']
    case 80:
    case 81:
    case 82:
      return [t('weather_showers'), 'mdi-weather-pouring']
    case 95:
    case 96:
    case 99:
      return [t('weather_Thunderstorm'), 'mdi-weather-tornado']
    default:
      return ['Unknown weather','mdi-weather-cloudy-alert']
  }
}
