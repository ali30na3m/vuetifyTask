<template>
  <VCard
    class="text-center backdrop-blur-md shadow-none !z-50"
    :title="$t('weather').toUpperCase()"
    :width="width"
  >
    <VCardText>
      <VSelect
        v-model="citySelect"
        :items="options"
        class="text-white rounded-md w-full"
        bg-color="primary"
        dir="rtl"
        :reverse="true"
        single-line
        hide-details
        @update:modelValue="handleChange"
      />
    </VCardText>
    <VList v-if="!weatherDetails">
      <VListItem>
        <div class="text-center">
          <v-progress-circular color="secondary" indeterminate></v-progress-circular>
        </div>
      </VListItem>
    </VList>
    <VList v-else>
      <div
        class="my-3 flex flex-col items-center gap-8 child:w-[90%] child:flex child:items-center child:justify-between child:py-2 child:border-b-2 child:border-[#1867C0]"
      >
        <div>
          <h3>
            <VIcon>mdi-weather-windy</VIcon>
            {{ $t('windSpeed') }}:
          </h3>
          <p>
            {{ weatherDetails.current_weather.windspeed }}
            {{ weatherDetails.current_weather_units.windspeed }}
          </p>
        </div>
        <div>
          <h3>
            <VIcon>mdi-thermometer</VIcon>
            {{ $t('temperatur') }}:
          </h3>
          <p>
            {{ weatherDetails.current_weather.temperature }}
            {{ weatherDetails.current_weather_units.temperature }}
          </p>
        </div>
        <div>
          <h3>
            <VIcon>
              {{ weatherDescription[1] }}
            </VIcon>
            {{ $t('status') }}:
          </h3>
          <p>
            {{ weatherDescription[0] }}
          </p>
        </div>
      </div>
    </VList>
  </VCard>
  <div class="absolute -top-20 -left-20 bg-gradient-to-r from-cyan-500 to-cyan-800 w-[200px] h-[200px] rounded-full">
  </div>
  <div class="absolute -bottom-20 -right-20 bg-gradient-to-r from-blue-500 to-blue-800 w-[200px] h-[200px] rounded-full">
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getWeatherDescription } from '../weatherStatus'
import weatherData from '../data/ir.json'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import useHttp from '@/composables/useHttp'
import type { WeatherTypeData, WeatherApi, WeatherCatch } from '../type'
import { VIcon } from 'vuetify/lib/components/index.mjs'

const { width } = useResponsiveWidth()
const { getApi, postApi, putApi } = useHttp()
const { t } = useI18n()

const citySelect = ref<string>('Tehran')
const weathers = ref<WeatherTypeData[]>(weatherData)
const weatherDetails = ref<WeatherApi | null>(null)
const options = ref(weathers.value.map((weather) => weather.city))
const weatherDescription = ref<string[]>([])
const currentCityId = ref<string | null>(null)
const getWeatherInfos = ref<WeatherCatch | null>(null)

const getCachedWeather = async (city: string) => {
  try {
    const response = await getApi(`weather?city=${city}`)
    if (response.length > 0) {
      getWeatherInfos.value = response[0]
      return getWeatherInfos.value
    }
    return null
  } catch (error) {
    return null
  }
}

const handleChange = async () => {
  const cityDetails = weathers.value.find((weather) => weather.city === citySelect.value)
  if (cityDetails) {
    try {
      const cachedWeather = await getCachedWeather(citySelect.value)
      if (cachedWeather) {
        weatherDetails.value = cachedWeather
      } else {
        const data = await getApi(
          `https://api.open-meteo.com/v1/forecast?latitude=${cityDetails.lat}&longitude=${cityDetails.lng}&current_weather=true`
        )
        weatherDetails.value = data

        if (getWeatherInfos.value) {
          currentCityId.value = getWeatherInfos.value.id

          const submittedTime = new Date(getWeatherInfos.value.timeSubmit)
          const fourHourAgo = new Date()
          fourHourAgo.setHours(fourHourAgo.getHours() - 4)

          if (submittedTime < fourHourAgo) {
            if (
              data.current_weather.temperature !== getWeatherInfos.value.current_weather.temperature
            ) {
              await putWeatherData(citySelect.value, data, getWeatherInfos.value.id)
            }
          }
        }
        const cityAlreadyPosted = await checkCityPosted(citySelect.value)
        if (!cityAlreadyPosted) {
          await postWeatherData(citySelect.value, data)
        }
      }
    } catch (error) {
      emptyText()
    }
  }
}

const postWeatherData = async (city: string, weatherData: WeatherApi) => {
  const currentTime = new Date().toISOString()
  try {
    const response = await postApi('weather', {
      id: crypto.randomUUID(),
      city,
      ...weatherData,
      timeSubmit: currentTime
    })
    currentCityId.value = response.id
  } catch (error) {
    console.log(error)
  }
}

const checkCityPosted = async (city: string) => {
  try {
    const response = await getApi(`weather?city=${city}`)
    return response.length > 0
  } catch (error) {
    console.error(error)
    return false
  }
}

const putWeatherData = async (city: string, weatherData: WeatherApi, id: string) => {
  const currentTime = new Date().toISOString()
  try {
    await putApi(`weather/${id}`, {
      city,
      ...weatherData,
      timeSubmit: currentTime
    })
  } catch (error) {
    console.error(error)
  }
}

const emptyText = () => {
  if (!citySelect.value || !weatherDetails.value) {
    citySelect.value = '...'
  }
}

watch(weatherDetails, (newDetails) => {
  if (newDetails) {
    weatherDescription.value = getWeatherDescription(newDetails.current_weather.weathercode, t)
  } else {
    weatherDescription.value = []
  }
})

onMounted(() => {
  handleChange()
})
</script>

<style scoped>
h3 {
  font-size: 1rem;
  font-weight: 500;
}
p {
  font-size: 1rem;
  font-weight: 500;
}

.v-card--variant-elevated {
  background: rgba(255, 255, 255, 0.11) !important;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.v-list{
  background: rgba(255, 255, 255, 0) !important;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  -tw-backdrop-blur: blur(8px);
    backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia) !important; 
}
</style>
