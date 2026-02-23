import type { Todo } from '../types/todo.model'

const todos: Todo[] = [
    { done: false, text: 'Test Todo', id: 0 },
    { done: true, text: 'Test Done Todo', id: 1 },
]

let currentId = 3

export async function fetchTodos(): Promise<Todo[]> {
    return new Promise<Todo[]>((resolve) => {
        setTimeout(() => resolve(todos), 500)
    })
}

export async function createTodo(todo: Todo): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            todos.push(todo)
            return resolve(currentId++)
        }, 500)
    })
}

export async function editTodo<K extends keyof Todo>(id: number, key: K, newVal: Todo[K]) {
    const todo = todos.find((a) => a.id === id)

    if (!todo) throw Error('Todo not found')

    todo[key] = newVal

    return new Promise<string>((resolve) => {
        setTimeout(() => resolve('Todo updated'), 500)
    })
}

export async function removeTodo(id: Todo['id']) {
    const index = todos.findIndex((t) => t.id === id)
    if (index !== -1) todos.splice(index, 1)

    return new Promise<string>((resolve) => {
        setTimeout(() => resolve('Todo removed'), 500)
    })
}
