<template>
  <VSnackbar
    v-model="localSnackBar"
    :color="colorSet"
    :timeout="timeout"
    :location="locale === 'en' ? 'top right' : 'top left'"
  >
    {{ snackbarText }}
  </VSnackbar>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const props = defineProps<{
  snackBar: boolean
  snackbarText: string
  colorSet: string
  timeout: number
}>()

const emit = defineEmits(['update:snackBar'])

const localSnackBar = ref(props.snackBar)

watch(localSnackBar, (newVal) => {
  emit('update:snackBar', newVal)
})

watch(
  () => props.snackBar,
  (newVal) => {
    localSnackBar.value = newVal
  }
)
</script>
