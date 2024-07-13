<template>
    <div class="flex items-center gap-4 w-full px-3">
      <VTextField
        v-model="todoTitle"
        :rules="props.baseRules"
        :label="$t('todoList')"
        :class="[
          'child:text-purple rounded-md w-[350px] border-2',
          theme.global.name.value === 'dark' ? 'border-white' : 'border-[#1867C0]'
        ]"
        color="white"
        clearable
        hide-details
        @blur="props.validationTitle"
        @focus="props.validationTitle"
        @keyup.enter="$emit('addButton')"
      >
      </VTextField>
      <VSelect
        v-model="selectCategory"
        :items="categories"
        class="text-white rounded-md w-10"
        bg-color="primary"
        single-line
        hide-details
      />
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { useTheme } from 'vuetify/lib/framework.mjs'
  
  const theme = useTheme()
  const todoTitle = ref<string>('')
  const selectCategory = ref<string>('All')
  const categories = ref<string[]>(['All', 'Complete', 'UnComplete'])
  const props = defineProps<{ baseRules: ((value: string | null) => string | true)[], validationTitle: () => void }>()
  const emit = defineEmits(['addButton'])
  
  </script>
  
  <style>
  </style>
  