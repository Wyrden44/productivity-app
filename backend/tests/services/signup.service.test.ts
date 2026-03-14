import { hashPassword } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { createUser } from '@/services/signup.service'
import { UserCredentialsInput } from '@productivity/shared'
import { describe, it, expect, beforeEach } from 'vitest'

const testUser: UserCredentialsInput = {
    email: 'user1',
    password: 'Password1$',
}

describe('Signup Service', () => {
    beforeEach(async () => {
        await prisma.user.deleteMany()
    })

    it('creates user', async () => {
        const result = await createUser(testUser)

        const userDb = await prisma.user.findUnique({
            where: {
                email: testUser.email,
            },
        })

        expect(result).toBe(userDb?.id)
    })

    it('rejects existing email', async () => {
        await prisma.user.create({
            data: {
                email: testUser.email,
                hashedPassword: await hashPassword(testUser.password),
            },
        })

        const result = await createUser(testUser)

        expect(result).toBe(null)
    })
})
