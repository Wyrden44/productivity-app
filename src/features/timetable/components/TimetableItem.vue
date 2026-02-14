<script setup lang="ts">
import { onMounted } from 'vue'
import BaseTable from '@/components/BaseTable.vue'
import { useTimetableStore } from '../store/timetable.store'
import BaseTableCell from '@/components/BaseTableCell.vue'
import type { Activity } from '../types'
import EditableCell from './EditableCell.vue'
import { isValidActivity, isValidFocus, isValidTime } from '@/utils/validator'

const store = useTimetableStore()

onMounted(() => {
    store.load()
})

const cols = [
    { key: 'startTime', head: 'Start' },
    { key: 'endTime', head: 'End' },
    { key: 'activity', head: 'Activity' },
    { key: 'focus', head: 'Focus' },
]

type ValidatorFn = (val: string) => boolean

const validators: Record<keyof Activity, ValidatorFn> = {
    id: () => true, // or whatever your Activity keys are
    startTime: (val) => isValidTime(String(val)),
    endTime: (val) => isValidTime(String(val)),
    activity: (val) => isValidActivity(String(val)),
    focus: (val) => isValidFocus(String(val)),
}

// In your template:
// :validator="validators[col.key as keyof Activity]"
</script>

<template>
    <table class="divide-y-2 divide-main-border">
        <thead class="bg-main-bg">
            <tr>
                <BaseTableCell v-for="col in cols" :key="col.key" :head="true">
                    {{ col.head }}
                </BaseTableCell>
            </tr>
        </thead>
        <tbody class="bg-main-bg divide-y divide-main-border">
            <tr v-for="activity in store.activities" :key="activity.id">
                <EditableCell
                    v-for="col in cols"
                    :key="activity.id + '-' + activity[col.key as keyof Activity]"
                    :model-value="String(activity[col.key as keyof Activity])"
                    :validator="validators[col.key as keyof Activity]"
                    @commit="(val) => store.edit(activity.id, col.key as keyof Activity, val)"
                />
            </tr>
        </tbody>
    </table>
    <BaseTable :columns="cols" :data="store.activities" />
</template>
