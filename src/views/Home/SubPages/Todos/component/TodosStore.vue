<template>
  <div class="mt-8 px-3 w-full">
    <div class="flex items-center justify-center w-full" v-if="todos.length === 0">
      <img class="w-[200px] h-[200px]" src="../../../../../assets/images/19.jpg" alt="no todos" />
    </div>
    <div v-else v-for="todo in todos" :key="todo.id" class="py-3">
      <div
        v-if="category === 'All'"
        class="flex items-center justify-between w-full border-b-2 border-[#1867C0]"
      >
        <div class="flex items-center">
          <VCheckbox
            v-model="todo.isCompleted"
            :value="!checkBoxTodo"
            color="indigo-darken-3"
            hide-details
            @click="emit('editTodoCompleted')"
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
          <VBtn icon class="!shadow-none" @click="emit('editTodoPropmt',todo)">
            <VIcon class="hover:!text-blue-800" color="#d1d5db">mdi-pencil-outline</VIcon>
          </VBtn>
          <VBtn icon class="!shadow-none" @click="emit('removeTodoPrompt',todo.id)">
            <VIcon class="hover:!text-red-600" color="#d1d5db">mdi-delete-outline</VIcon>
          </VBtn>
        </div>
      </div>
      <div
        v-if="category === 'Complete' && todo.isCompleted === true"
        class="flex items-center justify-between border-b-2 border-[#1867C0]"
      >
        <div class="flex items-center">
          <VCheckbox
            v-model="todo.isCompleted"
            :value="!checkBoxTodo"
            color="indigo-darken-3"
            hide-details
            @click="emit('editTodoCompleted')"
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
          <VBtn icon class="!shadow-none" @click="emit('editTodoPropmt',todo)">
            <VIcon class="hover:!text-blue-800" color="#d1d5db">mdi-pencil-outline</VIcon>
          </VBtn>
          <VBtn icon class="!shadow-none" @click="emit('removeTodoPrompt',todo.id)">
            <VIcon class="hover:!text-red-600" color="#d1d5db">mdi-delete-outline</VIcon>
          </VBtn>
        </div>
      </div>
      <div
        v-if="category === 'UnComplete' && !todo.isCompleted"
        class="flex items-center justify-between border-b-2 border-[#1867C0]"
      >
        <div class="flex items-center">
          <VCheckbox
            v-model="todo.isCompleted"
            :value="!checkBoxTodo"
            color="indigo-darken-3"
            hide-details
            @click="emit('editTodoCompleted')"
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
          <VBtn icon class="!shadow-none" @click="emit('editTodoPropmt',todo)">
            <VIcon class="hover:!text-blue-800" color="#d1d5db">mdi-pencil-outline</VIcon>
          </VBtn>
          <VBtn icon class="!shadow-none" @click="emit('removeTodoPrompt',todo.id)">
            <VIcon class="hover:!text-red-600" color="#d1d5db">mdi-delete-outline</VIcon>
          </VBtn>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import type { TodosInfo } from '../type'

defineProps<{ todos: TodosInfo[]; category: string,checkBoxTodo:boolean }>()
const emit = defineEmits(['editTodoCompleted','editTodoPropmt','removeTodoPrompt'])
</script>
