/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { middleware } from '@/middleware'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

vi.mock('next-auth/jwt', () => ({
    getToken: vi.fn(),
}))

function createRequest(path: string) {
    return new NextRequest(new Request(`http://localhost${path}`))
}

describe('middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        process.env.NEXTAUTH_SECRET = 'test-secret'
    })

    it('returns 401 if token is missing', async () => {
        vi.mocked(getToken).mockResolvedValue(null)

        const req = createRequest('/api/todos')
        const res = await middleware(req)

        expect(res?.status).toBe(401)
        const body = await res?.json()
        expect(body.error).toBe('Unauthorized')
    })

    it('returns 401 if token has no sub (user id)', async () => {
        vi.mocked(getToken).mockResolvedValue({ name: 'No Sub' } as any)

        const req = createRequest('/api/todos')
        const res = await middleware(req)

        expect(res?.status).toBe(401)
    })

    it('sets x-user-id header if token is valid', async () => {
        vi.mocked(getToken).mockResolvedValue({ sub: 'user-123' } as any)

        const req = createRequest('/api/todos')
        const res = await middleware(req)

        expect(res?.headers.get('x-user-id')).toBe('user-123')
    })

    it('bypasses check for /api/auth routes', async () => {
        const req = createRequest('/api/auth/session')
        const res = await middleware(req)

        expect(getToken).not.toHaveBeenCalled()
        expect(res?.headers.get('x-middleware-next')).toBe('1')
    })
})
