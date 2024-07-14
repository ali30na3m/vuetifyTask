<template>
  <div>
    <slot name="default" />
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from '@/composables/useI18n';

const props = defineProps<{languageProps: string}>()

const { loadLocaleMessages } = useI18n()


</script>
