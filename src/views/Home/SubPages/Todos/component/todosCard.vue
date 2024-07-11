<template>
  <WrapperCard width="300">
    salam
  </WrapperCard>
  <!-- <VCard
    class="text-center overflow-y-auto "
    :title="$t('todoList').toLocaleUpperCase()"
    width="600px"
    height="400px"
  >
    <VCardText>
      <div class="flex items-center justify-between gap-5">
        <VTextField
          :loading="loading"
          class=""
          density="default"
          placeholder="Search note..."
          hide-details
          single-line
          width="300px"
          @click:append-inner="onClick"
          append-inner-icon="mdi-magnify"
        ></VTextField>

        <VSelect
        :items="items"
        label="All"
        width="40px"
        
        prepend-inner-icon="mdi-translate"
        hide-details
      ></VSelect>
      
      </div>
    </VCardText>

    <VCardText>
      <div class="flex items-center justify-between gap-2">
        <VTextField
          v-model="todoTitle"
          :rules="baseRules"
          :label="$t('todoList')"
          clearable
          autofocus
          @blur="validateTodoTitle"
          @focus="validateTodoTitle"
          @keyup.enter="addButton"
        />
        <VBtn color="info" append-icon="mdi-plus" @click="addButton" :disabled="!isValid">
          {{ $t('AddTodo') }}
        </VBtn>
      </div>
    </VCardText>

    <VList>
      <VListItem v-for="todo in todos" :key="todo.id">
        <div
          class="flex items-center justify-between w-full py-3 px-2 border-2 border-blue-400 rounded-lg"
        >
          <VListItemTitle class="text-start">{{ todo.title }}</VListItemTitle>
          <div class="flex items-center justify-end gap-3">
            <VBtn icon @click="editTodo(todo)" aria-label="Edit Todo">
              <VIcon color="blue">mdi-pencil</VIcon>
            </VBtn>
            <VBtn icon @click="removeTodoPrompt(todo.id)" aria-label="Remove Todo">
              <VIcon color="red">mdi-delete</VIcon>
            </VBtn>
          </div>
        </div>
      </VListItem>
    </VList>

    <VDialog v-model="editDialog" persistent max-width="600px">
      <VCard>
        <VCardTitle class="text-h5">{{ $t('editTodo') }}</VCardTitle>
        <VCardText>
          <VTextField
            v-model="editTodoTitle"
            :rules="baseRules"
            :label="$t('todoList')"
            clearable
            autofocus
            @blur="validateEditTodoTitle"
            @focus="validateEditTodoTitle"
            @keyup.enter="updateTodo"
          ></VTextField>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="blue darken-1" @click="editDialog = false">{{ $t('no') }}</VBtn>
          <VBtn color="blue darken-1" @click="updateTodo">{{ $t('yes') }}</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VDialog v-model="removeDialog" persistent max-width="600px">
      <VCard>
        <VCardTitle class="text-h5">{{ $t('warningEditTodo') }}</VCardTitle>
        <VCardActions>
          <VSpacer />
          <div>
            <VBtn color="blue darken-1" @click="removeDialog = false">{{ $t('no') }}</VBtn>
            <VBtn color="blue darken-1" @click="removeTodoConfirm">{{ $t('yes') }}</VBtn>
          </div>
        </VCardActions>
      </VCard>
    </VDialog>
    <WrapperSnackBar
      v-model:snackBar="snackBar"
      :snackbarText="snackbarText"
      :timeout="3000"
      :colorSet="colorSnackBar"
    />
  </VCard> -->
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import useHttp from '@/composables/useHttp'
import WrapperSnackBar from 'wrapper/WrapperSnackBar.vue'
import WrapperCard from 'wrapper/WrapperCard.tsx'
import { useSnackbar } from '@/composables/useSnackBar'
import { useLocalstorage } from '@/composables/useLocalstorage'
import type { TodosInfo } from './type'
import { VCardText } from 'vuetify/lib/components/index.mjs'

const { t } = useI18n()
const { width } = useResponsiveWidth()
const { getApi, putApi, deleteApi, postApi } = useHttp()
const { snackBar, colorSnackBar, snackbarText, showSnackbar } = useSnackbar()
const { getLocalStorage } = useLocalstorage()

const loaded = ref<boolean>(false)
const loading = ref<boolean>(false)

const items = ref<string[]>(['All', 'Complete', 'unComplete'])

const todoTitle = ref<string>('')
const todos = ref<TodosInfo[]>([])

const editDialog = ref(false)
const editTodoTitle = ref<string>('')
let editTodoId: string | null = null

const removeDialog = ref(false)
const idTodo = ref<string>('')
const idUsername = ref<string | null>(getLocalStorage('id'))

const todoTitleRules = ref<any[]>([])
const editTodoTitleRules = ref<any[]>([])

const onClick = () => {
  loading.value = true

  setTimeout(() => {
    loading.value = false
    loaded.value = true
  }, 2000)
}

const baseRules = [
  (value: string | null) => !!value || t('require'),
  (value: string | null) => (value && value.length >= 4) || t('minCharacter'),
  (value: string | null) => (value && value.length <= 10) || t('maxCharacters')
]

const isValid = computed(() => {
  return baseRules.every((rule) => rule(todoTitle.value) === true)
})

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
    title: todoTitle.value
  }
  if (isValid.value) {
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

const updateTodo = async () => {
  const title = {
    title: editTodoTitle.value.trim(),
    profileId: idUsername.value
  }
  if (title && editTodoId) {
    try {
      await putApi(`todos/${editTodoId}`, title).then(() => {
        getTodos()
        showSnackbar(t('successEdit'), 'success')
      })
    } catch {
      showSnackbar(t('error'), 'error')
    }
  }
  editDialog.value = false
}

onMounted(() => {
  getTodos()
})
</script>
