import { createI18n } from "vue-i18n";
import messages from '@/locale'

export const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('lang') || 'en',
    fallbackLocale: 'en',
    messages
  })
