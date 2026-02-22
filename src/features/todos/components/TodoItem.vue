<script setup lang="ts">
import BaseCheckbox from '@/components/BaseCheckbox.vue'
import type { Todo } from '../types'

const props = defineProps<{
    todo: Todo
}>()
</script>

<template>
    <div class="todo">
        <BaseCheckbox :id="String(todo.id)" :label="props.todo.text" :checked="props.todo.done" />
    </div>
</template>
