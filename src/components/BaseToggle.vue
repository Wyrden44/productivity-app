<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
    label: string
}>()

const emit = defineEmits(['update:modelValue'])

const toggle = () => {
    emit('update:modelValue', !props.modelValue)
}
</script>

<template>
    <label class="inline-flex items-center cursor-pointer group">
        <input type="checkbox" class="sr-only peer" :checked="modelValue" @change="toggle" />

        <div
            class="relative w-9 h-5 bg-main-inactive peer-focus:outline-none rounded-full peer peer-hover:after:ring ring-main-accent peer-checked:bg-main-accent peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-main-surface after:border-main-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all"
        ></div>

        <span v-if="label" class="ms-3 text-sm font-medium text-main-text transition-colors">
            {{ label }}
        </span>
    </label>
</template>
