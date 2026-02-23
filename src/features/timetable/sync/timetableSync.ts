import { db } from '@/db/database'

export async function syncActivities() {
    const unsyncedActivities = await db.activities.where('synced').equals(0).toArray()

    for (const todo of unsyncedActivities) {
        try {
            // Simulate syncing todo
            await db.activities.update(todo.id, { synced: 1 })
        } catch (e) {
            console.error('Failed to sync todo:', todo, e)
        }
    }
}
