<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import TimetableItem from '@/features/timetable/components/TimetableItem.vue'
import TodoList from '@/features/todos/components/TodoList.vue'
import { useTodoListStore } from '@/features/todos/store/todolist.store'
import { isValidTodo } from '@productivity/shared/src/utils/validator'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const todoStore = useTodoListStore()

const { todo } = storeToRefs(todoStore)

onMounted(() => {
    todoStore.load()
})

async function onTodoSubmit() {
    if (isValidTodo(todo.value)) {
        await todoStore.addDraft()
    }
}

const invalidClass = computed(() =>
    isValidTodo(todo.value) || todo.value.length < 1
        ? ''
        : 'focus:decoration-wavy focus:underline focus:decoration-main-error focus:underline-offset-2 focus:border-main-error',
)
</script>

<template>
    <section class="day-view min-w-100">
        <form @submit.prevent="onTodoSubmit" class="flex border-b-2 border-main-border pb-3">
            <BaseInput
                type="text"
                v-model="todo"
                class="mr-2"
                placeholder="Todo..."
                :class="invalidClass"
            />
            <BaseButton size="md" type="submit">Add</BaseButton>
        </form>
        <TodoList :todos="todoStore.todos" class="mb-2" />
        <TimetableItem />
    </section>
</template>
