<template>
  <VCard class="text-center !shadow-none" :title="$t('profile')" :width="width">
    <VCardText>
      <VTextField
        v-model="username"
        :rules="baseRules"
        :label="$t('username')"
        :class="[
          'child:text-purple rounded-md w-full my-2 border-2',
          theme.global.name.value === 'dark'
            ? 'border-white child:text-white'
            : 'border-purple child:text-purple'
        ]"
        :color="theme.global.name.value === 'dark' ? 'white' : ''"
        prepend-inner-icon="mdi-account"
        clearable
        hide-details
        @blur="validationBase"
        @focus="validationBase"
        @keyup.enter="submitHandler"
      />
      <VTextField
        v-model="phoneNumber"
        :rules="phoneRules"
        :label="$t('phoneNumber')"
        :class="[
          'child:text-purple rounded-md w-full my-2 border-2',
          theme.global.name.value === 'dark'
            ? 'border-white child:text-white'
            : 'border-purple child:text-purple'
        ]"
        :color="theme.global.name.value === 'dark' ? 'white' : ''"
        prepend-inner-icon="mdi-phone"
        clearable
        hide-details
        @blur="validatePhoneNumber"
        @focus="validatePhoneNumber"
        @keyup.enter="submitHandler"
      />
      <VSelect
        v-model="langSelect"
        :items="languages"
        label="Select Language"
        prepend-inner-icon="mdi-translate"
        class="text-white bg-[#6c63ff] rounded-md w-full my-2"
        persistent-hint
        single-line
        hide-details
      />
      <VSelect
        v-model="themeSelect"
        :items="themes"
        label="Select Theme"
        prepend-inner-icon="mdi-theme-light-dark"
        class="text-white bg-[#6c63ff] rounded-md w-full my-2"
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
  <VBtn class="absolute right-0 -bottom-20 !shadow-none" icon color="#6c63ff">
    <VIcon @click="openDiscription">mdi-account</VIcon>
  </VBtn>
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

const openDiscription = () => {
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
  validationBase()
  validatePhoneNumber()
  const newProfile = {
    username: username.value,
    password: password.value,
    phoneNumber: phoneNumber.value,
    lang: langSelect.value
  }
  try {
    if (isValidationUser(username.value) && isValidationPhone(phoneNumber.value)) {
      putApi(`profile/${id.value}`, newProfile).then(() => {
        setLocalStorage('theme', themeSelect.value)
        setLocalStorage('username', username.value)
        setLocalStorage('lang', langSelect.value == 'English' ? 'en' : 'fa')
        theme.global.name.value = themeSelect.value
        locale.value = langSelect.value == 'English' ? 'en' : 'fa'
        showSnackbar(t('successEdit'), 'success')
        getProfile()
      })
    } else {
      showSnackbar(t('error'), 'error')
    }
  } catch {
    showSnackbar(t('error'), 'error')
  }
}

onMounted(() => {
  getProfile()
})
</script>