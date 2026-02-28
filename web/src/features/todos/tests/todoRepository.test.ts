import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '@web//db/database'
import { todoRepository, toDomain } from '../todoRepository'
import type { TodoDB } from '../types/todo.db-model'

describe('todoRepository', () => {
    beforeEach(async () => {
        await db.todos.clear()
    })

    describe('getAll', () => {
        it('returns non-deleted todos mapped to domain model', async () => {
            await db.todos.bulkAdd([
                { id: '1', text: 'Todo 1', done: false, deleted: 0, updatedAt: 1000, synced: 1 },
                { id: '2', text: 'Todo 2', done: true, deleted: 0, updatedAt: 2000, synced: 1 },
                { id: '3', text: 'Todo 3', done: false, deleted: 1, updatedAt: 3000, synced: 0 },
            ])

            const result = await todoRepository.getAll()

            expect(result).toEqual([
                { id: '1', text: 'Todo 1', done: false },
                { id: '2', text: 'Todo 2', done: true },
            ])
        })

        it('returns empty array when none exist', async () => {
            const result = await todoRepository.getAll()
            expect(result).toEqual([])
        })
    })

    describe('add', () => {
        it('adds todo with synced and updatedAt', async () => {
            await todoRepository.add({
                id: '1',
                text: 'New todo',
                done: false,
            })

            const rows = await db.todos.toArray()

            expect(rows.length).toBe(1)
            expect(rows[0]).toMatchObject({
                id: '1',
                text: 'New todo',
                done: false,
                synced: 0,
            })
            expect(rows[0]!.updatedAt).toBeTypeOf('number')
        })
    })

    describe('update', () => {
        it('updates todo and sets synced flag', async () => {
            await db.todos.add({
                id: '1',
                text: 'Todo',
                done: false,
                deleted: 0,
                synced: 1,
                updatedAt: 1,
            })

            await todoRepository.update('1', 'done', true)

            const updated = await db.todos.get({ id: '1' })

            expect(updated?.done).toBe(true)
            expect(updated?.synced).toBe(0)
            expect(updated?.updatedAt).toBeTypeOf('number')
        })
    })

    describe('delete', () => {
        it('soft deletes todo', async () => {
            await db.todos.add({
                id: '1',
                text: 'Todo',
                done: false,
                deleted: 0,
                synced: 1,
                updatedAt: 1,
            })

            await todoRepository.delete('1')

            const deleted = await db.todos.get({ id: '1' })

            expect(deleted?.deleted).toBe(1)
            expect(deleted?.synced).toBe(0)
        })
    })

    describe('toDomain', () => {
        it('maps DB model to domain model', () => {
            const dbTodo: TodoDB = {
                id: '1',
                text: 'Test',
                done: true,
                deleted: 0,
                updatedAt: 1000,
                synced: 1,
            }

            const result = toDomain(dbTodo)

            expect(result).toEqual({ id: '1', text: 'Test', done: true })
        })
    })
})
