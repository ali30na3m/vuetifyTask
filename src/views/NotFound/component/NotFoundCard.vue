<template>
  <VContainer class="h-[95vh]">
    <VRow class="h-[95vh]" align="center" justify="center">
      <VCol cols="auto">
        <VCard class="text-center" :title="$t('notfound')" height="" :width="width">
          <VCardItem>
            <VBtn color="info">
              <router-link to="dashboard">
                {{ $t('gotoDashboard') }}
              </router-link>
            </VBtn>
          </VCardItem>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
    
  <script lang="ts" setup>
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'

const { width } = useResponsiveWidth()
</script>
    
    