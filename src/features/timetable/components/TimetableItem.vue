<script setup lang="ts">
import { onMounted } from 'vue'
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
</script>

<template>
    <div class="w-full">
        <table
            class="divide-y-2 divide-main-border overflow-x-auto border border-main-border rounded-lg"
        >
            <thead class="bg-main-bg">
                <tr>
                    <BaseTableCell v-for="col in cols" :key="col.key" :head="true">
                        {{ col.head }}
                    </BaseTableCell>
                </tr>
            </thead>
            <tbody class="bg-main-bg divide-y divide-main-border">
                <tr
                    v-for="activity in store.activities"
                    :key="activity.id"
                    class="divide-x divide-main-border relative group"
                >
                    <EditableCell
                        v-for="col in cols"
                        :key="activity.id + '-' + col.key"
                        :model-value="String(activity[col.key as keyof Activity])"
                        :validator="validators[col.key as keyof Activity]"
                        @commit="(val) => store.edit(activity.id, col.key as keyof Activity, val)"
                    />
                    <td
                        class="invisible group-hover:visible text-main-danger absolute -translate-x-1/2 top-1/2 -translate-y-1/2"
                    >
                        <button
                            class="cursor-pointer border border-main-text w-6 h-6 rounded-md bg-main-surface hover:border-main-danger"
                            @click="store.delete(activity.id)"
                        >
                            -
                        </button>
                    </td>
                </tr>
                <tr v-if="store.draftActivity" class="divide-x divide-main-border">
                    <EditableCell
                        v-for="col in cols"
                        :key="'draft' + '-' + col.key"
                        :model-value="String(store.draftActivity[col.key as keyof Activity])"
                        :validator="validators[col.key as keyof Activity]"
                        :reset-on-invalidate="false"
                        @commit="(val) => store.editDraft(col.key as keyof Activity, val)"
                    />
                </tr>
            </tbody>
        </table>
        <button
            @click="store.createDraft()"
            class="mt-2 w-full border-main-border bg-main-bg border cursor-pointer"
        >
            +
        </button>
        <p v-if="store.loading">Loading...</p>
    </div>
</template>
