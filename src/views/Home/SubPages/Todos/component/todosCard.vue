<template>
  <VCard
    class="text-center !shadow-none !overflow-y-auto"
    :title="$t('todoList').toLocaleUpperCase()"
    :width="width"
    height="400px"
  >
    <div class="flex items-center gap-4 w-full px-3">
      <VTextField
        v-model="todoTitle"
        :rules="baseRules"
        :label="$t('todoList')"
        :clearable="true"
        :reverse="true"
        class="border-2 border-purple child:text-purple rounded-md w-[350px]"
        color="white"
        hide-details
        @blur="validateTodoTitle"
        @focus="validateTodoTitle"
        @keyup.enter="addButton"
      >
      </VTextField>
      <VSelect
        v-model="selectCategory"
        :items="categories"
        class="text-white bg-[#6c63ff] rounded-md"
        :style="{ width: '40px' }"
        single-line
        hide-details
      />
    </div>

    <div class="mt-8 px-3 w-full">
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="flex item-center justify-between border-b-2 border-purple py-3"
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
          <VBtn icon class="!shadow-none" @click="editTodo(todo)">
            <VIcon class="hover:!text-blue-800" color="#d1d5db">mdi-pencil-outline</VIcon>
          </VBtn>
          <VBtn icon class="!shadow-none" @click="removeTodoPrompt(todo.id)">
            <VIcon class="hover:!text-red-600" color="#d1d5db">mdi-delete-outline</VIcon>
          </VBtn>
        </div>
      </div>
    </div>

    <WrapperDialog
      :editDialog="editDialog"
      @update:editDialog="editDialog = $event"
      @updateTodo="updateTodo"
    >
      <VTextField
        v-model="editTodoTitle"
        :rules="baseRules"
        :label="$t('todoList')"
        class="border-2 border-purple child:text-purple rounded-md w-[350px]"
        color="white"
        hide-details
        :reverse="true"
        :clearable="true"
        @blur="validateEditTodoTitle"
        @focus="validateEditTodoTitle"
        @keyup.enter="updateTodo"
      />
    </WrapperDialog>

    <WrapperDialog
      :edit-dialog="removeDialog"
      @update:edit-dialog="removeDialog = $event"
      @updateTodo="removeTodoConfirm"
    >
      <div class="flex items-center justify-center">
        <VIcon
          class="!flex !items-center !justify-center !text-8xl !text-yellow-600 border-2 !border-yellow-600 !p-20 rounded-full"
          >mdi-alert</VIcon
        >
      </div>
    </WrapperDialog>

    <WrapperSnackBar
      v-model:snackBar="snackBar"
      :snackbarText="snackbarText"
      :timeout="3000"
      :colorSet="colorSnackBar"
    />
  </VCard>
  <VBtn class="absolute right-0 -bottom-24 !shadow-none" icon color="#6c63ff">
    <VIcon color="white">mdi-plus</VIcon>
  </VBtn>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import WrapperSnackBar from 'wrapper/WrapperSnackBar'
import WrapperDialog from 'wrapper/WrapperDialog.tsx'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import useHttp from '@/composables/useHttp'
import { useSnackbar } from '@/composables/useSnackBar'
import { useLocalstorage } from '@/composables/useLocalstorage'
import type { TodosInfo } from './type'

const { t } = useI18n()

const { width } = useResponsiveWidth()
const { getApi, putApi, deleteApi, postApi } = useHttp()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { getLocalStorage } = useLocalstorage()

const selectCategory = ref<string>('All')
const categories = ref<string[]>(['All', 'Complete', 'UnComplete'])

const todoTitle = ref<string>('')
const checkBoxTodo = ref<boolean>(false)
const todos = ref<TodosInfo[]>([])

const editDialog = ref(false)
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

const editTodo = (todo: TodosInfo) => {
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
  console.log('title', title)

  try {
    await putApi(`todos/${todo.id}`, title).then((data) => {
      console.log('title', data)
      getTodos()
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
