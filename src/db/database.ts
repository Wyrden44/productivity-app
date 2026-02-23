import type { Activity } from '@/features/timetable/types'
import type { TodoDB } from '@/features/todos/types/todo.db-model'
import type { Todo } from '@/features/todos/types/todo.model'
import Dexie, { type EntityTable } from 'dexie'

export const db = new Dexie('app') as Dexie & {
    todos: EntityTable<TodoDB, 'id'>
    activities: EntityTable<Activity, 'id'>
}

db.version(1).stores({
    todos: '++id, text, done, updatedAt, synced, deleted',
    activities: '++id, title, description, date, updatedAt, synced, deleted',
})
