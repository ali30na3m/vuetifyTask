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

    <VList v-if="!weatherDetails">
      <VListItem>
        <div class="text-center">
          <v-progress-circular color="secondary" indeterminate></v-progress-circular>
        </div>
      </VListItem>
    </VList>
    <VList v-else>
      <VListItem>
        <VListItemContent>{{ citySelect }}</VListItemContent>
      </VListItem>
      <VListItem >
        <VListItemContent>
          {{ weatherDetails.current_weather.temperature }}
          {{ weatherDetails.current_weather_units.temperature }}
        </VListItemContent>
      </VListItem>
      <VListItem>
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
import { ref, onMounted, watch } from 'vue'
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
const currentCityId = ref<string | null>(null)
const getWeatherInfos = ref<WeatherApi | null>(null)

const getCachedWeather = async (city: string) => {
  try {
    const response = await getApi(`weather?city=${city}`)
    if (response.length > 0) {
      getWeatherInfos.value = response[0]
      return getWeatherInfos.value
    }
    return null
  } catch (error) {
    showSnackbar(t('error'), 'error')
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
          const oneMinuteAgo = new Date()
          oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1)

          if (submittedTime < oneMinuteAgo) {
            if (data.current_weather.temperature !== getWeatherInfos.value.current_weather.temperature) {
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
      showSnackbar(t('error'), 'error')
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
    showSnackbar(t('weather_data_saved'), 'success')
  } catch (error) {
    showSnackbar(t('error'), 'error')
  }
}

const checkCityPosted = async (city: string) => {
  try {
    const response = await getApi(`weather?city=${city}`)
    return response.length > 0
  } catch (error) {
    showSnackbar(t('error'), 'error')
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
    showSnackbar(t('weather_data_updated'), 'success')
  } catch (error) {
    showSnackbar(t('error'), 'error')
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
    weatherDescription.value = ''
  }
})

onMounted(() => {
  handleChange()
})
</script>
