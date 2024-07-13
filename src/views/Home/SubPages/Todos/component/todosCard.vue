<template>
  <VCard
    class="text-center backdrop-blur-md !z-50 shadow-xl !overflow-y-auto"
    :title="$t('todoList').toLocaleUpperCase()"
    :width="width"
    height="400px"
  >
    <div class="flex items-center gap-4 w-full px-3">
      <VTextField
        v-model="todoTitle"
        :rules="baseRules"
        :label="$t('todoList')"
        :class="[
          'rounded-md w-[50%] my-2 border-2',
          theme.global.name.value === 'dark'
            ? 'border-white child:text-white'
            : 'border-[#1867C0] child:text-black'
        ]"
        :color="theme.global.name.value === 'dark' ? 'white' : ''"
        :reverse="locale === 'fa' ? true : false"
        hide-details
        @keyup.enter="addButton"
      >
        <template v-if="locale == 'fa'" v-slot:prepend-inner>
          <VIcon @click="todoTitle = ''">{{ locale === 'fa' ? 'mdi-close' : '' }}</VIcon>
          <VIcon @click="addButton">{{ locale === 'fa' ? 'mdi-plus' : '' }}</VIcon>
        </template>
        <template v-else v-slot:append-inner>
          <VIcon @click="todoTitle = ''">{{ locale === 'fa' ? '' : 'mdi-close' }}</VIcon>
          <VIcon @click="addButton">{{ locale === 'fa' ? '' : 'mdi-plus' }}</VIcon>
        </template>
      </VTextField>
      <VBtn height="54px" color="#1867C0" @click="searchTodoPrompt">
        <VIcon color="white">mdi-magnify</VIcon>
      </VBtn>
      <VSelect
        v-model="selectCategory"
        :items="categories"
        class="text-white rounded-md w-10"
        bg-color="primary"
        single-line
        hide-details
      />
    </div>

    <TodoStore
      :todos="todos"
      :checkBoxTodo="checkBoxTodo"
      :category="selectCategory"
      @editTodoCompleted="editTodoCompleted"
      @editTodoPropmt="editTodoPropmt"
      @removeTodoPrompt="removeTodoPrompt"
    />

    <WrapperDialog
      :isOpenDialog="editDialog"
      :headerTitle="$t('editTodo')"
      @update:isOpenDialog="editDialog = $event"
      @updateTodo="updateTodo"
    >
      <VTextField
        v-model="editTodoTitle"
        :rules="baseRules"
        :label="$t('todoList')"
        :class="[
          'child:text-[#1867C0] rounded-md w-full my-2 border-2',
          theme.global.name.value === 'dark'
            ? 'border-white child:text-white'
            : 'border-[#1867C0] child:text-[#1867C0]'
        ]"
        :color="theme.global.name.value === 'dark' ? 'white' : ''"
        :reverse="locale === 'fa' ? true : false"
        hide-details
        @keyup.enter="updateTodo"
      >
        <template v-if="locale == 'fa'" v-slot:prepend-inner>
          <VIcon @click="editTodoTitle = ''">{{ locale === 'fa' ? 'mdi-close' : '' }}</VIcon>
        </template>
        <template v-else v-slot:append-inner>
          <VIcon @click="editTodoTitle = ''">{{ locale === 'fa' ? '' : 'mdi-close' }}</VIcon>
        </template>
      </VTextField>
    </WrapperDialog>
    <WrapperDialog
      :isOpenDialog="removeDialog"
      :headerTitle="$t('removeTodo')"
      @update:isOpenDialog="removeDialog = $event"
      @updateTodo="removeTodoConfirm"
    >
      <div class="flex items-center justify-center">
        <VIcon
          class="!flex !items-center !justify-center !text-8xl !text-yellow-600 border-2 !border-yellow-600 !p-20 rounded-full"
          >mdi-alert</VIcon
        >
      </div>
    </WrapperDialog>
    <WrapperDialog
      :isOpenDialog="searchDialog"
      :headerTitle="$t('searchTodo')"
      @inputTitle="handleInputTitle"
      @update:isOpenDialog="searchDialog = $event"
      @updateTodo="searchDialog = $event"
    >
      <VTextField
        v-model="searchTodo"
        :rules="baseRules"
        :label="$t('searchTodo')"
        :class="[
          ' rounded-md w-full my-2 border-2',
          theme.global.name.value === 'dark'
            ? 'border-white child:text-white'
            : 'border-[#1867C0] child:text-[#1867C0]'
        ]"
        color="white"
        :prepend-inner-icon="locale === 'fa' ? '' : 'mdi-magnify'"
        :append-inner-icon="locale === 'fa' ? 'mdi-magnify' : ''"
        :reverse="locale === 'fa' ? true : false"
        hide-details
        @keyup.enter="searchHandler"
      >
        <template v-if="locale == 'fa'" v-slot:prepend-inner>
          <VIcon @click="searchTodo = ''">{{ locale === 'fa' ? 'mdi-close' : '' }}</VIcon>
          <VIcon @click="searchHandler">{{ locale === 'fa' ? 'mdi-magnify' : '' }}</VIcon>
        </template>
        <template v-else v-slot:append-inner>
          <VIcon @click="searchTodo = ''">{{ locale === 'fa' ? '' : 'mdi-close' }}</VIcon>
          <VIcon @click="searchHandler">{{ locale === 'fa' ? '' : 'mdi-magnify' }}</VIcon>
        </template>
      </VTextField>
      <div
        v-for="todo in searchTodos"
        :key="todo.id"
        :dir="locale === 'fa' ? 'rtl' : 'ltr'"
        class="flex items-center justify-between w-full border-b-2 border-[#1867C0]"
      >
        <div class="flex items-center">
          <VCheckbox
            v-model="todo.isCompleted"
            :value="!checkBoxTodo"
            color="indigo-darken-3"
            hide-details
            @click="editTodoCompleted(todo)"
          />
          <p
            :class="[
              'flex items-center justify-center',
              todo.isCompleted ? 'line-through text-gray-300' : ''
            ]"
          >
            {{ todo.title }}
          </p>
        </div>
        <div :class="['flex items-center gap-4', todo.isCompleted ? 'hidden' : '']">
          <VBtn icon class="!shadow-none" @click="editTodoPropmt(todo)">
            <VIcon class="hover:!text-blue-800" color="#d1d5db">mdi-pencil-outline</VIcon>
          </VBtn>
          <VBtn icon class="!shadow-none" @click="removeTodoPrompt(todo.id)">
            <VIcon class="hover:!text-red-600" color="#d1d5db">mdi-delete-outline</VIcon>
          </VBtn>
        </div>
      </div>
    </WrapperDialog>

    <WrapperSnackBar
      v-model:snackBar="snackBar"
      :snackbarText="snackbarText"
      :timeout="3000"
      :colorSet="colorSnackBar"
    />
  </VCard>
  <div
    :class="[
      locale == 'fa' ? '-right-20' : ' -left-20',
      'absolute -top-14 bg-gradient-to-r from-cyan-500 to-cyan-800 w-[200px] h-[200px] rounded-full'
    ]"
  ></div>
  <div
    :class="[
      locale == 'fa' ? '-left-20' : '-right-20',
      'absolute -bottom-14 bg-gradient-to-r from-blue-500 to-blue-800 w-[200px] h-[200px] rounded-full'
    ]"
  ></div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify/lib/framework.mjs'
