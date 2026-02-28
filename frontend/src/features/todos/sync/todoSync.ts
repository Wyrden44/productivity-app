import { db } from '@/db/database'

export async function syncTodos() {
    const unsyncedTodos = await db.todos.where('synced').equals(0).toArray()

    for (const todo of unsyncedTodos) {
        try {
            // Simulate syncing todo
            await db.todos.update(todo.id, { synced: 1 })
        } catch (e) {
            console.error('Failed to sync todo:', todo, e)
        }
    }
}
