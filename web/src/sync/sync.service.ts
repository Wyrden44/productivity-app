import { syncActivities } from '@web//features/timetable/sync/timetableSync'
import { syncTodos } from '@web//features/todos/sync/todoSync'

export async function syncAllUnsynced() {
    return Promise.all([syncTodos(), syncActivities()])
}
