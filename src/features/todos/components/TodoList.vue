<script setup lang="ts">
import type { Todo } from '../types'
import TodoItem from './TodoItem.vue'

const props = defineProps<{
    todos: Todo[]
}>()
</script>

<template>
    <div class="todo-list flex flex-col gap-3 mt-2 w-full pl-2 pr-2 pt-4 pb-2">
        <TodoItem v-for="todo in props.todos" :todo="todo" :key="todo.id" />
    </div>
</template>
