<template>
  <VCard class="text-center" :title="$t('dashboard')" :width="width">
    <VCardText class="!text-3xl"> {{ currentDate }} </VCardText>
    <VCardText class="!text-2xl"> {{ username }} , {{ greetingToUser() }} </VCardText>
  </VCard>
</template>
  <script lang='ts' setup>
import { useResponsiveWidth } from '../../../../composables/useResponsiveWidth'
import { greetingToUser } from '../uniqueMessage'
import { onMounted, ref } from 'vue'

const { width } = useResponsiveWidth()

const username = ref<string>('')
const currentDate = ref<string>(new Date().toLocaleTimeString())

const updateCurrentDate = () => {
  setInterval(() => {
    currentDate.value = new Date().toLocaleTimeString()
  }, 1000)
}

onMounted(() => {
  const getUserName = localStorage.getItem('username')
  updateCurrentDate()
  if (getUserName) {
    username.value = getUserName
  }
})
</script>
  