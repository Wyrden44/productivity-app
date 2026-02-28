import { db } from '@/db/database'
import type { Activity } from './types/activity.model'
import type { ActivityDB } from './types/activity.db-model'
import type { TimetableRepository } from './types/timetable.repository.model'

function toDB(activity: Activity): ActivityDB {
    return {
        ...activity,
        updatedAt: Date.now(),
        synced: 0,
    }
}

export function toDomain(activity: ActivityDB): Activity {
    return {
        id: activity.id,
        focus: activity.focus,
        activity: activity.activity,
        startTime: activity.startTime,
        endTime: activity.endTime,
    }
}

export const timetableRepository: TimetableRepository = {
    async getAll() {
        const items = await db.activities.toArray()
        return items.filter((t) => !t.deleted).map(toDomain)
    },

    async add(activity) {
        await db.activities.add(toDB(activity))
    },

    async update(id, key, val) {
        await db.activities
            .where('id')
            .equals(id)
            .modify({
                [key]: val,
                updatedAt: Date.now(),
                synced: 0,
            })
    },

    async delete(id) {
        await db.activities.where('id').equals(id).modify({
            deleted: 1,
            updatedAt: Date.now(),
            synced: 0,
        })
    },
}
