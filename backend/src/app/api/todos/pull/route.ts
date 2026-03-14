import { pullTodos } from '@/services/pull.service'
import { pullSchema } from '@productivity/shared/src/pull/pull.schema'

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

    const data = parsed.data

    const todos = await pullTodos(userId, data)

    return Response.json({
        todos,
        serverTime: Date.now(),
    })
}
