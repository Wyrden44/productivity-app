import { defineStore } from 'pinia'
import type { Activity } from '../types'
import { createActivity, editActivity, fetchActivities } from '../api/timetable.api'

export const useTimetableStore = defineStore('timetable', {
    state: () => ({
        activities: [] as Activity[],
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
                console.error(e)
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
                console.log(this.activities)
                console.error(e)
            }
        },

        async add(activity: Activity) {
            this.loading = true
            try {
                createActivity(activity)
            } catch (e) {
                console.error(e)
                this.error = 'Failed to create activity'
            } finally {
                this.loading = false
            }
        },
    },
})
