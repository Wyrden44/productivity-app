<script setup lang="ts">
import { computed, ref } from 'vue'
import TodoItem from './TodoItem.vue'
import { getDateDayMonth } from '@/utils/getters'
import BaseHeading from '@/components/BaseHeading.vue'
import BaseToggle from '@/components/BaseToggle.vue'
import { useTodoListStore } from '../store/todolist.store'
import { storeToRefs } from 'pinia'
import BaseButton from '@/components/BaseButton.vue'
import BaseBurger from '@/components/BaseBurger.vue'

const store = useTodoListStore()
const { filteredTodos, hideDone } = storeToRefs(store)

const menuOpen = ref(false)

function closeMenu() {
    menuOpen.value = false
}

const date = computed(() => getDateDayMonth(new Date()))
</script>

<template>
    <div class="todo-list flex flex-col gap-3 mt-2 w-full pl-2 pr-2 pt-4 pb-2 min-h-80 mb-10">
        <div class="flex justify-between relative">
            <BaseHeading>{{ date }}</BaseHeading>
            <BaseBurger v-model="menuOpen" size="md" />
            <div
                v-if="menuOpen"
                class="absolute right-0 top-10 bg-main-bg shadow-md p-3 flex flex-col border z-10 gap-4 rounded-md min-w-55"
                @mouseleave="closeMenu"
            >
                <BaseToggle label="Hide done" v-model="hideDone" />
                <BaseButton size="sm" variant="danger" @click="store.deleteDone"
                    >Delete Done</BaseButton
                >
            </div>
        </div>
        <TodoItem
            v-for="todo in filteredTodos"
            :todo="todo"
            :key="todo.id"
            @done="(done) => store.edit(todo.id, 'done', done)"
        />
    </div>
</template>
