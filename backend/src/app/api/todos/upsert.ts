import prisma from '@/lib/prisma'
import { todoSchema } from '@/validators/todo.schema'

export async function POST(req: Request) {
    const userId = req.headers.get('x-user-id')

    if (!userId) {
        return Response.json({ error: 'Missing user id' }, { status: 401 })
    }

    const incoming = await req.json()
    const parsed = todoSchema.safeParse(incoming)

    if (!parsed.success) {
        return Response.json({ error: 'Invalid payload', details: parsed.error }, { status: 400 })
    }

    const data = parsed.data

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
        return Response.json({ status: 'created' })
    }

    if (new Date(data.updatedAt) > existing.updatedAt) {
        await prisma.todo.update({
            where: { id: data.id },
            data: {
                ...data,
                updatedAt: new Date(data.updatedAt),
            },
        })
        return Response.json({ status: 'updated' })
    }

    return Response.json({ status: 'ignored' })
}
