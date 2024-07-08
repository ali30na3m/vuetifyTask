import { computed } from 'vue'
import { useDisplay } from 'vuetify'

export const useResponsiveWidth = () => {
  const { name } = useDisplay()

  const width = computed(() => {
    switch (name.value) {
      case 'xs':
        return 350
      case 'sm':
        return 400
      case 'md':
        return 500
      case 'lg':
        return 600
      case 'xl':
        return 800
      case 'xxl':
        return 1200
      default:
        return 100
    }
  })

  return { width }
}
