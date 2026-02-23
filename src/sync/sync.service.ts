import { db } from '@/db/database'
import { syncTodos } from '@/features/todos/sync/todoSync'

export async function syncAllUnsynced() {
    await Promise.all([syncTodos()])
}
