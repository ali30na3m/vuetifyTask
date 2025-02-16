<template>
  <VContainer class="flex item-center justify-center h-[95vh]">
    <div class="relative flex items-center justify-center">
      <VCard
        class="text-center backdrop-blur-md !z-50 shadow-lg"
        :title="$t('login')"
        :width="width"
      >
        <VCardItem>
          <VLocaleProvider :locale="locale">
            <VTextField
              v-model="username"
              :rules="baseRules"
              :label="$t('username')"
              :class="[
                'flex items-center justify-center mx-auto rounded-md w-[80%] my-2 border-2 child:text-[#1867C0]',
                theme.global.name.value === 'dark'
                  ? 'border-white child:text-white'
                  : 'border-[#1867C0] child:text-[#1867C0]'
              ]"
              :color="theme.global.name.value === 'dark' ? 'white' : ''"
              prepend-inner-icon="mdi-phone"
              clearable
              hide-details
              @keyup.enter="loginHandler"
            />
          </VLocaleProvider>
        </VCardItem>
        <VcardItem>
          <VLocaleProvider :locale="locale">
            <VTextField
              v-model="password"
              :rules="baseRules"
              :label="$t('password')"
              :class="[
                'flex items-center justify-center mx-auto rounded-md w-[76%] my-2 border-2 child:text-[#1867C0]',
                theme.global.name.value === 'dark'
                  ? 'border-white child:text-white'
                  : 'border-[#1867C0] child:text-[#1867C0]'
              ]"
              :color="theme.global.name.value === 'dark' ? 'white' : ''"
              :type="visible ? 'text' : 'password'"
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              prepend-inner-icon="mdi-lock"
              hide-details
              clearable
              @click:append-inner="(visible = !visible)"
              @click:prepend-inner="(visible = !visible) "
              @keyup.enter="loginHandler"
            />
          </VLocaleProvider>
        </VcardItem>

        <VCardItem>
          <VBtn width="30%" color="info" @click="loginHandler" :disabled="!isValidationUser">{{
            $t('login')
          }}</VBtn>
        </VCardItem>
        <VCardItem>
          <router-link class="text-blue-500" to="/register">{{ $t('haveAccount') }}</router-link>
        </VCardItem>
      </VCard>
      <div
        class="absolute top-10 -left-20 bg-gradient-to-r from-cyan-500 to-cyan-800 w-[200px] h-[200px] rounded-full"
      ></div>
      <div
        class="absolute bottom-14 -right-20 bg-gradient-to-r from-blue-500 to-blue-800 w-[200px] h-[200px] rounded-full"
      ></div>
    </div>
    <WrapperSnackBar
      v-model:snackBar="snackBar"
      :snackbarText="snackbarText"
      :timeout="3000"
      :colorSet="colorSnackBar"
    />
  </VContainer>
</template>

<script lang="ts" setup>
import { useTheme } from 'vuetify/lib/framework.mjs'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import WrapperSnackBar from 'wrapper/WrapperSnackBar'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import { useSnackbar } from '@/composables/useSnackBar'
import { useLocalstorage } from '@/composables/useLocalstorage'
import useHttp from '@/composables/useHttp'
import { useRules } from '@/composables/useRules'
import router from '@/views'
import type { profileInfo } from '../type'

const theme = useTheme()
const { t, locale } = useI18n()
const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { setLocalStorage } = useLocalstorage()
const { getApi } = useHttp()
const { baseRules,  isValidationUser } = useRules()

const registerDatas = ref<profileInfo[]>([])
const username = ref<string>('')
const password = ref<string>('')
const visible = ref<boolean>(false)

const getProfile = async () => {
  try {
    await getApi('profile').then((data) => {
      registerDatas.value = data
    })
  } catch {
    showSnackbar('error', 'error')
  }
}

const loginHandler = () => {
  if (!isValidationUser) {
    showSnackbar(t('error'), 'error')
    return
  }

  const findUsername = registerDatas.value.find((data: profileInfo) => {
    if (username.value === data.username && password.value == data.password) {
      return data
    }
  })

  if (findUsername) {
    showSnackbar(t('success'), 'success')
    setLocalStorage('username', username.value)
    setLocalStorage('id', findUsername.id)
    setLocalStorage('theme', 'light')
    setLocalStorage('lang', 'en')
    router.push('/dashboard')
  } else {
    showSnackbar(t('error'), 'error')
  }
}

onMounted(() => {
  getProfile()
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