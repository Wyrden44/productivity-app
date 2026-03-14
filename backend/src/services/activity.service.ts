import prisma from '@/lib/prisma'
import { ActivityInput } from '@productivity/shared'

export async function upsertActivity(userId: string, data: ActivityInput) {
    const existing = await prisma.activity.findUnique({
        where: { id: data.id },
    })

    if (!existing) {
        await prisma.activity.create({
            data: {
                ...data,
                userId,
                updatedAt: new Date(data.updatedAt),
            },
        })
        return 'created'
    }

    if (new Date(data.updatedAt) > existing.updatedAt && existing.userId === userId) {
        await prisma.activity.update({
            where: { id: data.id },
            data: {
                ...data,
                updatedAt: new Date(data.updatedAt),
            },
        })
        return 'updated'
    }

    return 'ignored'
}
