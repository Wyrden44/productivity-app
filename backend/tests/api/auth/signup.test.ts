/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/signup/route'
import { createUser } from '@/services/signup.service'
import { UserCredentialsInput } from '@productivity/shared/src/auth/user-credentials.schema'

vi.mock('@/services/signup.service', () => ({
    createUser: vi.fn(),
}))

function createRequest(body: any) {
    return new Request('http://localhost/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
}

const validBody: UserCredentialsInput = {
    email: 'test@test.com',
    password: 'Password123!',
}

describe('POST /api/auth/signup', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns 400 if payload invalid', async () => {
        const req = createRequest({})

        const res = await POST(req)

        expect(res.status).toBe(400)
    })

    it('returns id if user created', async () => {
        ;(createUser as any).mockResolvedValue('user1')

        const req = createRequest(validBody)

        const res = await POST(req)
        const json = await res.json()

        expect(res.status).toBe(200)
        expect(json.id).toBe('user1')
        expect(createUser).toHaveBeenCalled()
    })

    it('returns 500 if service fails', async () => {
        ;(createUser as any).mockResolvedValue(null)

        const req = createRequest(validBody)

        const res = await POST(req)

        expect(res.status).toBe(500)
    })
})
