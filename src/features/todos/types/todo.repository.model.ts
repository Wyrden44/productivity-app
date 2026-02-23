import type { Todo } from './todo.model'

export interface TodoRepository {
    getAll(): Promise<Todo[]>
    add(todo: Todo): Promise<void>
    update<K extends keyof Todo>(id: Todo['id'], key: K, val: Todo[K]): Promise<void>
    delete(id: Todo['id']): Promise<void>
}
