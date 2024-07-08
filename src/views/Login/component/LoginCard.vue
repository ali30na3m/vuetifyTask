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
              label="username"
              clearable
              autofocus
              width="70%"
              @keyup.enter="loginHandler"
            ></VTextField>
          </VCardItem>
          <VCardItem>
            <VBtn width="30%" color="info" @click="loginHandler">{{ $t('login') }}</VBtn>
          </VCardItem>
        </VCard>
      </VCol>
    </VRow>
    <VSnackbar v-model="snackbar" :color="colorSnackBar" timeout="3000" location="top right">
      {{ snackbarText }}
    </VSnackbar>
  </VContainer>
</template>
  
<script lang="ts" setup>
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import router from '@/views'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { width } = useResponsiveWidth()
const { t } = useI18n()

const snackbar = ref<boolean>(false)
const colorSnackBar = ref<string>('success')
const username = ref<string>('')
const snackbarText = ref<string>('')
const rules = [
  (value: string | null) => !!value || 'Required.',
  (value: string | null) => (value && value.length >= 4) || 'Min 4 characters',
  (value: string | null) => (value && value.length <= 10) || 'Max 10 characters'
]

const loginHandler = () => {
  if (username.value.length > 3 && username.value.length < 12) {
    localStorage.setItem('username', username.value)
    showSnackbar(t('successModal'), 'success')
    router.push('/dashboard')
  } else {
    alert('error')
  }
}

const showSnackbar = (message: string, color: string) => {
  snackbarText.value = message
  colorSnackBar.value = color
  snackbar.value = true
}
</script>