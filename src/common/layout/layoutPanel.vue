<template>
  <VLayout :dir="locale === 'en' ? 'ltr' : 'rtl'">
    <VAppBar color="primary" prominent>
      <div
        :class="[
          'flex justify-between items-center w-[100%]',
          locale === 'en' ? '' : 'flex-row-reverse'
        ]"
      >
        <VAppBarNavIcon variant="text" @click.stop="isDrawer = !isDrawer"></VAppBarNavIcon>
        <VSpacer />
        <router-link class="ml-3 circle-button" to="logout" >
          <VIcon>mdi-logout</VIcon>
        </router-link>
      </div>
    </VAppBar>

    <VNavigationDrawer v-model="isDrawer" :location="locale === 'en' ? 'left' : 'right'" persistent>
      <VList class="mx-2">
        <VListItem
          v-for="router in filterRouter"
          :key="router.name"
          :class="[
            { 'active-link': isActive(router.path) },
            'hover:bg-[#1867C0] my-3 rounded-lg transition-all duration-300'
          ]"
        >
          <router-link class="no-underline" :to="router.path">
            <VListItemTitle
              :class="[
                isActive(router.path)
                  ? 'text-white'
                  : theme.name.value === 'dark'
                  ? '!text-white'
                  : '!text-black',
                'hover:!text-white'
              ]"
            >
              <VIcon color="gray">{{ router.meta.icon }}</VIcon>
              {{ $t(router.name) }}
            </VListItemTitle>
          </router-link>
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <VMain class="child:relative d-flex align-center justify-center" style="height: 90vh">
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
import type { Router } from 'vue-router'

const { locale } = useI18n()
const theme = useTheme()

const isDrawer = ref<boolean>(true)
const findRouter = routes.find((router) => router.meta.isSideBar)
const filterRouter = findRouter?.children?.filter((router: Router) => router.meta.isSideBar)


const router = useRouter()

const isActive = (path: string) => {
  return router.currentRoute.value.path === path
}


</script>

<style scoped>
.active-link {
  background-color: #1867c0;
  color: white;
}
</style>
