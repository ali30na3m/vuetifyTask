<template>
  <VContainer class="flex items-center justify-center h-[95vh]">
    <div class="flex items-center justify-center">
      <VCard class="text-center" :title="$t('register')" height="" :width="width">
        <VCardItem>
          <VTextField
            v-model="username"
            :rules="usernameRules"
            class="m-auto"
            hide-details="auto"
            :label="$t('username')"
            clearable
            autofocus
            width="70%"
            @blur="validateUsername"
            @focus="validateUsername"
            @keyup.enter="registerHandler"
          ></VTextField>
        </VCardItem>
        <VCardItem>
          <VTextField
            v-model="password"
            :rules="passwordRules"
            class="m-auto"
            hide-details="auto"
            :label="$t('password')"
            clearable
            width="70%"
            @blur="validatePassword"
            @focus="validatePassword"
            @keyup.enter="registerHandler"
          ></VTextField>
        </VCardItem>
        <VCardItem>
          <VTextField
            v-model="phoneNumber"
            :rules="phoneNumberRules"
            class="m-auto"
            hide-details="auto"
            :label="$t('phoneNumber')"
            clearable
            width="70%"
            @blur="validatePhoneNumber"
            @focus="validatePhoneNumber"
            @keyup.enter="registerHandler"
          ></VTextField>
        </VCardItem>
        <VCardItem>
          <VBtn width="30%" color="info" :disabled="!isValid" @click="registerHandler">{{
            $t('register')
          }}</VBtn>
        </VCardItem>
      </VCard>
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import WrapperSnackBar from 'wrapper/WrapperSnackBar.vue'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import { useSnackbar } from '@/composables/useSnackBar'
import { useLocalstorage } from '@/composables/useLocalstorage'
import useHttp from '@/composables/useHttp'
import router from '@/views'

const { t } = useI18n()
const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { setLocalStorage } = useLocalstorage()
const { postApi } = useHttp()

const username = ref<string>('')
const password = ref<string>('')
const phoneNumber = ref<number>()

const usernameRules = ref<any[]>([])
const passwordRules = ref<any[]>([])
const phoneNumberRules = ref<any[]>([])

const baseRules = [
  (value: string | null) => !!value || t('require'),
  (value: string | null) => (value && value.length >= 4) || t('minCharacter'),
  (value: string | null) => (value && value.length <= 12) || t('maxCharacter')
]

const validateUsername = () => {
  usernameRules.value = baseRules
}
const validatePassword = () => {
  passwordRules.value = baseRules
}
const validatePhoneNumber = () => {
  phoneNumberRules.value = baseRules
}

const isValid = computed(() => {
  return baseRules.every((rule) => rule(username.value) === true && rule(password.value) === true)
})

const registerHandler = () => {
  validateUsername()
  validatePassword()
  validatePhoneNumber()

  const newProfile = {
    id: crypto.randomUUID(),
    username: username.value,
    password: password.value,
    phoneNumber: phoneNumber.value,
    lang: 'English'
  }
  if (username.value.trim() && password.value.trim() && phoneNumber.value) {
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
  }
}
</script>