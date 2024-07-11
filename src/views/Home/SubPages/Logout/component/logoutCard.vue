<template>
  <VCard class="main-content text-center" :title="$t('logout')" :width="width">
    <VCardText class="mt-4">
      {{ $t('logoutText') }}
    </VCardText>
    <div class="flex items-center justify-center gap-2 my-3">
      <VBtn color="info" @click="logutHandler">
        {{ $t('yes') }}
      </VBtn>

      <VBtn color="none">
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
import { t } from 'i18next';

const { width } = useResponsiveWidth()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()

const logutHandler = () => {
    try{
        localStorage.clear()
        showSnackbar(t('successModal'), 'success')
    }catch{
        showSnackbar(t('error'), 'error')
    }
}
</script>

<style>
</style>