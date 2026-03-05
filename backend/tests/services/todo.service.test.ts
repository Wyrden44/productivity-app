import prisma from '@/lib/prisma'
import { upsertTodo } from '@/services/todo.service'
import { TodoInput } from '@/validators/todo.schema'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Todo Service', () => {
    beforeEach(async () => {
        await prisma.todo.deleteMany({})
    })

    it('creates todo', async () => {
        const testTodo: TodoInput = {
            id: crypto.randomUUID(),
            text: 'Test',
            done: false,
            deleted: false,
            updatedAt: 2000,
        }

        const result = await upsertTodo('user1', testTodo)

        const todoDb = await prisma.todo.findUnique({
            where: {
                id: testTodo.id,
            },
        })

        expect(result).toBe('created')
        expect(todoDb?.id).toEqual(testTodo.id)
    })

    it('updates existing todo', async () => {
        const testTodo: TodoInput = {
            id: crypto.randomUUID(),
            text: 'Test',
            done: false,
            deleted: false,
            updatedAt: 2000,
        }

        await upsertTodo('user1', testTodo)

        testTodo.text = 'Updated'
        testTodo.updatedAt = 3000

        const result = await upsertTodo('user1', testTodo)

        const todoDb = await prisma.todo.findUnique({
            where: {
                id: testTodo.id,
            },
        })

        expect(result).toBe('updated')
        expect(todoDb?.id).toEqual(testTodo.id)
        expect(todoDb?.text).toEqual('Updated')
    })

    it('ignores old todo', async () => {
        const testTodo: TodoInput = {
            id: crypto.randomUUID(),
            text: 'Test',
            done: false,
            deleted: false,
            updatedAt: 2000,
        }

        await upsertTodo('user1', testTodo)

        testTodo.text = 'Updated'
        testTodo.updatedAt = 1999

        const result = await upsertTodo('user1', testTodo)

        const todoDb = await prisma.todo.findUnique({
            where: {
                id: testTodo.id,
            },
        })

        expect(result).toBe('ignored')
        expect(todoDb?.id).toEqual(testTodo.id)
        expect(todoDb?.text).toEqual('Test')
    })

    it('updates deleted flag', async () => {
        const testTodo: TodoInput = {
            id: crypto.randomUUID(),
            text: 'Test',
            done: false,
            deleted: false,
            updatedAt: 2000,
        }

        await upsertTodo('user1', testTodo)

        testTodo.deleted = true
        testTodo.updatedAt = 3000

        const result = await upsertTodo('user1', testTodo)

        const todoDb = await prisma.todo.findUnique({
            where: {
                id: testTodo.id,
            },
        })

        expect(result).toBe('updated')
        expect(todoDb?.id).toEqual(testTodo.id)
        expect(todoDb?.deleted).toEqual(true)
    })

    it('does not update another users todo', async () => {
        const testTodo: TodoInput = {
            id: crypto.randomUUID(),
            text: 'Test',
            done: false,
            deleted: false,
            updatedAt: 2000,
        }

        await upsertTodo('user1', testTodo)

        testTodo.text = 'Updated'
        testTodo.updatedAt = 3000

        const result = await upsertTodo('user2', testTodo)

        const todoDb = await prisma.todo.findUnique({
            where: {
                id: testTodo.id,
            },
        })

        expect(result).toBe('ignored')
        expect(todoDb?.id).toEqual(testTodo.id)
        expect(todoDb?.text).toEqual('Test')
    })
})
