import { upsertTodo } from '@/services/todo.service'
import { todoSchema } from '@productivity/shared/src/todos/todo.schema'

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

    const res = await upsertTodo(userId, data)

    return Response.json({ status: res })
}
