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
            return 'bg-gray-200 text-black hover:bg-gray-300'
        case 'danger':
            return 'bg-red-600 text-white hover:bg-red-700'
        default:
            return 'bg-black text-white hover:bg-gray-800'
    }
})

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'px-3 py-1 text-sm'
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
        class="rounded-lg border-black border font-medium transition duration-150 cursor-pointer hover:bg-white hover:text-black"
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
