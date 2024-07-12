<template>
  <VContainer class="flex item-center justify-center h-[95vh]">
    <div class="flex items-center justify-center">
      <VCard class="text-center !shadow-none" :title="$t('login')" :width="width">
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
            prepend-inner-icon="mdi-phone"
            clearable
            hide-details
            @blur="validateUsername"
            @focus="validateUsername"
            @keyup.enter="loginHandler"
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
            @keyup.enter="loginHandler"
          />
        </VCardItem>
        <VCardItem>
          <VBtn width="30%" color="info" @click="loginHandler" :disabled="!isValid">{{
            $t('login')
          }}</VBtn>
        </VCardItem>
        <VCardItem>
          <router-link class="text-blue-500" to="/register">{{ $t('haveAccount') }}</router-link>
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
import { useTheme } from 'vuetify/lib/framework.mjs'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import WrapperSnackBar from 'wrapper/WrapperSnackBar'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import { useSnackbar } from '@/composables/useSnackBar'
import { useLocalstorage } from '@/composables/useLocalstorage'
import useHttp from '@/composables/useHttp'
import router from '@/views'
import type { profileInfo } from '../type'

const theme = useTheme()
const { t } = useI18n()
const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { setLocalStorage } = useLocalstorage()
const { getApi } = useHttp()

const registerDatas = ref<profileInfo[]>([])
const username = ref<string>('')
const password = ref<string>('')
const visible = ref<boolean>(false)

const usernameRules = ref<any[]>([])
const passwordRules = ref<any[]>([])

const baseRules = [
  (value: string | null) => !!value || t('require'),
  (value: string | null) => (value && value.length >= 4) || t('minCharacter'),
  (value: string | null) => (value && value.length <= 10) || t('maxCharacter')
]

const validateUsername = () => {
  usernameRules.value = baseRules
}

const validatePassword = () => {
  passwordRules.value = baseRules
}

const isValid = computed(() => {
  return baseRules.every((rule) => rule(username.value) === true && rule(password.value) === true)
})

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
  if (!isValid.value) {
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