import TodoStore from './TodosStore.vue'
import WrapperSnackBar from 'wrapper/WrapperSnackBar'
import WrapperDialog from 'wrapper/WrapperDialog.tsx'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import useHttp from '@/composables/useHttp'
import { useSnackbar } from '@/composables/useSnackBar'
import { useLocalstorage } from '@/composables/useLocalstorage'
import { useRules } from '@/composables/useRules'
import type { TodosInfo } from './type'

const { locale, t } = useI18n()
const theme = useTheme()

const { width } = useResponsiveWidth()
const { getApi, putApi, deleteApi, postApi } = useHttp()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { getLocalStorage } = useLocalstorage()

const selectCategory = ref<string>('All')
const categories = ref<string[]>(['All', 'Complete', 'UnComplete'])

const todoTitle = ref<string>('')
const searchTodo = ref<string>('')
const checkBoxTodo = ref<boolean>(false)
const todos = ref<TodosInfo[]>([])
const searchTodos = ref<TodosInfo[]>([])

const searchDialog = ref<boolean>(false)

const editDialog = ref<boolean>(false)
const editTodoTitle = ref<string>('')
let editTodoId: string | null = null

const removeDialog = ref(false)
const idTodo = ref<string>('')
const idUsername = ref<string | null>(getLocalStorage('id'))

