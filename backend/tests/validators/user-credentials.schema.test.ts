import { userCredentials } from '@/validators/user-credentials.schema'
import { describe, it, expect } from 'vitest'

describe('userCredentialsSignInSchema', () => {
    const validUser = {
        email: 'test@test.com',
        password: 'Password123!',
    }

    it('accepts valid user', () => {
        const result = userCredentials.safeParse(validUser)
        expect(result.success).toBe(true)
    })

    it('rejects empty email', () => {
        const result = userCredentials.safeParse({
            ...validUser,
            email: '',
        })

        expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
        const result = userCredentials.safeParse({
            ...validUser,
            password: '',
        })
        expect(result.success).toBe(false)
    })

    it('rejects invalid email', () => {
        const result = userCredentials.safeParse({
            ...validUser,
            email: 'test',
        })
        expect(result.success).toBe(false)
    })

    it('rejects invalid password', () => {
        const result = userCredentials.safeParse({
            ...validUser,
            password: 'password',
        })
        expect(result.success).toBe(false)
    })
})
