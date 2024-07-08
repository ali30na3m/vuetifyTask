<template>
  <VCard class="main-content text-center" :title="$t('weather')" :width="width">
    <VCardText>
      <VSelect
        v-model="citySelect"
        :items="options"
        label="Select"
        persistent-hint
        single-line
        @change="handleChange"
      />
    </VCardText>
    <VList>
      <VListItem>
        <VListItemContent>{{ citySelect }}</VListItemContent>
      </VListItem>
      <VListItem>
        <VListItemContent>
          {{ weatherDetails?.current_weather.temperature }}
          {{ weatherDetails?.current_weather_units.temperature }}
        </VListItemContent>
      </VListItem>
      <VListItem>
        <VListItemContent>{{ weatherDescription }}</VListItemContent>
      </VListItem>
    </VList>
  </VCard>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getWeatherDescription } from '../weatherStatus'
import weatherData from '../data/ir.json'
import { useResponsiveWidth } from '../../../../composables/useResponsiveWidth'
import useHttp from '../../../../composables/useHttp'
import type { WeatherTypeData, WeatherApi } from '../type'

const { width } = useResponsiveWidth()
const { getApi } = useHttp()
const { t } = useI18n()

const citySelect = ref<string>('Tehran')
const weathers = ref<WeatherTypeData[]>(weatherData)
const weatherDetails = ref<WeatherApi | null>(null)
const options = ref(weathers.value.map((weather) => weather.city))

const handleChange = async () => {
  const cityDetails = weathers.value.find((weather) => weather.city === citySelect.value)
  if (cityDetails) {
    try {
      getApi(
        `forecast?latitude=${cityDetails.lat}&longitude=${cityDetails.lng}&current_weather=true`
      ).then((data) => (weatherDetails.value = data))
    } catch {
      emptyText()
    }
  }
}

const emptyText = () => {
  if (!citySelect.value || !weatherDetails.value) {
    citySelect.value = '...'
  }
}

const weatherDescription = ref<string>('')

watch(weatherDetails, (newDetails) => {
  if (newDetails) {
    weatherDescription.value = getWeatherDescription(newDetails.current_weather.weathercode, t)
  } else {
    weatherDescription.value = ''
  }
})

watch(citySelect, (newVal) => {
  handleChange()
})

onMounted(() => {
  handleChange()
})
</script>