const { validationBase, baseRules, isValidationUser } = useRules()

const getTodos = async () => {
  await getApi(`profile/${idUsername.value}?_embed=todos`).then((data) => {
    todos.value = data.todos
  })
}

const searchTodoPrompt = async () => {
  searchDialog.value = true
}

const handleInputTitle = (title: string) => {
  searchTodos.value = []
  searchTodo.value = title;
};


const searchHandler = () => {
  if (searchTodo.value) {
    const copyTodo = [...todos.value]
    const includeTodos = copyTodo.filter((todo: TodosInfo) => {
      if (todo.title.includes(searchTodo.value)) {
        return todo
      } else {
        return null
      }
    })
    searchTodos.value = includeTodos
  }
}

const addButton = async () => {
  validationBase()
  const newTodo = {
    id: crypto.randomUUID(),
    profileId: idUsername.value,
    title: todoTitle.value,
    isCompleted: false
  }
  if (isValidationUser(todoTitle.value)) {
    try {
      await postApi(`todos`, newTodo).then(() => {
        getTodos()
        showSnackbar(t('successAdd'), 'success')
      })
      todoTitle.value = ''
    } catch (error) {
      showSnackbar(t('error'), 'error')
    }
  } else {
    showSnackbar('Error: Todo must be between 4 and 10 characters', 'warning')
  }
}

const removeTodoPrompt = (id: string) => {
  idTodo.value = id
  removeDialog.value = true
}

const removeTodoConfirm = async () => {
  try {
    await deleteApi(`todos/${idTodo.value}`).then(() => {
      showSnackbar(t('successDeleted'), 'success')
      searchHandler()
      getTodos()
    })
    removeDialog.value = false
  } catch {
    showSnackbar(t('error'), 'error')
  }
}

const editTodoPropmt = (todo: TodosInfo) => {
  editTodoId = todo.id
  editTodoTitle.value = todo.title
  editDialog.value = true
}

const updateTodo = async (todo: TodosInfo) => {
  const title = {
    title: editTodoTitle.value.trim(),
    profileId: idUsername.value,
    isCompleted: todo.isCompleted
  }

  if (title && editTodoId) {
    try {
      if (isValidationUser(editTodoTitle.value)) {
        await putApi(`todos/${editTodoId}`, title).then(() => {
          getTodos()
          showSnackbar(t('successEdit'), 'success')
        })
      } else {
        showSnackbar(t('maxAndMinCharacter'), 'warning')
      }
    } catch {
      showSnackbar(t('error'), 'error')
    }
  }
  searchHandler()
  editDialog.value = false
}

const editTodoCompleted = async (todo: TodosInfo) => {
  const title = {
    title: todo.title.trim(),
    profileId: idUsername.value,
    isCompleted: !todo.isCompleted
  }

  try {
    await putApi(`todos/${todo.id}`, title).then(() => {
      getTodos()
      searchHandler()
      showSnackbar(t('successEdit'), 'success')
    })
  } catch {
    showSnackbar('error', 'error')
  }
}

onMounted(() => {
  getTodos()
})
</script>

<style scoped>
.v-card--variant-elevated {
  background: rgba(255, 255, 255, 0.11) !important;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.v-list {
  background: rgba(255, 255, 255, 0) !important;
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  -tw-backdrop-blur: blur(8px);
  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast)
    var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert)
    var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia) !important;
}
</style>