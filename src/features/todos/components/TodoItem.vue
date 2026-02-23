<script setup lang="ts">
import BaseCheckbox from '@/components/BaseCheckbox.vue'
import type { Todo } from '../types/todo.model'

const props = defineProps<{
    todo: Todo
}>()

const emit = defineEmits<{
    (e: 'done', value: boolean): void
}>()

function onCheck(check: boolean) {
    emit('done', check)
}
</script>

<template>
    <div class="todo">
        <BaseCheckbox
            :id="String(todo.id)"
            :label="props.todo.text"
            :checked="props.todo.done"
            @check="onCheck"
        />
    </div>
</template>
