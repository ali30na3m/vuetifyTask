import { t } from "i18next"

export const useRules = () => {
  const phoneRegex = /^[0-9]{11}$/

  const phoneRules = [
    (value: string) => !!value || 'Phone number is required',
    (value: string) => phoneRegex.test(value) || 'Phone number must be 11 digits'
  ]
  const userRules = [
    (value: string | null) => !!value || t('require'),
    (value: string | null) => (value && value.length >= 4) || t('minCharacter'),
    (value: string | null) => (value && value.length <= 12) || t('maxCharacters')
  ]

  const isValidationPhone = (title: string) => {
    return phoneRules.every((rule) => rule(title) === true)
  }
  const isValidationUser = (title: string) => {
    return userRules.every((rule) => rule(title) === true)
  }

  return {
    phoneRules,
    isValidationPhone,
    userRules,
    isValidationUser
  }
}
