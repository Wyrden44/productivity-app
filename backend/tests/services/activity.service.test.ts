import prisma from '@/lib/prisma'
import { upsertActivity } from '@/services/activity.service'
import { ActivityInput } from '@productivity/shared'
import { describe, it, expect, beforeEach } from 'vitest'

describe('activity Service', () => {
    beforeEach(async () => {
        await prisma.activity.deleteMany({})
    })

    it('creates activity', async () => {
        const testActivity: ActivityInput = {
            id: crypto.randomUUID(),
            activity: 'Test',
            startTime: '12:20',
            endTime: '13:20',
            focus: '10',
            deleted: false,
            updatedAt: 2000,
        }

        const result = await upsertActivity('user1', testActivity)

        const activityDb = await prisma.activity.findUnique({
            where: {
                id: testActivity.id,
            },
        })

        expect(result).toBe('created')
        expect(activityDb?.id).toEqual(testActivity.id)
    })

    it('updates existing activity', async () => {
        const testActivity: ActivityInput = {
            id: crypto.randomUUID(),
            activity: 'Test',
            startTime: '12:20',
            endTime: '13:20',
            focus: '10',
            deleted: false,
            updatedAt: 2000,
        }

        await upsertActivity('user1', testActivity)

        testActivity.activity = 'Updated'
        testActivity.updatedAt = 3000

        const result = await upsertActivity('user1', testActivity)

        const activityDb = await prisma.activity.findUnique({
            where: {
                id: testActivity.id,
            },
        })

        expect(result).toBe('updated')
        expect(activityDb?.id).toEqual(testActivity.id)
        expect(activityDb?.activity).toEqual('Updated')
    })

    it('ignores old activity', async () => {
        const testActivity: ActivityInput = {
            id: crypto.randomUUID(),
            activity: 'Test',
            startTime: '12:20',
            endTime: '13:20',
            focus: '10',
            deleted: false,
            updatedAt: 2000,
        }

        await upsertActivity('user1', testActivity)

        testActivity.activity = 'Updated'
        testActivity.updatedAt = 1999

        const result = await upsertActivity('user1', testActivity)

        const activityDb = await prisma.activity.findUnique({
            where: {
                id: testActivity.id,
            },
        })

        expect(result).toBe('ignored')
        expect(activityDb?.id).toEqual(testActivity.id)
        expect(activityDb?.activity).toEqual('Test')
    })

    it('updates deleted flag', async () => {
        const testActivity: ActivityInput = {
            id: crypto.randomUUID(),
            activity: 'Test',
            startTime: '12:20',
            endTime: '13:20',
            focus: '10',
            deleted: false,
            updatedAt: 2000,
        }

        await upsertActivity('user1', testActivity)

        testActivity.deleted = true
        testActivity.updatedAt = 3000

        const result = await upsertActivity('user1', testActivity)

        const activityDb = await prisma.activity.findUnique({
            where: {
                id: testActivity.id,
            },
        })

        expect(result).toBe('updated')
        expect(activityDb?.id).toEqual(testActivity.id)
        expect(activityDb?.deleted).toEqual(true)
    })

    it('does not update another users activity', async () => {
        const testActivity: ActivityInput = {
            id: crypto.randomUUID(),
            activity: 'Test',
            startTime: '12:20',
            endTime: '13:20',
            focus: '10',
            deleted: false,
            updatedAt: 2000,
        }

        await upsertActivity('user1', testActivity)

        testActivity.activity = 'Updated'
        testActivity.updatedAt = 3000

        const result = await upsertActivity('user2', testActivity)

        const activityDb = await prisma.activity.findUnique({
            where: {
                id: testActivity.id,
            },
        })

        expect(result).toBe('ignored')
        expect(activityDb?.id).toEqual(testActivity.id)
        expect(activityDb?.activity).toEqual('Test')
    })
})
