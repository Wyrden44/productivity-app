<script setup lang="ts">
import BaseButton from '@web/components/BaseButton.vue'
import BaseInput from '@web/components/BaseInput.vue'
import TimetableItem from '@web/features/timetable/components/TimetableItem.vue'
import TodoList from '@web/features/todos/components/TodoList.vue'
import { useTodoListStore } from '@web/features/todos/store/todolist.store'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const todoStore = useTodoListStore()

const { todo } = storeToRefs(todoStore)

onMounted(() => {
    todoStore.load()
})
</script>

<template>
    <section class="day-view min-w-100">
        <form @submit.prevent="todoStore.addDraft" class="flex border-b-2 border-main-border pb-3">
            <BaseInput type="text" v-model="todo" class="mr-2" placeholder="Todo..." />
            <BaseButton size="md" type="submit">Add</BaseButton>
        </form>
        <TodoList :todos="todoStore.todos" class="mb-2" />
        <TimetableItem />
    </section>
</template>
