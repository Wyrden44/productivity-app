import type { ActivityDB } from '@/features/timetable/types/activity.db-model'
import type { TodoDB } from '@/features/todos/types/todo.db-model'
import Dexie, { type EntityTable } from 'dexie'

export const db = new Dexie('app') as Dexie & {
    todos: EntityTable<TodoDB, 'id'>
    activities: EntityTable<ActivityDB, 'id'>
}

db.version(1).stores({
    todos: '++pk, id, text, done, updatedAt, synced, deleted',
    activities: '++pk, id, title, description, date, updatedAt, synced, deleted',
})
