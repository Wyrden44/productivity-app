<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    variant?: 'primary' | 'secondary' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
}>()

const variantClasses = computed(() => {
    switch (props.variant) {
        case 'secondary':
            return 'bg-gray-200 text-black hover:bg-gray-300 hover-text-main-text'
        case 'danger':
            return 'bg-main-surface text-main-danger hover:bg-main-danger hover:text-main-text hover:border-main-text border-main-danger'
        default:
            return 'bg-black text-white hover:bg-main-surface hover:text-main-text'
    }
})

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'px-2 py-1 text-sm'
        case 'lg':
            return 'px-6 py-3 text-lg'
        default:
            return 'px-4 py-2 text-base'
    }
})
</script>

<template>
    <button
        :disabled="disabled || loading"
        class="rounded-lg border-black border-2 font-medium transition duration-150 cursor-pointer"
        :class="[
            variantClasses,
            sizeClasses,
            disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
        ]"
    >
        <span v-if="loading">Loading...</span>
        <slot v-else />
    </button>
</template>
