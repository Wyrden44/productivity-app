<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
    defineProps<{
        size?: 'sm' | 'md' | 'lg'
        color?: 'primary' | 'accent'
        label: string
        id: string
        checked?: boolean
        checkedCross?: boolean
    }>(),
    {
        size: 'md',
        color: 'primary',
        checked: false,
        checkedCross: true,
    },
)

const checked = ref(props.checked)

const emit = defineEmits<{
    (e: 'check', value: boolean): void
}>()

function onChange(e: Event) {
    const target = e.target as HTMLInputElement
    emit('check', target.checked)
}

const colorClasses = computed(() => {
    switch (props.color) {
        case 'accent':
            return 'checked:bg-main-accent hover:border-main-text'
        default:
            return 'checked:bg-main-text hover:border-main-accent'
    }
})

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'w-4 h-4'
        case 'lg':
            return 'w-7 h-7'
        default:
            return 'w-5 h-5'
    }
})
</script>

<template>
    <div class="w-full flex gap-2">
        <div class="relative flex items-center">
            <input
                type="checkbox"
                :id="props.id"
                :checked="checked"
                class="peer appearance-none border-2 border-main-text rounded-sm bg-white focus:outline-none cursor-pointer focus:ring-1 focus:ring-blue-100"
                :class="[colorClasses, sizeClasses]"
                @change="onChange"
            />

            <svg
                class="absolute pointer-events-none opacity-0 peer-checked:opacity-100 stroke-white"
                :class="[sizeClasses]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
            <label
                :for="props.id"
                class="ml-1 text-md"
                :class="
                    props.checkedCross
                        ? 'peer-checked:line-through peer-checked:text-main-secondary-text'
                        : ''
                "
            >
                {{ props.label }}
            </label>
        </div>
    </div>
</template>
