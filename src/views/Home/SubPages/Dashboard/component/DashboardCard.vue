<template>
  <VCard class="text-center !shadow-none" :title="$t('dashboard')" :width="width">
    <div class="flex flex-col items-center justify-center gap-7 my-4 child:w-[40%]">
      <p class="border-b-2 border-purple !text-3xl"> {{ currentDate }} </p>
      <p class="border-b-2 border-purple !text-2xl"> {{ username }} , {{ greetingToUser() }} </p>
    </div>
  </VCard>
</template>
  <script lang='ts' setup>
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
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
  