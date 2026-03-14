import { defineStore } from 'pinia'
import type { Activity } from '../types/activity.model'
import {
    isValidActivity,
    isValidFocus,
    isValidTime,
} from '@productivity/shared/src/utils/validator'
import { timetableRepository } from '../timetableRepository'

export const useTimetableStore = defineStore('timetable', {
    state: () => ({
        activities: [] as Activity[],
        draftActivity: null as Activity | null, // used when adding new activity that are not filled out yet
        loading: false,
        error: null as string | null,
    }),

    getters: {},

    actions: {
        async load() {
            this.loading = true
            try {
                this.activities = await timetableRepository.getAll()
            } catch (e) {
                this.error = 'Failed to fetch activities'
                console.error(e)
            } finally {
                this.loading = false
            }
        },

        async edit<K extends keyof Activity>(id: Activity['id'], key: K, value: Activity[K]) {
            const activity = this.activities.find((a) => a.id === id)

            if (!activity) {
                this.error = 'Activity could not be found'
                return
            }

            const old = activity[key]
            activity[key] = value

            try {
                // api call
                await timetableRepository.update(id, key, value)
            } catch (e) {
                activity[key] = old
                console.error(e)
            }
        },

        async add(activity: Activity) {
            this.loading = true
            this.activities.push(activity)

            try {
                await timetableRepository.add(activity)
            } catch (e) {
                const index = this.activities.findIndex((a) => a.id === activity.id)
                this.activities.splice(index, 1)
                this.error = 'Failed to create activity'
                throw e
            } finally {
                this.loading = false
            }
        },

        async delete(id: Activity['id']) {
            const activityIdx = this.activities.findIndex((a) => a.id === id)

            if (activityIdx === -1) {
                this.error = 'Activity could not be found'
                return
            }

            const backup = this.activities[activityIdx]!

            this.activities.splice(activityIdx, 1)

            try {
                await timetableRepository.delete(id)
            } catch (e) {
                this.activities.splice(activityIdx, 0, backup)
                this.error = 'Failed to delete activity'
                throw e
            }
        },

        createDraft() {
            if (this.draftActivity) return
            this.draftActivity = {
                id: crypto.randomUUID(),
                startTime: '',
                endTime: '',
                activity: '',
                focus: '',
            }
        },

        async editDraft<K extends keyof Activity>(key: K, value: Activity[K]) {
            if (!this.draftActivity) return
            this.draftActivity[key] = value
            await this.addDraft()
        },

        async addDraft() {
            if (!this.draftActivity || !this.isDraftValid() || this.loading) return
            this.loading = true
            const draft = { ...this.draftActivity }
            this.draftActivity = null

            try {
                await this.add(draft)
            } catch (e) {
                console.error(e)
                this.draftActivity = draft
            } finally {
                this.loading = false
            }
        },

        isDraftValid() {
            return (
                this.draftActivity?.startTime &&
                this.draftActivity.endTime &&
                this.draftActivity.focus &&
                this.draftActivity.activity &&
                isValidTime(this.draftActivity?.startTime) &&
                isValidTime(this.draftActivity?.endTime) &&
                isValidFocus(this.draftActivity?.focus) &&
                isValidActivity(this.draftActivity?.activity)
            )
        },
    },
})
