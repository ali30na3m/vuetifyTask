import { i18n } from '@/plugins/i18n'
import { nextTick } from 'vue'

export const useI18n = () => {
  async function setI18nLanguage(locale: any) {
    i18n.global.setLocaleMessage(i18n.global.locale.value, locale)
    return nextTick()
  }

  async function loadLocaleMessages(localePath: string[]) {
    let messages1 = {}
    let messages2 = {}

    for await (const locale of localePath) {
      const m = await import(locale)
      if (m.default['en']) {
        messages1 = { ...messages1, ...m.default['en'] }
      }
      if (m.default['fa']) {
        messages2 = { ...messages2, ...m.default['fa'] }
      }
    }

    const messages = {en:messages1,fa:messages2}

    i18n.global.setLocaleMessage(i18n.global.locale.value, messages[i18n.global.locale.value])
    return nextTick()
  }

  return { setI18nLanguage, loadLocaleMessages }
}
