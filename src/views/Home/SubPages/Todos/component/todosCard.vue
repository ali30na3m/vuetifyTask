<template>
  <VCard
    class="text-center !shadow-none !overflow-y-auto"
    :title="$t('todoList').toLocaleUpperCase()"
    :width="width"
    height="450px"
  >
    <div class="flex items-center gap-4 w-full px-3">
      <VTextField
        v-model="todoTitle"
        :rules="baseRules"
        :label="$t('todoList')"
        :class="[
          'child:text-purple rounded-md w-[350px] border-2',
          theme.global.name.value === 'dark' ? 'border-white' : 'border-purple'
        ]"
        color="white"
        clearable
        hide-details
        @blur="validateTodoTitle"
        @focus="validateTodoTitle"
        @keyup.enter="addButton"
      >
      </VTextField>
      <VSelect
        v-model="selectCategory"
        :items="categories"
        class="text-white bg-[#6c63ff] rounded-md w-10"
        single-line
        hide-details
      />
    </div>

    <div class="mt-8 px-3 w-full">
      <div class="flex items-center justify-center w-full" v-if="todos.length === 0">
        <img class="w-[200px] h-[200px]" src="../../../../../assets/images/19.jpg" alt="no todos" />
      </div>
      <div v-else v-for="todo in todos" :key="todo.id" class="py-3">
        <div
          v-if="selectCategory === 'All'"
          class="flex items-center justify-between w-full border-b-2 border-purple"
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
        <div
          v-if="selectCategory === 'Complete' && todo.isCompleted === true"
          class="flex items-center justify-between border-b-2 border-purple"
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
        <div
          v-if="selectCategory === 'UnComplete' && !todo.isCompleted"
          class="flex items-center justify-between border-b-2 border-purple"
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
      </div>
    </div>

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
          'child:text-purple rounded-md w-[350px] border-2',
          theme.global.name.value === 'dark' ? 'border-white' : 'border-purple'
        ]"
        color="white"
        hide-details
        @blur="validateEditTodoTitle"
        @focus="validateEditTodoTitle"
        @keyup.enter="updateTodo"
      />
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
      @update:isOpenDialog="searchDialog = $event"
      @updateTodo="updateTodo"
    >
      <VTextField
        v-model="searchTodo"
        :rules="baseRules"
        :label="$t('username')"
        :class="[
          ' rounded-md w-full my-2 border-2',
          theme.global.name.value === 'dark'
            ? 'border-white child:text-white'
            : 'border-purple child:text-purple'
        ]"
        color="white"
        prepend-inner-icon="mdi-magnify"
        clearable
        hide-details
        @keyup.enter="searchHandler"
      />
      <div
          v-for="todo in searchTodos"
          :key="todo.id"
          class="flex items-center justify-between w-full border-b-2 border-purple"
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
  <VBtn
    class="absolute right-0 -bottom-20 !shadow-none"
    icon
    color="#6c63ff"
    @click="searchTodoPrompt"
  >
    <VIcon color="white">mdi-magnify</VIcon>
  </VBtn>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify/lib/framework.mjs'
import WrapperSnackBar from 'wrapper/WrapperSnackBar'
import WrapperDialog from 'wrapper/WrapperDialog.tsx'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import useHttp from '@/composables/useHttp'
import { useSnackbar } from '@/composables/useSnackBar'
import { useLocalstorage } from '@/composables/useLocalstorage'
import type { TodosInfo } from './type'

const { t } = useI18n()
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

const todoTitleRules = ref<any[]>([])
const editTodoTitleRules = ref<any[]>([])


const baseRules = [
  (value: string | null) => !!value || t('require'),
  (value: string | null) => (value && value.length >= 4) || t('minCharacter'),
  (value: string | null) => (value && value.length <= 12) || t('maxCharacters')
]

const isValid = (title: string | null) => {
  return baseRules.every((rule) => rule(title) === true)
}

const validateTodoTitle = () => {
  todoTitleRules.value = baseRules
}

const validateEditTodoTitle = () => {
  editTodoTitleRules.value = baseRules
}

const getTodos = async () => {
  await getApi(`profile/${idUsername.value}?_embed=todos`).then((data) => {
    todos.value = data.todos
  })
}

const searchTodoPrompt = async () => {
  searchDialog.value = true
}

const searchHandler = () => {
  if (searchTodo.value) {
  const copyTodo = [...todos.value]
  const includeTodos = copyTodo.filter((todo:TodosInfo) =>  {
    if (todo.title.includes(searchTodo.value)){
      return todo
    }else {
      return null
    }
  })
    searchTodos.value = includeTodos
  }
}

const addButton = async () => {
  validateTodoTitle()
  validateEditTodoTitle()
  const newTodo = {
    id: crypto.randomUUID(),
    profileId: idUsername.value,
    title: todoTitle.value,
    isCompleted: false
  }
  if (isValid(todoTitle.value)) {
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
      if (isValid(editTodoTitle.value)) {
        await putApi(`todos/${editTodoId}`, title).then(() => {
          getTodos()
          searchHandler()
          showSnackbar(t('successEdit'), 'success')
        })
      } else {
        showSnackbar(t('warningEditTodo'), 'warning')
      }
    } catch {
      showSnackbar(t('error'), 'error')
    }
  }
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
