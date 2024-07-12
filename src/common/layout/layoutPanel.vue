<template>
  <VLayout :dir="locale === 'en' ? 'ltr' : 'rtl'">
    <VAppBar color="primary" prominent>
      <div
        :class="[
          'flex justify-between items-center w-[100%]',
          locale === 'en' ? '' : 'flex-row-reverse'
        ]"
      >
        <VAppBarNavIcon variant="text" @click.stop="drawer = !drawer"></VAppBarNavIcon>
        <VToolbarItems class="flex items-center justify-center">{{ $t('AppBar') }}</VToolbarItems>
        <VSpacer />
        <VBtn icon="mdi-dots-vertical" variant="text"></VBtn>
      </div>
    </VAppBar>

    <VNavigationDrawer v-model="drawer" :location="locale === 'en' ? 'left' : 'right'" temporary>
      <VList>
        <VListItem
          v-for="router in filterRouter"
          :key="router.name"
          :class="[{ 'active-link': isActive(router.path) }, 'hover:bg-purple my-3 rounded-xl transition-all duration-300']"
        >
          <router-link class="no-underline" :to="router.path">
            <VListItemTitle :class="[theme.name.value === 'dark' ? 'text-white' : 'text-black']">
              <VIcon color="gray">{{ router.meta.icon }}</VIcon>
              {{ $t(router.name) }}
            </VListItemTitle>
          </router-link>
        </VListItem>
        
      </VList>
    </VNavigationDrawer>

    <VMain  class="child:relative d-flex align-center justify-center" style="height: 90vh">
      <router-view />
    </VMain>
  </VLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import { routes } from '@/views'

const { locale } = useI18n()

const theme = useTheme()
const drawer = ref(false)
const findRouter = routes.find((router) => router?.meta?.isSideBar)
const filterRouter = findRouter?.children?.filter((router) => router) || []

const router = useRouter()

const isActive = (path:string) => {
  return router.currentRoute.value.path === path
}
</script>

<style scoped>
.active-link {
  background-color: #6c63ff;
}
</style>
