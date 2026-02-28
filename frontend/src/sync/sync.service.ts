import { syncActivities } from '@/features/timetable/sync/timetableSync'
import { syncTodos } from '@/features/todos/sync/todoSync'

export async function syncAllUnsynced() {
    return Promise.all([syncTodos(), syncActivities()])
}
