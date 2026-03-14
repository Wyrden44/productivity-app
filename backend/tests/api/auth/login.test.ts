/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/login/route'
import { signIn } from '@/auth'
import { UserCredentialsSigninInput } from '@productivity/shared'

vi.mock('@/auth', () => ({
    signIn: vi.fn(),
}))

function createRequest(body: any) {
    return new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
}

describe('POST /api/auth/login', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns 400 if payload invalid', async () => {
        const req = createRequest({})

        const res = await POST(req)

        expect(res.status).toBe(400)
    })

    it('calls signIn when payload valid', async () => {
        ;(signIn as any).mockResolvedValue(undefined)

        const req = createRequest({
            email: 'test@test.com',
            password: 'password123',
        } as UserCredentialsSigninInput)

        const res = await POST(req)

        expect(res.status).toBe(200)
        expect(signIn).toHaveBeenCalledWith('credentials', {
            email: 'test@test.com',
            password: 'password123',
            redirect: false,
        })
    })

    it('returns 401 if signIn throws', async () => {
        ;(signIn as any).mockRejectedValue(new Error())

        const req = createRequest({
            email: 'test@test.com',
            password: 'password123',
        } as UserCredentialsSigninInput)

        const res = await POST(req)

        expect(res.status).toBe(401)
    })
})
