<template>
  <VCard
    class="text-center backdrop-blur-md !z-50 shadow-xl"
    :title="$t('dashboard')"
    :width="width"
  >
    <div class="flex flex-col items-center justify-center gap-7 my-4 child:w-[50%]">
      <p class="!text-3xl">{{ currentDate }}</p>
      <p class="!text-2xl">{{ username }} , {{ greetingToUser() }}</p>
    </div>
  </VCard>
  <div
    class="absolute -top-28 -left-24 bg-gradient-to-r from-cyan-500 to-cyan-800 w-[200px] h-[200px] rounded-full"
  ></div>
  <div
    class="absolute -bottom-14 -right-20 bg-gradient-to-r from-blue-500 to-blue-800 w-[200px] h-[200px] rounded-full"
  ></div>
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
  
<style scoped>
.v-card--variant-elevated {
  background: rgba(255, 255, 255, 0.11) !important;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.v-list {
  background: rgba(255, 255, 255, 0) !important;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  -tw-backdrop-blur: blur(8px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast)
    var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert)
    var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia) !important;
}
</style>