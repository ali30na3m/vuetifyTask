<template>
  <VContainer class="h-[95vh]">
    <VRow class="h-[95vh]" align="center" justify="center">
      <VCol cols="auto">
        <VCard class="text-center" :title="$t('login')" height="" :width="width">
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
              @keyup.enter="loginHandler"
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
              @keyup.enter="loginHandler"
            ></VTextField>
          </VCardItem>
          <VCardItem>
            <VBtn width="30%" color="info" @click="loginHandler">{{ $t('login') }}</VBtn>
          </VCardItem>
          <VCardItem>
            <router-link  to="/register">{{ $t('haveAccount') }}</router-link>
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
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import WrapperSnackBar from 'wrapper/WrapperSnackBar.vue'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import { useSnackbar } from '@/composables/useSnackBar'
import { useLocalstorage } from '@/composables/useLocalstorage'
import useHttp from '@/composables/useHttp'
import router from '@/views'
import type { profileInfo } from '../type'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { setLocalStorage } = useLocalstorage()
const { getApi } = useHttp()

const registerDatas = ref<profileInfo[]>([])
const username = ref<string>('')
const password = ref<string>('')

const rules = [
  (value: string | null) => !!value || t('require'),
  (value: string | null) => (value && value.length >= 4) || t('minCharacter'),
  (value: string | null) => (value && value.length <= 10) || t('maxCharacter')
]
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
  const findUsername = registerDatas.value.find((data: profileInfo) => {
    if (username.value === data.username && password.value == data.password){
      return data
    }
  })

  if (findUsername) {
    showSnackbar(t('success'), 'success')
    setLocalStorage('username', username.value)
    setLocalStorage('id', findUsername.id)
    router.push('/dashboard')
  } else {
    showSnackbar(t('error'), 'error')
  }
}

onMounted(() => {
  getProfile()
})
</script>