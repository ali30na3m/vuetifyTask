<template>
  <VCard class="main-content text-center" :title="$t('weather')" :width="width">
    <VCardText>
      <VSelect
        v-model="citySelect"
        :items="options"
        label="Select"
        persistent-hint
        single-line
        @update:modelValue="handleChange"
      />
    </VCardText>
    <VList>
      <VListItem>
        <VListItemContent>{{ citySelect }}</VListItemContent>
      </VListItem>
      <VListItem v-if="weatherDetails">
        <VListItemContent>
          {{ weatherDetails.current_weather.temperature }}
          {{ weatherDetails.current_weather_units.temperature }}
        </VListItemContent>
      </VListItem>
      <VListItem v-if="weatherDescription">
        <VListItemContent>{{ weatherDescription }}</VListItemContent>
      </VListItem>
    </VList>
    <WrapperSnackBar
      v-model:snackBar="snackBar"
      :snackbarText="snackbarText"
      :timeout="3000"
      :colorSet="colorSnackBar"
    />
  </VCard>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { getWeatherDescription } from '../weatherStatus'
import weatherData from '../data/ir.json'
import WrapperSnackBar from 'wrapper/WrapperSnackBar.vue'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import useHttp from '@/composables/useHttp'
import { useSnackbar } from '@/composables/useSnackBar'
import type { WeatherTypeData, WeatherApi } from '../type'

const { width } = useResponsiveWidth()
const { getApi, postApi, putApi } = useHttp()
const { t } = useI18n()

const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()

const citySelect = ref<string>('Tehran')
const weathers = ref<WeatherTypeData[]>(weatherData)
const weatherDetails = ref<WeatherApi | null>(null)
const options = ref(weathers.value.map((weather) => weather.city))
const weatherDescription = ref<string>('')

const handleChange = async () => {
  const cityDetails = weathers.value.find((weather) => weather.city === citySelect.value)

  if (cityDetails)
    try {
      const data = await getApi(
        `https://api.open-meteo.com/v1/forecast?latitude=${cityDetails.lat}&longitude=${cityDetails.lng}&current_weather=true`
      )
      weatherDetails.value = data

      const cityAlreadyPosted = await checkCityPosted(citySelect.value)

      if (!cityAlreadyPosted) {
        await postWeatherData(citySelect.value, data)
      }
    } catch  {
      showSnackbar(t('error'), 'error')
      emptyText()
    }
}

const postWeatherData = async (city: string, weatherData: WeatherApi) => {
  const currentTime = new Date().toISOString()
  try {
    await postApi('weather', {
      city,
      ...weatherData,
      timeSubmit: currentTime
    })
    showSnackbar(t('weather_data_saved'), 'success')
  } catch {
    showSnackbar(t('error'), 'error')
  }
}
const putWeatherData = async (city: string, weatherData: WeatherApi) => {
  const currentTime = new Date().toISOString()
  try {
    await putApi('weather', {
      city,
      ...weatherData,
      timeSubmit: currentTime
    })
  } catch {
    showSnackbar(t('error'), 'error')
  }
}

const checkCityPosted = async (city: string) => {
  try {
    const response = await getApi(`weather?city=${city}`)
    return response.length > 0
  } catch {
    showSnackbar(t('error'), 'error')
    return false
  }
}

watchEffect(() => {
  let timer: number | undefined
  if (weatherDetails.value) {
    timer = window.setTimeout(async () => {
      const cityDetails = weathers.value.find((weather) => weather.city === citySelect.value)
      if (cityDetails) {
        try {
          const newData = await getApi(
            `https://api.open-meteo.com/v1/forecast?latitude=${cityDetails.lat}&longitude=${cityDetails.lng}&current_weather=true`
          )
          if (
            newData.current_weather.temperature !== weatherDetails.value.current_weather.temperature
          ) {
            await putWeatherData(citySelect.value, newData)
          }
        } catch  {
          showSnackbar(t('error'), 'error')
        }
      }
    }, 1)
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }
})

const emptyText = () => {
  if (!citySelect.value || !weatherDetails.value) {
    citySelect.value = '...'
  }
}

watch(weatherDetails, (newDetails) => {
  if (newDetails) {
    weatherDescription.value = getWeatherDescription(newDetails.current_weather.weathercode, t)
  } else {
    weatherDescription.value = ''
  }
})

onMounted(() => {
  handleChange()
})
</script>
