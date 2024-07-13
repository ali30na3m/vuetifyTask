<template>
  <VContainer class="flex items-center justify-center h-[95vh]">
    <div class="flex items-center justify-center">
      <VCard class="text-center" :title="$t('register')" height="" :width="width">
        <VCardItem>
          <VTextField
            v-model="username"
            :rules="baseRules"
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
            @blur="validationBase"
            @focus="validationBase"
            @keyup.enter="registerHandler"
          />
        </VCardItem>
        <VCardItem>
          <VTextField
            v-model="password"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :rules="baseRules"
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
            @blur="validationBase"
            @focus="validationBase"
            @keyup.enter="registerHandler"
          />
        </VCardItem>
        <VCardItem>
          <VTextField
            v-model="phoneNumber"
            :rules="phoneRules"
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
          <VBtn width="30%" color="info" :disabled="!isValidationPhone" @click="registerHandler">{{
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
const { t } = useI18n()
const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { setLocalStorage } = useLocalstorage()
const { postApi } = useHttp()
const {baseRules,isValidationPhone,phoneRules,validatePhoneNumber,validationBase} = useRules()

const username = ref<string>('')
const password = ref<string>('')
const phoneNumber = ref<number>()
const visible = ref<boolean>(false)


const registerHandler = () => {
  validationBase()
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