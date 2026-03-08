/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/signout/route'
import { signOut } from '@/auth'

vi.mock('@/auth', () => ({
    signOut: vi.fn(),
}))

describe('POST /api/auth/signout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('returns success when signOut works', async () => {
        ;(signOut as any).mockResolvedValue(undefined)

        const res = await POST()
        const json = await res.json()

        expect(res.status).toBe(200)
        expect(json.msg).toBe('Success')
    })

    it('returns error if signOut throws', async () => {
        ;(signOut as any).mockRejectedValue(new Error())

        const res = await POST()
        const json = await res.json()

        expect(json.msg).toBe('Error')
    })
})
