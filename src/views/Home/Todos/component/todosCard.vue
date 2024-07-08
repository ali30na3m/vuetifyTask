<template>
  <VCard class="text-center overflow-y-auto" :title="$t('todoList')" :width="width" height="70%">
    <VCardText>
      <VRow align="center">
        <VCol cols="8">
          <VTextField
            v-model="todoTitle"
            :rules="rules"
            :label="$t('todoList')"
            clearable
            autofocus
            @keyup.enter="addButton"
          ></VTextField>   
        </VCol>
        <VCol cols="4">
          <VBtn
            width="100%"
            color="info"
            append-icon="mdi-plus"
            @click="addButton"
            :disabled="!isValid"
          >
            {{ $t('AddTodo') }}
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>

    <VList>
      <VListItem v-for="todo in todos" :key="todo.id">
        <div class="flex items-center justify-between w-full py-3 px-2 border-2 border-blue-400 rounded-lg">
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
            :rules="rules"
            label="Todo Title"
            clearable
            autofocus
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
          <VCardItem>
            <VBtn color="blue darken-1" @click="removeDialog = false">{{ $t('no') }}</VBtn>
            <VBtn color="blue darken-1" @click="removeTodoConfirm">{{ $t('yes') }}</VBtn>
          </VCardItem>
        </VCardActions>
      </VCard>
    </VDialog>
    <MySnackBar :snackbarText="snackbarText"  v-model:snackBar="isSnackBar" :timeout="3000" :colorSet="colorSnackBar"  />
  </VCard>
</template>
  
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResponsiveWidth } from '@/composables/useResponsiveWidth'
import useHttp from '@/composables/useHttp'
import MySnackBar from '@/component/MySnackBar.vue'
import type { TodosInfo } from './type'


const { t } = useI18n()
const { width } = useResponsiveWidth()

const todoTitle = ref<string>('')
const todos = ref<TodosInfo[]>([])

// var snackBar
const isSnackBar = ref<boolean>(false)
const colorSnackBar = ref<string>('success')
const snackbarText = ref<string>('')

// var dialog 
const editDialog = ref(false)
const editTodoTitle = ref<string>('')
let editTodoId: string | null = null

const removeDialog = ref(false)
const idTodo = ref('')

const { getApi, putApi, deleteApi, postApi } = useHttp()

const rules = [
  (value: string | null) => !!value || 'Required.',
  (value: string | null) => (value && value.length >= 4) || 'Min 4 characters',
  (value: string | null) => (value && value.length <= 10) || 'Max 10 characters'
]

const isValid = computed(() => {
  return rules.every((rule) => rule(todoTitle.value) === true)
})

const showSnackbar = (message: string, color: string) => {
  snackbarText.value = message
  colorSnackBar.value = color
  isSnackBar.value = true
}

const getTodos = () => {
  getApi('http://localhost:3000/todos').then(data => todos.value = data )
}


const addButton = () => {
  const newtodo = {
    id: crypto.randomUUID(),
    title: todoTitle.value
  }
  if (rules.every((rule) => rule(todoTitle.value))) {
    try{
      postApi('http://localhost:3000/todos', newtodo).then( () => getTodos())
      todoTitle.value = ''
      showSnackbar(t('successAdd'), 'success')
      console.log(isSnackBar.value);
    }catch (error) {
      console.log(error)
    }
  } else {
    alert('Error: Todo must be between 4 and 10 characters.')
  }
}

const removeTodoPrompt = (id: string) => {
  idTodo.value = id
  removeDialog.value = true
}

const removeTodoConfirm = () => {  
  try{
    deleteApi(`http://localhost:3000/todos/${idTodo.value}`).then(() => getTodos())
    showSnackbar(t('successDeleted'), 'success')
    removeDialog.value = false
  }catch {
    showSnackbar(t('error'), 'error')
  }
}

const editTodo = (todo: TodosInfo) => {
  editTodoId = todo.id
  editTodoTitle.value = todo.title
  editDialog.value = true
}

const updateTodo = () => {
  const title = editTodoTitle.value.trim()
  if (title && editTodoTitle.value) {
    try{
      putApi(`http://localhost:3000/todos/${editTodoId}`, {title},).then(() => getTodos())
      showSnackbar(t('successEdit'),'success')
    }catch(error) {
      console.log(error);
    }
  }
  editDialog.value = false
}

onMounted(() => {
  getTodos()
})

</script>
  