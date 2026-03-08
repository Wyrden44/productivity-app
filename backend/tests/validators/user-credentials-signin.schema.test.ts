import { userCredentialsSignin } from '@/validators/user-credentials-signin.schema'
import { describe, it, expect } from 'vitest'

describe('userCredentialsSignInSchema', () => {
    const validUser = {
        email: 'test@test.com',
        password: 'Password123!',
    }

    it('accepts valid user', () => {
        const result = userCredentialsSignin.safeParse(validUser)
        expect(result.success).toBe(true)
    })

    it('rejects empty email', () => {
        const result = userCredentialsSignin.safeParse({
            ...validUser,
            email: '',
        })

        expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
        const result = userCredentialsSignin.safeParse({
            ...validUser,
            password: '',
        })
        expect(result.success).toBe(false)
    })

    it('rejects invalid email', () => {
        const result = userCredentialsSignin.safeParse({
            ...validUser,
            email: 'test',
        })
        expect(result.success).toBe(false)
    })
})
