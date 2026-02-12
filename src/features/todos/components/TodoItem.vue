<script setup lang="ts">
import type { Todo } from '../types'

const props = defineProps<{
    todo: Todo
}>()
</script>

<template>
    <div class="todo">
        <p>{{ props.todo.done }}</p>
        <p>{{ props.todo.text }}</p>
    </div>
</template>
