<template>
  <VLayout :dir="locale === 'en' ? 'ltr' : 'rtl'">
    <VAppBar color="primary" prominent>
      <div
        :class="[
          'flex justify-between items-center w-[100%] ',
          locale === 'en' ? '' : 'flex-row-reverse'
        ]"
      >
        <VAppBarNavIcon variant="text" @click.stop="isDrawer = !isDrawer"></VAppBarNavIcon>
        <VSpacer />
        <div class="relative">
          <VBtn class="circle-button" @click="showLogout = !showLogout">
            <VIcon >mdi-dots-vertical</VIcon>
          </VBtn>
          <div class="absolute top-10 right-5" v-if="showLogout">
            <div class="bg-zinc-700 rounded-md py-2 px-4">
              <div class="hover:bg-gray-400 rounded-md">
                <VBtn color="error" @click="handleLogout">Logout</VBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VAppBar>

    <VNavigationDrawer v-model="isDrawer" :location="locale === 'en' ? 'left' : 'right'" persistent>
      <VList>
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
                theme.name.value === 'dark' ? 'text-white' : 'text-black hover:!text-white',
                { 'text-white': isActive(router.path) }
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

const { locale } = useI18n()
const theme = useTheme()

const isDrawer = ref<boolean>(true)
const findRouter = routes.find((router) => router?.meta?.isSideBar)
const filterRouter = findRouter?.children?.filter((router) => router) || []

const router = useRouter()
const showLogout = ref(false)

const isActive = (path: string) => {
  return router.currentRoute.value.path === path
}

const handleLogout = () => {
  try {
    localStorage.clear()
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>
.active-link {
  background-color: #1867c0;
}

</style>
