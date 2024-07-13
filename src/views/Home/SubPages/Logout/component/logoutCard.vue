<template>
  <VCard class="text-center shadow-lg" :title="$t('logout')" :width="width">
    <p class="mt-4 text-2xl my-4">
      {{ $t('logoutText') }}
    </p>
    <div class="flex items-center justify-center gap-2 my-3">
      <VBtn color="info" @click="logutHandler">
        <router-link to="login">
          {{ $t('yes') }}
        </router-link>
      </VBtn>
      <VBtn  color="none">
        <router-link to="dashboard">
          {{ $t('no') }}
        </router-link>
      </VBtn>
    </div>
    <WrapperSnackBar
      v-model:snackBar="snackBar"
      :snackbarText="snackbarText"
      :timeout="3000"
      :colorSet="colorSnackBar"
    />
  </VCard>
 
</template>

<script lang="ts" setup>
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import { useSnackbar } from '@/composables/useSnackBar'
import { useI18n } from 'vue-i18n'

const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { t } = useI18n()

const logutHandler = () => {
  try {
    localStorage.clear()
    showSnackbar(t('successModal'), 'success')
  } catch {
    showSnackbar(t('error'), 'error')
  }
}
</script>

<style>
</style>