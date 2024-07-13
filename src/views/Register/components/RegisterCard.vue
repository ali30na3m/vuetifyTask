<template>
  <VContainer class="flex items-center justify-center h-[95vh]">
    <div class="relative flex items-center justify-center">
      <VCard
        class="text-center backdrop-blur-md !z-50 shadow-lg"
        :title="$t('register')"
        height=""
        :width="width"
      >
        <VCardItem>
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
            :prepend-inner-icon="locale === 'fa' ? '' : 'mdi-account'"
            :append-inner-icon="locale === 'fa' ? 'mdi-account' : ''"
            :reverse="locale === 'fa' ? true : false"
            hide-details
            @keyup.enter="registerHandler"
          >
            <template v-if="locale == 'fa'" v-slot:prepend-inner>
              <VIcon @click="username = ''">{{ locale === 'fa' ? 'mdi-close' : '' }}</VIcon>
            </template>
            <template v-else v-slot:append-inner>
              <VIcon @click="username = ''">{{ locale === 'fa' ? '' : 'mdi-close' }}</VIcon>
            </template>
          </VTextField>
        </VCardItem>
        <VCardItem>
          <VTextField
            v-model="password"
            :rules="baseRules"
            :label="$t('password')"
            :class="[
              'flex items-center justify-center mx-auto rounded-md w-[80%] my-2 border-2 child:text-[#1867C0]',
              theme.global.name.value === 'dark'
                ? 'border-white child:text-white'
                : 'border-[#1867C0] child:text-[#1867C0]'
            ]"
            :color="theme.global.name.value === 'dark' ? 'white' : ''"
            :type="visible ? 'text' : 'password'"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :reverse="locale === 'fa' ? true : false"
            hide-details
            @click:append-inner="visible = !visible"
            @keyup.enter="registerHandler"
          >
            <template v-if="locale == 'fa'" v-slot:prepend-inner>
              <VIcon @click="password = ''">{{ locale === 'fa' ? 'mdi-close' : '' }}</VIcon>
            </template>
            <template v-else v-slot:append-inner>
              <VIcon @click="password = ''">{{ locale === 'fa' ? '' : 'mdi-close' }}</VIcon>
            </template>
          </VTextField>
        </VCardItem>
        <VCardItem>
          <VTextField
            v-model="phoneNumber"
            :rules="phoneRules"
            :label="$t('phoneNumber')"
            :class="[
              'flex items-center justify-center mx-auto rounded-md w-[80%] my-2 border-2 child:text-[#1867C0]',
              theme.global.name.value === 'dark'
                ? 'border-white child:text-white'
                : 'border-[#1867C0] child:text-[#1867C0]'
            ]"
            :color="theme.global.name.value === 'dark' ? 'white' : ''"
            :prepend-inner-icon="locale === 'fa' ? '' : 'mdi-phone'"
            :append-inner-icon="locale === 'fa' ? 'mdi-phone' : ''"
            :reverse="locale === 'fa' ? true : false"
            inputmode="numeric"
            type="tel"
            hide-details
            @keyup.enter="registerHandler"
          >
            <template v-if="locale == 'fa'" v-slot:prepend-inner>
              <VIcon @click="phoneNumber = ''">{{ locale === 'fa' ? 'mdi-close' : '' }}</VIcon>
            </template>
            <template v-else v-slot:append-inner>
              <VIcon @click="phoneNumber = ''">{{ locale === 'fa' ? '' : 'mdi-close' }}</VIcon>
            </template>
          </VTextField>
        </VCardItem>
        <VCardItem>
          <VBtn width="30%" color="info" :disabled="!isValidationPhone" @click="registerHandler">{{
            $t('register')
          }}</VBtn>
        </VCardItem>
      </VCard>
      <div
        class="absolute -top-20 -left-20 bg-gradient-to-r from-cyan-500 to-cyan-800 w-[200px] h-[200px] rounded-full"
      ></div>
      <div
        class="absolute -bottom-20 -right-20 bg-gradient-to-r from-blue-500 to-blue-800 w-[200px] h-[200px] rounded-full"
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify/lib/framework.mjs'
import WrapperSnackBar from 'wrapper/WrapperSnackBar'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import { useSnackbar } from '@/composables/useSnackBar'
import { useLocalstorage } from '@/composables/useLocalstorage'
import { useRules } from '@/composables/useRules'
import useHttp from '@/composables/useHttp'
import router from '@/views'

const theme = useTheme()
const { t, locale } = useI18n()
const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { setLocalStorage } = useLocalstorage()
const { postApi } = useHttp()
const {
  baseRules,
  isValidationPhone,
  phoneRules,
  validatePhoneNumber,
  validationBase,
  isValidationUser
} = useRules()

const username = ref<string>('')
const password = ref<string>('')
const phoneNumber = ref<string>('')
const visible = ref<boolean>(false)

const registerHandler = async() => {
  validationBase()
  validatePhoneNumber()

  const newProfile = {
    id: crypto.randomUUID(),
    username: username.value,
    password: password.value,
    phoneNumber: phoneNumber.value,
    lang: 'English'
  }
  if (
    isValidationUser(username.value.trim()) &&
    isValidationUser(password.value.trim()) &&
    isValidationPhone(phoneNumber.value.trim())
  ) {
    try {
      postApi(`profile`, newProfile).then(() => {
        setLocalStorage('id', newProfile.id)
        setLocalStorage('username', username.value)
        setLocalStorage('theme', 'light')
        setLocalStorage('lang', 'en')
        showSnackbar(t('successModal'), 'success')
        router.push('/dashboard')
      })
    } catch {
      showSnackbar(t('error'), 'error')
    }
  } else {
    showSnackbar(t('error'), 'error')
  }
}
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