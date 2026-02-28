import { db } from '@/db/database'
import type { TodoDB } from './types/todo.db-model'
import type { Todo } from './types/todo.model'
import type { TodoRepository } from './types/todo.repository.model'

function toDB(todo: Todo): TodoDB {
    return {
        ...todo,
        updatedAt: Date.now(),
        synced: 0,
    }
}

export function toDomain(todos: TodoDB): Todo {
    return {
        id: todos.id,
        text: todos.text,
        done: todos.done,
    }
}

export const todoRepository: TodoRepository = {
    async getAll() {
        const items = await db.todos.toArray()
        return items.filter((t) => !t.deleted).map(toDomain)
    },

    async add(todo) {
        await db.todos.add(toDB(todo))
    },

    async update(id, key, val) {
        await db.todos
            .where('id')
            .equals(id)
            .modify({
                [key]: val,
                updatedAt: Date.now(),
                synced: 0,
            })
    },

    async delete(id) {
        await db.todos.where('id').equals(id).modify({
            deleted: 1,
            updatedAt: Date.now(),
            synced: 0,
        })
    },
}
