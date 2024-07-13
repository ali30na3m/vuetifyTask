import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
export const useRules = () => {
  const phoneRegex = /^09[0-9]{9}$/
  const usernameRules = ref<any[]>([])
  const phoneNumberRules = ref<any[]>([])
const {t} = useI18n()
  const phoneRules = [
    (value: string) => !!value || t('phoneRequire'),
    (value: string) => phoneRegex.test(value) || t('phoneDigits')
  ]
  const baseRules = [
    (value: string) => !!value || t('require'),
    (value: string) => (value && value.length >= 4) || t('minCharacter'),
    (value: string) => (value && value.length <= 12) || t('maxCharacters')
  ]

  const isValidationPhone = (title: string) => {
    return phoneRules.every((rule) => rule(title) === true)
  }
  const isValidationUser = (title: string) => {
    return baseRules.every((rule) => rule(title) === true)
  }

  const validationBase = () => {
      usernameRules.value = baseRules
  }
  const validatePhoneNumber = () => {
    phoneNumberRules.value = phoneRules
  }

  return {
    phoneRules,
    isValidationPhone,
    baseRules,
    isValidationUser,
    validationBase,
    validatePhoneNumber
  }
}
