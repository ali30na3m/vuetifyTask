import { ref } from 'vue'

export const useSnackbar = () => {
  const snackBar = ref(false)
  const colorSnackBar = ref('success')
  const snackbarText = ref('')

  const showSnackbar = (message: string, color: string) => {
    snackbarText.value = message
    colorSnackBar.value = color
    snackBar.value = true
  }

  return {
    snackBar,
    colorSnackBar,
    snackbarText,
    showSnackbar
  }
}
