<script setup lang="ts">
import { computed } from 'vue'
import type { Todo } from '../types'
import TodoItem from './TodoItem.vue'
import { getDateDayMonth } from '@/utils/getters'
import BaseHeading from '@/components/BaseHeading.vue'

const props = defineProps<{
    todos: Todo[]
}>()

const date = computed(() => getDateDayMonth(new Date()))
</script>

<template>
    <div class="todo-list flex flex-col gap-3 mt-2 w-full pl-2 pr-2 pt-4 pb-2 min-h-80 mb-10">
        <BaseHeading>{{ date }}</BaseHeading>
        <TodoItem v-for="todo in props.todos" :todo="todo" :key="todo.id" />
    </div>
</template>
