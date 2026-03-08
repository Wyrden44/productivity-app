import { describe, it, expect, vi } from 'vitest'
import { POST } from '@/app/api/activities/pull/route'
import * as service from '@/services/pull.service'
import { PullInput } from '@/validators/pull.schema'

vi.mock('@/services/pull.service')

describe('POST /api/activities/pull', () => {
    const validBody: PullInput = {
        lastSyncedAt: 1000,
    }

    it('returns 401 if x-user-id missing', async () => {
        const req = new Request('http://localhost', {
            method: 'POST',
            body: JSON.stringify(validBody),
        })

        const res = await POST(req)
        expect(res.status).toBe(401)
    })

    it('returns 400 if payload invalid', async () => {
        const req = new Request('http://localhost', {
            method: 'POST',
            headers: { 'x-user-id': 'user1' },
            body: JSON.stringify({}),
        })

        const res = await POST(req)
        expect(res.status).toBe(400)
    })

    it('calls service when valid', async () => {
        vi.spyOn(service, 'pullActivities').mockResolvedValue([])

        const req = new Request('http://localhost', {
            method: 'POST',
            headers: { 'x-user-id': 'user1' },
            body: JSON.stringify(validBody),
        })

        const res = await POST(req)
        const json = await res.json()

        expect(res.status).toBe(200)
        expect(service.pullActivities).toHaveBeenCalledWith('user1', validBody)
        expect(json.activities).toEqual([])
        expect(json).toHaveProperty('serverTime')
    })
})
