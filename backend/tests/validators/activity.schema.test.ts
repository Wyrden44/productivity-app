import { activitySchema } from '@/validators/activity.schema'
import { describe, it, expect } from 'vitest'

describe('activitySchema', () => {
    const validActivity = {
        id: crypto.randomUUID(),
        activity: 'Test',
        startTime: '09:30',
        endTime: '11:00',
        focus: '8',
        deleted: false,
        updatedAt: 1000,
    }

    it('accepts a valid activity', () => {
        const result = activitySchema.safeParse(validActivity)
        expect(result.success).toBe(true)
    })

    it('rejects activity description over 50 chars', () => {
        const result = activitySchema.safeParse({
            ...validActivity,
            activity: 'a'.repeat(51),
        })
        expect(result.success).toBe(false)
    })

    it('rejects invalid UUID', () => {
        const result = activitySchema.safeParse({ ...validActivity, id: '123' })
        expect(result.success).toBe(false)
    })

    it('accepts valid 24h time formats', () => {
        const times = ['00:00', '23:59', '9:05', '12:00']
        times.forEach((time) => {
            const result = activitySchema.safeParse({ ...validActivity, startTime: time })
            expect(result.success).toBe(true)
        })
    })

    it('rejects invalid time formats', () => {
        const invalidTimes = ['25:00', '12:60', '9:6', 'abc']
        invalidTimes.forEach((time) => {
            const result = activitySchema.safeParse({ ...validActivity, startTime: time })
            expect(result.success).toBe(false)
        })
    })

    it('accepts focus between "0" and "10"', () => {
        const result = activitySchema.safeParse({ ...validActivity, focus: '10' })
        expect(result.success).toBe(true)
    })

    it('rejects focus out of range or non-numeric', () => {
        const invalidFocus = ['11', '-1', 'high', '']
        invalidFocus.forEach((val) => {
            const result = activitySchema.safeParse({ ...validActivity, focus: val })
            expect(result.success).toBe(false)
        })
    })
})
