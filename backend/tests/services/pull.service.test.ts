import prisma from '@/lib/prisma'
import { pullActivities, pullTodos } from '@/services/pull.service'
import { ActivityInput } from '@/validators/activity.schema'
import { PullInput } from '@/validators/pull.schema'
import { TodoInput } from '@/validators/todo.schema'
import { describe, it, expect, beforeEach } from 'vitest'

const testTodo: TodoInput = {
    id: crypto.randomUUID(),
    text: 'Test',
    done: false,
    deleted: false,
    updatedAt: 2000,
}

const testActivity: ActivityInput = {
    id: crypto.randomUUID(),
    activity: 'Test',
    startTime: '12:20',
    endTime: '13:20',
    focus: '10',
    deleted: false,
    updatedAt: 2000,
}

describe('Pull Service', () => {
    beforeEach(async () => {
        await prisma.todo.deleteMany()
        await prisma.activity.deleteMany()
    })

    describe('pull todos', () => {
        beforeEach(async () => {
            await prisma.todo.deleteMany({})
            await prisma.todo.create({
                data: {
                    ...testTodo,
                    updatedAt: new Date(testTodo.updatedAt),
                    userId: 'user1',
                },
            })
        })

        it('pulls all new todos', async () => {
            const testPull: PullInput = {
                lastSyncedAt: 1000,
            }

            const result = await pullTodos('user1', testPull)

            expect(result.length).toBe(1)
            expect(result[0].id).toEqual(testTodo.id)
        })

        it('does not pull old todos', async () => {
            const testPull: PullInput = {
                lastSyncedAt: 2000,
            }

            const result = await pullTodos('user1', testPull)

            expect(result.length).toBe(0)
        })

        it('only pulls todos from one user', async () => {
            const testPull: PullInput = {
                lastSyncedAt: 1000,
            }

            const otherTodo: TodoInput = {
                id: crypto.randomUUID(),
                text: 'Test',
                done: false,
                deleted: false,
                updatedAt: 2000,
            }

            await prisma.todo.create({
                data: {
                    ...otherTodo,
                    updatedAt: new Date(otherTodo.updatedAt),
                    userId: 'user2',
                },
            })

            const result = await pullTodos('user1', testPull)

            expect(result.length).toBe(1)
            expect(result[0].id).toEqual(testTodo.id)
        })
    })

    describe('pull activities', () => {
        beforeEach(async () => {
            await prisma.activity.deleteMany({})
            await prisma.activity.create({
                data: {
                    ...testActivity,
                    updatedAt: new Date(testActivity.updatedAt),
                    userId: 'user1',
                },
            })
        })

        it('pulls all new activities', async () => {
            const testPull: PullInput = {
                lastSyncedAt: 1000,
            }

            const result = await pullActivities('user1', testPull)

            expect(result.length).toBe(1)
            expect(result[0].id).toEqual(testActivity.id)
        })

        it('does not pull old activities', async () => {
            const testPull: PullInput = {
                lastSyncedAt: 2000,
            }

            const result = await pullActivities('user1', testPull)

            expect(result.length).toBe(0)
        })

        it('only pulls todos from one user', async () => {
            const testPull: PullInput = {
                lastSyncedAt: 1000,
            }

            const otherActivity: ActivityInput = {
                id: crypto.randomUUID(),
                activity: 'Test',
                startTime: '12:20',
                endTime: '13:20',
                focus: '10',
                deleted: false,
                updatedAt: 2000,
            }

            await prisma.activity.create({
                data: {
                    ...otherActivity,
                    updatedAt: new Date(otherActivity.updatedAt),
                    userId: 'user2',
                },
            })

            const result = await pullActivities('user1', testPull)

            expect(result.length).toBe(1)
            expect(result[0].id).toEqual(testActivity.id)
        })
    })
})
