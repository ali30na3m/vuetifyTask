<template>
  <router-view v-slot="{ Component }">
    <component :is="layoutComponent">
      <component :is="Component" />
    </component>
  </router-view>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from 'vuetify'
import layoutPanel from '@/common/layout/layoutPanel.vue'

const route = useRoute()
const theme = useTheme()

const layoutComponent = computed(() => {
  if (route.name === 'login' || route.name === 'notFound' || route.name == 'register') {
    return 'div'
  }
  return layoutPanel
})

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.global.name.value = savedTheme
  }
})
</script>
