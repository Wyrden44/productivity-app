import { hashPassword } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { UserCredentialsInput } from '@productivity/shared/src/auth/user-credentials.schema'

export async function createUser(data: UserCredentialsInput) {
    const existing = await prisma.user.findUnique({
        where: {
            email: data.email,
        },
    })

    if (existing) {
        return null
    }

    try {
        const user = await prisma.user.create({
            data: {
                email: data.email,
                hashedPassword: await hashPassword(data.password),
            },
        })

        return user.id
    } catch (error) {
        console.error(error)
    }

    return null
}
