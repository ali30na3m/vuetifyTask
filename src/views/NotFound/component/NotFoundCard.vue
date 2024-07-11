<template>
  <VContainer class="flex items-center justify-center h-[95vh]">
    <div class="flex items-center justify-center">
      <VCard class="text-center" :title="$t('notfound')" height="" :width="width">
        <VCardItem>
          <VBtn color="info">
            <router-link to="dashboard">
              {{ $t('gotoDashboard') }}
            </router-link>
          </VBtn>
        </VCardItem>
      </VCard>
    </div>
  </VContainer>
</template>
    
  <script lang="ts" setup>
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'

const { width } = useResponsiveWidth()
</script>
    
    