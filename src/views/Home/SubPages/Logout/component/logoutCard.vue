<template>
  <VCard class="text-center !shadow-none" :title="$t('logout')" :width="width">
    <p class="mt-4 text-2xl my-4">
      {{ $t('logoutText') }}
    </p>
    <div class="flex items-center justify-center gap-2 my-3">
      <VBtn class="child:text-xl" size="large" color="info" @click="logutHandler">
        {{ $t('yes') }}
      </VBtn>
      <VBtn class="child:text-xl" size="large" color="none">
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
import { t } from 'i18next'

const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()

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