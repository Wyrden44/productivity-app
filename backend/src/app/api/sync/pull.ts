import prisma from '@/lib/prisma'
import { pullSchema } from '@/validators/pull.schema'

export async function POST(req: Request) {
    const userId = req.headers.get('x-user-id')

    if (!userId) {
        return Response.json({ error: 'Missing user id' }, { status: 401 })
    }

    const incoming = await req.json()
    const parsed = pullSchema.safeParse(incoming)

    if (!parsed.success) {
        return Response.json({ error: 'Invalid payload', details: parsed.error }, { status: 400 })
    }

    const { lastSyncedAt } = parsed.data

    const todos = await prisma.todo.findMany({
        where: {
            userId,
            updatedAt: {
                gt: new Date(lastSyncedAt),
            },
        },
        orderBy: {
            updatedAt: 'asc',
        },
    })

    return Response.json({
        todos,
        serverTime: Date.now(),
    })
}
