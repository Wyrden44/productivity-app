<script setup lang="ts" generic="T">
import { ref, watch, computed } from 'vue'
import BaseTableCell from '@/components/BaseTableCell.vue'

const props = defineProps<{
    modelValue: T
    validator: (val: T) => boolean // validator logic as prop
}>()

const emit = defineEmits<{
    (e: 'commit', value: string): void
}>()

const local = ref(props.modelValue)

watch(
    () => props.modelValue,
    (newVal) => (local.value = newVal),
)

const isValid = computed(() => props.validator(local.value))
const validClasses = computed(() =>
    isValid.value ? '' : 'decoration-wavy underline decoration-main-error underline-offset-2',
)

function commit() {
    if (isValid.value) {
        emit('commit', local.value)
    } else {
        local.value = props.modelValue
    }
}
</script>

<template>
    <BaseTableCell>
        <input
            type="text"
            v-model="local"
            @blur="commit"
            @keydown.enter="commit"
            :class="[validClasses]"
            class="w-full min-w-[35px] max-w-[120px] md:max-w-[200px] lg:max-w-none bg-transparent"
        />
    </BaseTableCell>
</template>
