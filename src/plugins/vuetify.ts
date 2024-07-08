import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css'

const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#ffffff',
    surface: '#FFFFFF',
    'primary-darken-1': '#3700B3',
    secondary: '#03DAC6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00'
  }
}

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#18181b',
    surface: '#3f3f46',
    primary: '#3f3f46',
    'primary-darken-1': '#52525b',
    secondary: '#03DAC6',
    'secondary-darken-1': '#03DAC6',
    error: '#CF6679',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00'
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
      dark
    }
  },
  icons: {
    defaultSet: 'mdi'
  }
})
