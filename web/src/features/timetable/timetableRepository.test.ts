import { describe, it, expect, beforeEach } from 'vitest'
import 'fake-indexeddb/auto'
import { db } from '@web//db/database'
import type { ActivityDB } from './types/activity.db-model'
import { timetableRepository, toDomain } from './timetableRepository'

describe('timetableRepository', () => {
    beforeEach(async () => {
        await db.activities.clear()
    })

    describe('getAll', () => {
        it('returns non-deleted activities mapped to domain model', async () => {
            await db.activities.bulkAdd([
                {
                    id: '1',
                    focus: '10',
                    activity: 'Activity 1',
                    startTime: '12:00',
                    endTime: '13:00',
                    deleted: 0,
                    updatedAt: 1000,
                    synced: 1,
                },
                {
                    id: '2',
                    focus: '20',
                    activity: 'Activity 2',
                    startTime: '14:00',
                    endTime: '15:00',
                    deleted: 0,
                    updatedAt: 2000,
                    synced: 1,
                },
                {
                    id: '3',
                    focus: '30',
                    activity: 'Deleted Activity',
                    startTime: '16:00',
                    endTime: '17:00',
                    deleted: 1,
                    updatedAt: 3000,
                    synced: 0,
                },
            ] as ActivityDB[])

            const result = await timetableRepository.getAll()

            expect(result).toEqual([
                {
                    id: '1',
                    focus: '10',
                    activity: 'Activity 1',
                    startTime: '12:00',
                    endTime: '13:00',
                },
                {
                    id: '2',
                    focus: '20',
                    activity: 'Activity 2',
                    startTime: '14:00',
                    endTime: '15:00',
                },
            ])
        })

        it('returns empty array when none exist', async () => {
            const result = await timetableRepository.getAll()
            expect(result).toEqual([])
        })
    })

    describe('add', () => {
        it('adds activity with synced and updatedAt', async () => {
            await timetableRepository.add({
                id: '1',
                focus: '10',
                activity: 'New Activity',
                startTime: '10:00',
                endTime: '11:00',
            })

            const rows = await db.activities.toArray()

            expect(rows.length).toBe(1)
            expect(rows[0]).toMatchObject({
                id: '1',
                focus: '10',
                activity: 'New Activity',
                startTime: '10:00',
                endTime: '11:00',
                synced: 0,
            })
            expect(rows[0]!.updatedAt).toBeTypeOf('number')
        })
    })

    describe('update', () => {
        it('updates activity and sets synced flag', async () => {
            await db.activities.add({
                id: '1',
                focus: '10',
                activity: 'Activity',
                startTime: '12:00',
                endTime: '13:00',
                deleted: 0,
                synced: 1,
                updatedAt: 1,
            })

            await timetableRepository.update('1', 'activity', 'Updated')

            const updated = await db.activities.get({ id: '1' })

            expect(updated?.activity).toBe('Updated')
            expect(updated?.synced).toBe(0)
            expect(updated?.updatedAt).toBeTypeOf('number')
        })
    })

    describe('delete', () => {
        it('soft deletes activity', async () => {
            await db.activities.add({
                id: '1',
                focus: '10',
                activity: 'Activity',
                startTime: '12:00',
                endTime: '13:00',
                deleted: 0,
                synced: 1,
                updatedAt: 1,
            })

            await timetableRepository.delete('1')

            const deleted = await db.activities.get({ id: '1' })

            expect(deleted?.deleted).toBe(1)
            expect(deleted?.synced).toBe(0)
        })
    })

    describe('toDomain', () => {
        it('maps DB model to domain model', () => {
            const dbActivity: ActivityDB = {
                id: '1',
                focus: '10',
                activity: 'Test',
                startTime: '12:00',
                endTime: '13:00',
                deleted: 0,
                updatedAt: 1000,
                synced: 1,
            }

            const result = toDomain(dbActivity)

            expect(result).toEqual({
                id: '1',
                focus: '10',
                activity: 'Test',
                startTime: '12:00',
                endTime: '13:00',
            })
        })
    })
})
