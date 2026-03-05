/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { middleware } from '@/middleware'
import * as auth from '@/lib/auth'
import { NextRequest } from 'next/server'

vi.mock('@/lib/auth')

function createRequest(path: string, headers?: Record<string, string>) {
    return new NextRequest(
        new Request(`http://localhost${path}`, {
            headers,
        }),
    )
}

describe('middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns 401 if no authorization header', () => {
        const req = createRequest('/api/todos')

        const res = middleware(req)

        expect(res?.status).toBe(401)
    })

    it('returns 401 if token invalid', () => {
        vi.spyOn(auth, 'extractToken').mockReturnValue('token')
        vi.spyOn(auth, 'verifyToken').mockReturnValue(null)

        const req = createRequest('/api/todos', {
            authorization: 'Bearer token',
        })

        const res = middleware(req)

        expect(res?.status).toBe(401)
    })

    it('attaches x-user-id if token valid', () => {
        vi.spyOn(auth, 'extractToken').mockReturnValue('token')
        vi.spyOn(auth, 'verifyToken').mockReturnValue({ userId: 'user1' } as any)

        const req = createRequest('/api/todos', {
            authorization: 'Bearer token',
        })

        const res = middleware(req)

        expect(res?.headers.get('x-middleware-next')).toBe('1')
    })
})
