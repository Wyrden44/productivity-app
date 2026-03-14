import prisma from '@/lib/prisma'
import { PullInput } from '@productivity/shared'

export async function pullTodos(userId: string, data: PullInput) {
    const todos = await prisma.todo.findMany({
        where: {
            userId,
            updatedAt: {
                gt: new Date(data.lastSyncedAt),
            },
        },
        orderBy: {
            updatedAt: 'asc',
        },
    })

    return todos
}

export async function pullActivities(userId: string, data: PullInput) {
    const activities = await prisma.activity.findMany({
        where: {
            userId,
            updatedAt: {
                gt: new Date(data.lastSyncedAt),
            },
        },
        orderBy: {
            updatedAt: 'asc',
        },
    })

    return activities
}
