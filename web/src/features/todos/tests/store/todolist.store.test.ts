import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoListStore } from '../../store/todolist.store'

vi.mock('../../todoRepository', () => ({
    todoRepository: {
        getAll: vi.fn(),
        add: vi.fn(),
        delete: vi.fn(),
        update: vi.fn(),
    },
}))

import { todoRepository } from '../../todoRepository'

describe('useTodoListStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('load sets todos', async () => {
        vi.mocked(todoRepository.getAll).mockResolvedValue([{ id: '1', text: 'A', done: false }])

        const store = useTodoListStore()
        await store.load()

        expect(store.todos.length).toBe(1)
        expect(store.loading).toBe(false)
    })

    it('add pushes and persists', async () => {
        vi.mocked(todoRepository.add).mockResolvedValue(undefined)

        const store = useTodoListStore()

        await store.add({ id: '1', text: 'A', done: false })

        expect(store.todos.length).toBe(1)
        expect(todoRepository.add).toHaveBeenCalled()
        expect(store.loading).toBe(false)
    })

    it('add rolls back on failure', async () => {
        vi.mocked(todoRepository.add).mockRejectedValue(new Error())

        const store = useTodoListStore()

        await expect(store.add({ id: '1', text: 'A', done: false })).rejects.toThrow()

        expect(store.todos.length).toBe(0)
        expect(store.error).toBe('Failed to create todo')
        expect(store.loading).toBe(false)
    })

    it('edit updates and persists', async () => {
        vi.mocked(todoRepository.update).mockResolvedValue(undefined)

        const store = useTodoListStore()
        store.todos = [{ id: '1', text: 'A', done: false }]

        await store.edit('1', 'done', true)

        expect(store.todos.length).toBe(1)
        expect(store.todos[0]!.done).toBe(true)
        expect(todoRepository.update).toHaveBeenCalled()
    })

    it('edit rolls back on failure', async () => {
        vi.mocked(todoRepository.update).mockRejectedValue(new Error())

        const store = useTodoListStore()
        store.todos = [{ id: '1', text: 'A', done: false }]

        await store.edit('1', 'done', true)

        expect(store.todos.length).toBe(1)
        expect(store.todos[0]!.done).toBe(false)
        expect(todoRepository.update).toHaveBeenCalled()
    })

    it('edit sets error if todo is not found', async () => {
        vi.mocked(todoRepository.update).mockResolvedValue(undefined)

        const store = useTodoListStore()
        store.todos = [{ id: '1', text: 'A', done: false }]

        await store.edit('2', 'done', true)

        expect(todoRepository.update).not.toHaveBeenCalled()
        expect(store.error).toBe('Todo could not be found')
    })

    it('delete removes and persists', async () => {
        vi.mocked(todoRepository.delete).mockResolvedValue(undefined)

        const store = useTodoListStore()
        store.todos = [{ id: '1', text: 'A', done: false }]

        await store.delete('1')

        expect(store.todos.length).toBe(0)
        expect(todoRepository.delete).toHaveBeenCalled()
    })

    it('delete rolls back on failure', async () => {
        vi.mocked(todoRepository.delete).mockRejectedValue(new Error())

        const store = useTodoListStore()
        store.todos = [{ id: '1', text: 'A', done: false }]

        await expect(store.delete('1')).rejects.toThrow()

        expect(store.todos.length).toBe(1)
        expect(store.error).toBe('Failed to delete todo')
    })

    it('filteredTodos hides done when enabled', () => {
        const store = useTodoListStore()
        store.todos = [
            { id: '1', text: 'A', done: false },
            { id: '2', text: 'B', done: true },
        ]
        store.hideDone = true

        expect(store.filteredTodos.length).toBe(1)
        expect(store.filteredTodos[0]).toMatchObject({ id: '1', text: 'A', done: false })
    })

    it('addDraft adds a draft correctly', async () => {
        const store = useTodoListStore()
        store.todo = 'Test'

        const addSpy = vi.spyOn(store, 'add').mockResolvedValue(undefined)

        await store.addDraft()

        expect(addSpy).toHaveBeenCalledTimes(1)
        expect(store.todo).toBe('')
        expect(store.loading).toBe(false)
    })

    it('addDraft does nothing if todo empty', async () => {
        const store = useTodoListStore()

        const addSpy = vi.spyOn(store, 'add')

        await store.addDraft()

        expect(addSpy).not.toHaveBeenCalled()
        expect(store.loading).toBe(false)
    })

    it('addDraft restores text if add fails', async () => {
        const store = useTodoListStore()

        store.todo = 'Test'

        vi.spyOn(store, 'add').mockRejectedValue(new Error())

        await store.addDraft()

        expect(store.todo).toBe('Test')
        expect(store.loading).toBe(false)
    })

    it('deleteDone deletes only completed todos', async () => {
        const store = useTodoListStore()

        store.todos = [
            { id: '1', text: 'A', done: true },
            { id: '2', text: 'B', done: false },
            { id: '3', text: 'C', done: true },
        ]

        const deleteSpy = vi.spyOn(store, 'delete').mockResolvedValue(undefined)

        await store.deleteDone()

        expect(deleteSpy).toHaveBeenCalledTimes(2)
        expect(deleteSpy).toHaveBeenCalledWith('1')
        expect(deleteSpy).toHaveBeenCalledWith('3')
        expect(store.loading).toBe(false)
    })

    it('deleteDone sets error if deletion fails', async () => {
        const store = useTodoListStore()

        store.todos = [{ id: '1', text: 'A', done: true }]

        vi.spyOn(store, 'delete').mockRejectedValue(new Error())

        await store.deleteDone()

        expect(store.error).toBe('Failed to delete completed todos')
        expect(store.loading).toBe(false)
    })
})
