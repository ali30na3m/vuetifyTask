<template>
  <VCard
    class="text-center backdrop-blur-md !z-50 shadow-xl"
    :title="$t('profile')"
    :width="width"
  >
    <VCardText>
      <VTextField
        v-model="username"
        :rules="baseRules"
        :label="$t('username')"
        :class="[
          'rounded-md w-full my-2 border-2',
          theme.global.name.value === 'dark'
            ? 'border-white child:text-white'
            : 'border-[#1867C0] child:text-black'
        ]"
        :color="theme.global.name.value === 'dark' ? 'white' : ''"
        :reverse="locale == 'fa' ? true : false"
        :prepend-inner-icon="locale == 'fa' ? '' : 'mdi-account'"
        :append-inner-icon="locale == 'fa' ? 'mdi-account' : ''"
        hide-details
        @keyup.enter="submitHandler"
      >
        <template v-if="locale == 'fa'" v-slot:prepend-inner>
          <VIcon @click="username = ''">{{ locale === 'fa' ? 'mdi-close' : '' }}</VIcon>
        </template>
        <template v-else v-slot:append-inner>
          <VIcon @click="username = ''">{{ locale === 'fa' ? '' : 'mdi-close' }}</VIcon>
        </template>
      </VTextField>
      <VTextField
        v-model="phoneNumber"
        :rules="phoneRules"
        :label="$t('phoneNumber')"
        :class="[
          ' rounded-md w-full my-2 border-2',
          theme.global.name.value === 'dark'
            ? 'border-white child:text-white'
            : 'border-[#1867C0] child:text-black'
        ]"
        :color="theme.global.name.value === 'dark' ? 'white' : ''"
        :reverse="locale == 'fa' ? true : false"
        :prepend-inner-icon="locale == 'fa' ? '' : 'mdi-phone'"
        :append-inner-icon="locale == 'fa' ? 'mdi-phone' : ''"
        type="tel"
        hide-details
        @keyup.enter="submitHandler"
      >
        <template v-if="locale == 'fa'" v-slot:prepend-inner>
          <VIcon @click="phoneNumber = ''">{{ locale === 'fa' ? 'mdi-close' : '' }}</VIcon>
        </template>
        <template v-else v-slot:append-inner>
          <VIcon @click="phoneNumber = ''">{{ locale === 'fa' ? '' : 'mdi-close' }}</VIcon>
        </template>
      </VTextField>
      <VSelect
        v-model="langSelect"
        :items="languages"
        :reverse="locale == 'fa' ? true : false"
        label="Select Language"
        prepend-inner-icon="mdi-translate"
        class="text-white rounded-md w-full my-2"
        bg-color="primary"
        persistent-hint
        single-line
        hide-details
      />
      <VSelect
        v-model="themeSelect"
        :items="themes"
        :reverse="locale == 'fa' ? true : false"
        label="Select Theme"
        prepend-inner-icon="mdi-theme-light-dark"
        class="text-white rounded-md w-full my-2"
        bg-color="primary"
        persistent-hint
        single-line
        hide-details
      />
      <div class="flex items-center justify-center gap-3">
        <VBtn width="30%" color="info" @click="submitHandler">{{ $t('submit') }}</VBtn>
      </div>
    </VCardText>
    <WrapperSnackBar
      v-model:snackBar="snackBar"
      :snackbarText="snackbarText"
      :timeout="3000"
      :colorSet="colorSnackBar"
    />
  </VCard>
  <VBtn class="absolute right-0 -bottom-20 !shadow-none" icon color="#1867C0">
    <VIcon @click="openDiscription">mdi-account</VIcon>
  </VBtn>
  <WrapperDiscription
    v-model:show="showModal"
    :title="t('userPhoneTitle')"
    :theme="themeSelect"
    :contentTitle="titleDiscriptionData"
    :discriptionData="discriptionData"
  />
  <div
    :class="[
      locale == 'fa' ? '-right-20' : ' -left-20',
      'absolute -top-14 bg-gradient-to-r from-cyan-500 to-cyan-800 w-[200px] h-[200px] rounded-full'
    ]"
  ></div>
  <div
    :class="[
      locale == 'fa' ? '-left-20' : '-right-20',
      'absolute -bottom-14 bg-gradient-to-r from-blue-500 to-blue-800 w-[200px] h-[200px] rounded-full'
    ]"
  ></div>
</template>
  
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import WrapperSnackBar from 'wrapper/WrapperSnackBar'
import WrapperDiscription from 'wrapper/WrapperDiscription.jsx'
import useHttp from '@/composables/useHttp'
import { useLocalstorage } from '@/composables/useLocalstorage'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import { useSnackbar } from '@/composables/useSnackBar'
import { useRules } from '@/composables/useRules'
import type { profileInfo } from '@/views/Login/type'

const { locale, t } = useI18n()
const theme = useTheme()
const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { getApi, putApi } = useHttp()
const { setLocalStorage, getLocalStorage } = useLocalstorage()
const {
  validatePhoneNumber,
  phoneRules,
  isValidationPhone,
  validationBase,
  baseRules,
  isValidationUser
} = useRules()

const username = ref<string>('')
const password = ref<string>('')
const phoneNumber = ref<string>('')
const langSelect = ref<string>('English')
const languages = ref<string[]>(['English', 'Persian'])
const themeSelect = ref<string>('light')
const themes = ref<string[]>(['light', 'dark'])
const id = ref<string | null>(getLocalStorage('id'))
const showModal = ref<boolean>(false)
const discriptionData = ref<string[]>([])
const titleDiscriptionData = ref<string[]>([])

const openDiscription = () => {
  showModal.value = true
}

const getProfile = async () => {
  await getApi(`profile/${id.value}`).then((data: profileInfo) => {
    username.value = data.username
    password.value = data.password
    phoneNumber.value = data.phoneNumber
    langSelect.value = data.lang
    discriptionData.value = [data.username, data.password, data.lastTimeUpdated, data.phoneNumber]
    titleDiscriptionData.value = [
      t('username'),
      t('password'),
      t('lastTimeUpdated'),
      t('userPhone')
    ]

    themeSelect.value = getLocalStorage('theme') || 'light'
  })
}

const submitHandler = async () => {
  validationBase()
  validatePhoneNumber()
  const newProfile = {
    username: username.value,
    password: password.value,
    phoneNumber: phoneNumber.value,
    lang: langSelect.value,
    lastTimeUpdated: new Date().toISOString()
  }

  try {
    if (isValidationUser(username.value) && isValidationPhone(phoneNumber.value)) {
      await putApi(`profile/${id.value}`, newProfile)
      setLocalStorage(
        'theme',
        themeSelect.value === 'دارک' || themeSelect.value === 'dark' ? 'dark' : 'light'
      )
      setLocalStorage('username', username.value)
      setLocalStorage(
        'lang',
        langSelect.value === 'English' || langSelect.value === 'انگلیسی' ? 'en' : 'fa'
      )
      theme.global.name.value = themeSelect.value
      locale.value = langSelect.value === 'English' ? 'en' : 'fa'
      showSnackbar(t('successEdit'), 'success')
      await getProfile()
    } else {
      showSnackbar(t('inValidUserAndPassword'), 'error')
    }
  } catch {
    showSnackbar(t('errorPut'), 'error')
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