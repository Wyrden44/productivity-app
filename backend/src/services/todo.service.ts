import prisma from '@/lib/prisma'
import { TodoInput } from '@productivity/shared'

export async function upsertTodo(userId: string, data: TodoInput) {
    const existing = await prisma.todo.findUnique({
        where: { id: data.id },
    })

    if (!existing) {
        await prisma.todo.create({
            data: {
                ...data,
                userId,
                updatedAt: new Date(data.updatedAt),
            },
        })
        return 'created'
    }

    if (new Date(data.updatedAt) > existing.updatedAt && existing.userId === userId) {
        await prisma.todo.update({
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
