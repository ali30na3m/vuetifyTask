<template>
  <VContainer class="h-[95vh]">
    <VRow class="h-[95vh]" align="center" justify="center">
      <VCol cols="auto">
        <VCard class="text-center" :title="$t('register')" height="" :width="width">
          <VCardItem>
            <VTextField
              v-model="username"
              :rules="rules"
              class="m-auto"
              hide-details="auto"
              :label="$t('username')"
              clearable
              autofocus
              width="70%"
              @keyup.enter="registerHandler"
            ></VTextField>
          </VCardItem>
          <VCardItem>
            <VTextField
              v-model="password"
              :rules="rules"
              class="m-auto"
              hide-details="auto"
              :label="$t('password')"
              clearable
              autofocus
              width="70%"
              @keyup.enter="registerHandler"
            ></VTextField>
          </VCardItem>
          <VCardItem>
            <VTextField
              v-model="phoneNumber"
              :rules="rules"
              class="m-auto"
              hide-details="auto"
              :label="$t('phoneNumber')"
              clearable
              autofocus
              width="70%"
              @keyup.enter="registerHandler"
            ></VTextField>
          </VCardItem>
          <VCardItem>
            <VBtn width="30%" color="info" @click="registerHandler">{{ $t('register') }}</VBtn>
          </VCardItem>
        </VCard>
      </VCol>
    </VRow>
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
const rules = [
  (value: string | null) => !!value || t('require'),
  (value: string | null) => (value && value.length >= 4) || t('minCharacter'),
  (value: string | null) => (value && value.length <= 12) || t('maxCharacter')
]

const registerHandler = () => {
  const newProfile = {
    id: crypto.randomUUID(),
    username: username.value,
    password: password.value,
    phoneNumber: phoneNumber.value,
    lang: 'English'
  }
  if(username.value.trim() && password.value.trim() && phoneNumber.value){
    try {
      postApi(`profile`, newProfile).then(() => {
        setLocalStorage('id', newProfile.id)
        setLocalStorage('username', username.value)
        showSnackbar(t('successModal'), 'success')
        router.push('/dashboard')
      })
    } catch {
      showSnackbar(t('error'), 'error')
    }
  }
}
</script>