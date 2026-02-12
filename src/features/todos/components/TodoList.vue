<script setup lang="ts">
import type { Todo } from '../types'
import TodoItem from './TodoItem.vue'

const props = defineProps<{
    todos: Todo[]
}>()
</script>

<template>
    <div class="todo-list">
        <TodoItem v-for="todo in props.todos" :todo="todo" :key="todo.id" />
    </div>
</template>
