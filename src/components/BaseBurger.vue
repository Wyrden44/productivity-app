<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    modelValue: boolean
    size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits(['update:modelValue'])

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'w-4'
        case 'lg':
            return 'w-8'
        default:
            return 'w-6'
    }
})

const burgerSizeClasses = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'h-0.5'
        case 'lg':
            return 'h-2'
        default:
            return 'h-1'
    }
})

const toggle = () => {
    emit('update:modelValue', !props.modelValue)
}
</script>

<template>
    <div
        class="flex flex-col cursor-pointer transition-all duration-300 gap-1"
        :class="sizeClasses"
        @click="toggle"
    >
        <div
            class="w-full bg-main-text transition-all duration-300 origin-left"
            :class="[burgerSizeClasses, modelValue ? 'rotate-45' : '']"
        ></div>

        <div
            class="w-full bg-main-text transition-all duration-300"
            :class="[burgerSizeClasses, modelValue ? 'opacity-0' : 'opacity-100']"
        ></div>

        <div
            class="w-full bg-main-text transition-all duration-300 origin-left"
            :class="[burgerSizeClasses, modelValue ? '-rotate-45' : '']"
        ></div>
    </div>
</template>
