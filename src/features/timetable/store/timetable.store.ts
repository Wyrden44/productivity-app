import { defineStore } from 'pinia'
import type { Activity } from '../types'
import { createActivity, editActivity, fetchActivities } from '../api/timetable.api'
import { isValidActivity, isValidFocus, isValidTime } from '@/utils/validator'

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
                this.activities = await fetchActivities()
            } catch (e) {
                this.error = 'Failed to fetch activities'
            } finally {
                this.loading = false
            }
        },

        async edit<K extends keyof Activity>(id: number, key: K, value: Activity[K]) {
            const activity = this.activities.find((a) => a.id === id)

            if (!activity) return

            const old = activity[key]
            activity[key] = value

            try {
                // api call
                await editActivity(id, key, value)
            } catch (e) {
                activity[key] = old
                console.error(e)
            }
        },

        async add(activity: Activity) {
            this.loading = true
            try {
                const id = await createActivity(activity)
                activity.id = id
            } catch (e) {
                this.error = 'Failed to create activity'
                console.error(e)
            } finally {
                this.loading = false
            }
        },

        createDraft() {
            if (this.draftActivity) return
            this.draftActivity = {
                id: 0,
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
            try {
                await this.add(this.draftActivity)
            } catch (e) {
                console.error(e)
            } finally {
                this.loading = false
                this.draftActivity = null
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
