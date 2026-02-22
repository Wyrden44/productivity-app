<script setup lang="ts">
import { computed } from 'vue'
import TodoItem from './TodoItem.vue'
import { getDateDayMonth } from '@/utils/getters'
import BaseHeading from '@/components/BaseHeading.vue'
import BaseToggle from '@/components/BaseToggle.vue'
import { useTodoListStore } from '../store/todolist.store'
import { storeToRefs } from 'pinia'

const store = useTodoListStore()
const { filteredTodos, hideDone } = storeToRefs(store)

const date = computed(() => getDateDayMonth(new Date()))
</script>

<template>
    <div class="todo-list flex flex-col gap-3 mt-2 w-full pl-2 pr-2 pt-4 pb-2 min-h-80 mb-10">
        <div class="flex justify-between">
            <BaseHeading>{{ date }}</BaseHeading>
            <div class="flex gap-2">
                <BaseToggle label="Hide done" v-model="hideDone" />
            </div>
        </div>
        <TodoItem v-for="todo in filteredTodos" :todo="todo" :key="todo.id" />
    </div>
</template>
