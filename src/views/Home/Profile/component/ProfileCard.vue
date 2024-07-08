<template>
  <VCard class="main-content text-center" :title="$t('profile')" :width="width">
    <VCardText>
      <VTextField
        v-model="username"
        :rules="rules"
        :label="$t('username')"
        clearable
        autofocus
        @keyup.enter="submitHandler"
      />
      <VSelect
        v-model="langSelect"
        :items="languages"
        label="Select Language"
        persistent-hint
        single-line
        autofocus
      />
      <VSelect
        v-model="themeSelect"
        :items="themes"
        label="Select Theme"
        persistent-hint
        single-line
        autofocus
      />
      <VBtn width="30%" color="info" @click="submitHandler">{{ $t('submit') }}</VBtn>
    </VCardText>

    <VSnackbar
      v-model="snackbar"
      :color="colorSnackBar"
      :location="locale === 'en' ? 'top right' : 'top left'"
      timeout="3000"
    >
      {{ snackbarText }}
    </VSnackbar>
  </VCard>
</template>
  
  <script lang="ts" setup>
import { useLocalstorage } from '@/composables/useLocalstorage'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

const { locale, t } = useI18n()

const theme = useTheme()

const { width } = useResponsiveWidth()
const { setLocalStorage, getLocalStorage } = useLocalstorage()

const username = ref<string>('')
const langSelect = ref<string>('English')
const languages = ref<string[]>(['English', 'Persian'])
const themeSelect = ref<string>('light')
const themes = ref<string[]>(['light', 'dark'])

const snackbar = ref(false)
const snackbarText = ref('')
const colorSnackBar = ref('success')

const rules = [
  (value: string | null) => !!value || 'Required.',
  (value: string | null) => (value && value.length >= 4) || 'Min 4 characters',
  (value: string | null) => (value && value.length <= 10) || 'Max 10 characters'
]

const submitHandler = () => {
  const getUsername = getLocalStorage('username')
  const getLang = getLocalStorage('lang')
  const getTheme = getLocalStorage('theme')

  if (username.value.length > 3) {
    setLocalStorage('username', username.value)
  }
  setLocalStorage('lang', langSelect.value == 'English' ? 'en' : 'fa')
  setLocalStorage('theme', themeSelect.value)

  theme.global.name.value = themeSelect.value
  locale.value = langSelect.value == 'English' ? 'en' : 'fa'

  if (
    username.value == getUsername &&
    langSelect.value == (getLang == 'en' ? 'English' : 'Persian') &&
    themeSelect.value == getTheme
  ) {
    showSnackbar(t('noChangesModal'), 'warning')
  } else {
    showSnackbar(t('successModal'), 'success')
  }
}

const showSnackbar = (message: string, color: string) => {
  snackbarText.value = message
  colorSnackBar.value = color
  snackbar.value = true
}

onMounted(() => {
  username.value = getLocalStorage('username') || ''

  const getLang = getLocalStorage('lang') == 'en' ? 'English' : 'Persian'
  if (getLang) langSelect.value = getLang
  const getTheme = getLocalStorage('theme')
  if (getTheme) themeSelect.value = getTheme
})
</script>
  
  