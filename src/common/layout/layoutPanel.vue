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
        <VListItem v-for="router in filterRouter" :key="router.name">
          <router-link class="no-underline" :to="router.path">
            <VListItemTitle :class="theme.name.value === 'dark' ? 'text-white' : 'text-black'">
              <VIcon color="gray">{{ router.meta.icon }}</VIcon>
              {{ $t(router.name) }}
            </VListItemTitle>
          </router-link>
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <VMain :theme="theme" class="d-flex align-center justify-center" style="height: 90vh">
      <router-view />
    </VMain>
  </VLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { routes } from '@/views'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

const { locale } = useI18n()

const theme = useTheme()
const drawer = ref(false)
const findRouter = routes.find((router) => router?.meta?.isSideBar)
const filterRouter = findRouter?.children?.filter((router) => router) || []
</script>
