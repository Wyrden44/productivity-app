<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        size?: 'sm' | 'md' | 'lg'
        variant?: 'primary'
        head?: boolean
    }>(),
    {
        size: 'md',
        variant: 'primary',
        head: false,
    },
)

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'px-2 py-1'
        case 'lg':
            return 'px-5- py-3'
        default:
            return 'px-3 py-2'
    }
})

const colorClasses = computed(() => {
    switch (props.variant) {
        default:
            return 'bg-main-bg text-main-text'
    }
})

const headClass = computed(() => {
    return props.head ? 'font-semibold' : ''
})
</script>

<template>
    <td :class="[headClass, colorClasses, sizeClasses]"><slot /></td>
</template>
