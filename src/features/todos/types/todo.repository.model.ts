import type { Todo } from './todo.model'

export interface TodoRepository {
    getAll(): Promise<Todo[]>
    add(todo: Todo): Promise<Todo['id']>
    update<K extends keyof Todo>(id: number, key: K, val: Todo[K]): Promise<void>
    delete(id: Todo['id']): Promise<void>
}
