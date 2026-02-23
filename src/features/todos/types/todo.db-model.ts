import type { Todo } from './todo.model'

export interface TodoDB extends Todo {
    updatedAt: number
    synced: 0 | 1
    deleted?: boolean
}
