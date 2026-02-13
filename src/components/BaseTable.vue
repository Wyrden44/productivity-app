<script setup lang="ts">
import { computed } from 'vue'
import BaseTableCell from './BaseTableCell.vue'

interface TableColumn {
    key: string
    head: string
}

interface TableRow {
    [key: string]: unknown
}

const props = withDefaults(
    defineProps<{
        columns: TableColumn[]
        data: TableRow[]
        variant?: 'primary'
        cellSize?: 'sm' | 'md' | 'lg'
    }>(),
    {
        variant: 'primary',
        cellSize: 'md',
    },
)

const tableVariantClasses = computed(() => {
    switch (props.variant) {
        default:
            return 'divide-y divide-main-border'
    }
})

const headVariantClasses = computed(() => {
    switch (props.variant) {
        default:
            return 'bg-main-bg'
    }
})

const bodyVariantClasses = computed(() => {
    switch (props.variant) {
        default:
            return 'bg-main-bg'
    }
})
</script>

<template>
    <table :class="[tableVariantClasses]">
        <thead :class="[headVariantClasses]">
            <tr>
                <BaseTableCell v-for="col in props.columns" :key="col.key" :head="true">{{
                    col.head
                }}</BaseTableCell>
            </tr>
        </thead>
        <tbody :class="bodyVariantClasses">
            <tr v-for="(row, index) in data" :key="index">
                <BaseTableCell v-for="col in columns" :key="col.key">
                    <slot :name="`cell-${col.key}`" :value="row[col.key]"></slot>
                </BaseTableCell>
            </tr>
        </tbody>
    </table>
</template>
