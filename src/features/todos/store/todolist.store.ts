import { defineStore } from 'pinia'
import type { Todo } from '../types/todo.model'
import { toDomain, todoRepository } from '../todoRepository'

export const useTodoListStore = defineStore('todolist', {
    state: () => ({
        todo: '',
        todos: [] as Todo[],
        loading: false,
        error: null as null | string,
        hideDone: false,
    }),

    getters: {
        filteredTodos: (state) => {
            return state.hideDone ? state.todos.filter((t) => !t.done) : state.todos
        },
    },

    actions: {
        async load() {
            this.loading = true
            try {
                this.todos = await todoRepository.getAll()
            } catch (e) {
                console.error(e)
                this.error = 'Failed to fetch todos'
            } finally {
                this.loading = false
            }
        },

        async edit<K extends keyof Todo>(id: string, key: K, value: Todo[K]) {
            const todo = this.todos.find((a) => a.id === id)

            if (!todo) {
                this.error = 'Todo could not be found'
                return
            }

            const old = todo[key]
            todo[key] = value

            try {
                // api call
                await todoRepository.update(id, key, value)
            } catch (e) {
                todo[key] = old
                console.error(e)
            }
        },

        async add(todo: Todo) {
            this.loading = true
            this.todos.push(todo)

            try {
                await todoRepository.add(todo)
            } catch (e) {
                const index = this.todos.findIndex((t) => t.id === todo.id)
                if (index !== -1) this.todos.splice(index, 1)
                this.error = 'Failed to create todo'
                throw e
            } finally {
                this.loading = false
            }
        },

        async delete(id: Todo['id']) {
            const activityIdx = this.todos.findIndex((a) => a.id === id)

            if (activityIdx === -1) {
                this.error = 'Todo could not be found'
                return
            }

            const backup = this.todos[activityIdx]!

            this.todos.splice(activityIdx, 1)

            try {
                await todoRepository.delete(id)
            } catch (e) {
                this.todos.splice(activityIdx, 0, backup)
                this.error = 'Failed to delete todo'
            }
        },

        async addDraft() {
            if (!this.todo || this.loading) return
            this.loading = true
            const todo = { id: crypto.randomUUID(), done: false, text: this.todo } as Todo
            this.todo = ''

            try {
                await this.add(todo)
            } catch (e) {
                console.error(e)
                this.todo = todo.text
            } finally {
                this.loading = false
            }
        },

        async deleteDone() {
            if (this.loading) return
            this.loading = true

            const doneTodos = this.todos.filter((t) => t.done)

            try {
                await Promise.all(doneTodos.map((t) => this.delete(t.id)))
            } catch (e) {
                console.error(e)
                this.error = 'Failed to delete completed todos'
            } finally {
                this.loading = false
            }
        },
    },
})
