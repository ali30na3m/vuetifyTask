<template>
  <VCard class="main-content text-center" :title="$t('profile')" :width="width">
    <VCardText>
      <VTextField
        v-model="username"
        :rules="baseRules"
        :label="$t('username')"
        prepend-inner-icon="mdi-account"
        clearable
        autofocus
        @blur="validateUsername"
        @focus="validateUsername"
        @keyup.enter="submitHandler"
      />
      <VTextField
        v-model="phoneNumber"
        :rules="baseRules"
        :label="$t('phoneNumber')"
        prepend-inner-icon="mdi-phone"
        clearable
        @blur="validatePhoneNumber"
        @focus="validatePhoneNumber"
        @keyup.enter="submitHandler"
      />
      <VSelect
        v-model="langSelect"
        :items="languages"
        label="Select Language"
        prepend-inner-icon="mdi-translate"
        persistent-hint
        single-line
      />
      <VSelect
        v-model="themeSelect"
        :items="themes"
        label="Select Theme"
        prepend-inner-icon="mdi-theme-light-dark"
        persistent-hint
        single-line
      />
      <div class="flex items-center justify-center gap-3">
        <VBtn width="30%" color="info" @click="submitHandler">{{ $t('submit') }}</VBtn>
        <VBtn width="30%" color="info" @click="openModal">{{ $t('showUserDetail') }}</VBtn>
      </div>
    </VCardText>
    <WrapperSnackBar
      v-model:snackBar="snackBar"
      :snackbarText="snackbarText"
      :timeout="3000"
      :colorSet="colorSnackBar"
    />
  </VCard>
  <WrapperDiscription
    v-model:show="showModal"
    :title="t('userPhoneTitle')"
    :contentTitle="$t('userPhone')"
    :theme="themeSelect"
    :content="phoneNumber"
  />
</template>
  
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import WrapperSnackBar from 'wrapper/WrapperSnackBar.vue'
import WrapperDiscription from 'wrapper/WrapperDiscription.jsx'
import useHttp from '@/composables/useHttp'
import { useLocalstorage } from '@/composables/useLocalstorage'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import { useSnackbar } from '@/composables/useSnackBar'
import type { profileInfo } from '@/views/Login/type'

const { locale, t } = useI18n()
const theme = useTheme()
const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { getApi, putApi } = useHttp()
const { setLocalStorage, getLocalStorage } = useLocalstorage()

const username = ref<string>('')
const password = ref<string>('')
const phoneNumber = ref<string>('')
const langSelect = ref<string>('English')
const languages = ref<string[]>(['English', 'Persian'])
const themeSelect = ref<string>('light')
const themes = ref<string[]>(['light', 'dark'])
const id = ref<string | null>(getLocalStorage('id'))
const showModal = ref<boolean>(false)

const usernameRules = ref<any[]>([])
const phoneNumberRules = ref<any[]>([])

const baseRules = [
  (value: string | null) => !!value || t('require'),
  (value: string | null) => (value && value.length >= 4) || t('minCharacter'),
  (value: string | null) => (value && value.length <= 12) || t('maxCharacters')
]

const validateUsername = () => {
  usernameRules.value = baseRules
}
const validatePhoneNumber = () => {
  phoneNumberRules.value = baseRules
}

const openModal = () => {
  showModal.value = true
}

const getProfile = async () => {
  await getApi(`profile/${id.value}`).then((data: profileInfo) => {
    username.value = data.username
    phoneNumber.value = data.phoneNumber
    password.value = data.password
    langSelect.value = data.lang
    themeSelect.value = getLocalStorage('theme') || 'light'
  })
}

const submitHandler = () => {
  validateUsername()
  validatePhoneNumber()
  const newProfile = {
    username: username.value,
    password: password.value,
    phoneNumber: phoneNumber.value,
    lang: langSelect.value
  }
  try {
    putApi(`profile/${id.value}`, newProfile).then(() => {
      setLocalStorage('theme', themeSelect.value)
      setLocalStorage('username', username.value)
      setLocalStorage('lang', langSelect.value == 'English' ? 'en' : 'fa')
      theme.global.name.value = themeSelect.value
      locale.value = langSelect.value == 'English' ? 'en' : 'fa'
      showSnackbar(t('successEdit'), 'success')
      getProfile()
    })
  } catch {
    showSnackbar(t('error'), 'error')
  }
}

onMounted(() => {
  getProfile()
})
</script>