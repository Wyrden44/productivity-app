<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import TodoList from '@/features/todos/components/TodoList.vue'
import { ref } from 'vue'

const id = ref<number>(0)
const todo = ref<string>('')
const todos = ref<{ text: string; done: boolean; id: number }[]>([])

function addTodo(): void {
    if (todo.value) {
        todos.value.push({ text: todo.value, done: false, id: id.value++ })
        todo.value = ''
    }
}
</script>

<template>
    <section class="day-view min-w-100">
        <div class="flex border-b-2 border-main-border pb-3">
            <BaseInput type="text" v-model="todo" class="mr-2" />
            <BaseButton size="md" @click="addTodo"> Add </BaseButton>
        </div>
        <div class="todos">
            <TodoList :todos="todos" />
        </div>
    </section>
</template>
