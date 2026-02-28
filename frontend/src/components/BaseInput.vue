<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    type?: 'text' | 'number' | 'email'
    variant?: 'primary'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
}>()

const variantClasses = computed(() => {
    switch (props.variant) {
        default:
            return 'border-gray-300 bg-white text-black focus:border-blue-500 outline-none'
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

const type = computed(() => {
    return props.variant || 'text'
})

const model = defineModel<string>()
</script>

<template>
    <input
        :disabled="disabled"
        class="border rounded"
        :class="[variantClasses, sizeClasses, disabled ? 'opacity-50 cursor-not-allowed' : '']"
        v-model="model"
        :type="type"
    />
</template>
