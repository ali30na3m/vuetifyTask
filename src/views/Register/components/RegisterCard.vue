<template>
  <VContainer class="flex items-center justify-center h-[95vh]">
    <div class="flex items-center justify-center">
      <VCard class="text-center" :title="$t('register')" height="" :width="width">
        <VCardItem>
          <VTextField
            v-model="username"
            :rules="usernameRules"
            :label="$t('username')"
            :class="[
              'flex items-center justify-center mx-auto rounded-md w-[80%] my-2 border-2 child:text-purple',
              theme.global.name.value === 'dark'
                ? 'border-white child:text-white'
                : 'border-purple child:text-purple'
            ]"
            :color="theme.global.name.value === 'dark' ? 'white' : ''"
            prepend-inner-icon="mdi-account"
            clearable
            hide-details
            @blur="validateUsername"
            @focus="validateUsername"
            @keyup.enter="registerHandler"
          />
        </VCardItem>
        <VCardItem>
          <VTextField
            v-model="password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :rules="passwordRules"
            :label="$t('password')"
            :class="[
              'flex items-center justify-center mx-auto rounded-md w-[80%] my-2 border-2 child:text-purple',
              theme.global.name.value === 'dark'
                ? 'border-white child:text-white'
                : 'border-purple child:text-purple'
            ]"
            :color="theme.global.name.value === 'dark' ? 'white' : ''"
            :type="visible ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock"
            clearable
            hide-details
            @click:append-inner="visible = !visible"
            @blur="validatePassword"
            @focus="validatePassword"
            @keyup.enter="registerHandler"
          />
        </VCardItem>
        <VCardItem>
          <VTextField
            v-model="phoneNumber"
            :rules="phoneNumberRules"
            :label="$t('phoneNumber')"
            :class="[
              'flex items-center justify-center mx-auto rounded-md w-[80%] my-2 border-2 child:text-purple',
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
            @keyup.enter="registerHandler"
          />
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
import { useTheme } from 'vuetify/lib/framework.mjs'
import WrapperSnackBar from 'wrapper/WrapperSnackBar'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import { useSnackbar } from '@/composables/useSnackBar'
import { useLocalstorage } from '@/composables/useLocalstorage'
import useHttp from '@/composables/useHttp'
import router from '@/views'

const theme = useTheme()
const { t } = useI18n()
const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { setLocalStorage } = useLocalstorage()
const { postApi } = useHttp()

const username = ref<string>('')
const password = ref<string>('')
const phoneNumber = ref<number>()
const visible = ref<boolean>(false)

const usernameRules = ref<any[]>([])
const passwordRules = ref<any[]>([])
const phoneNumberRules = ref<any[]>([])
const phoneRegex = /^[0-9]{11}$/

const baseRules = [
  (value: string | null) => !!value || t('require'),
  (value: string | null) => (value && value.length >= 4) || t('minCharacter'),
  (value: string | null) => (value && value.length <= 12) || t('maxCharacter')
]

const phoneRules = [
  (value: string) => !!value || 'Phone number is required',
  (value: string) => phoneRegex.test(value) || 'Phone number must be 11 digits'
]

const validateUsername = () => {
  usernameRules.value = baseRules
}
const validatePassword = () => {
  passwordRules.value = baseRules
}
const validatePhoneNumber = () => {
  phoneNumberRules.value = phoneRules
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