import { createUser } from '@/services/signup.service'
import { userCredentials } from '@productivity/shared/src/auth/user-credentials.schema'

export const runtime = 'nodejs'

export async function POST(req: Request) {
    let incoming

    try {
        incoming = await req.json()
    } catch {
        return Response.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const parsed = userCredentials.safeParse(incoming)

    if (!parsed.success) {
        return Response.json({ error: 'Invalid payload', details: parsed.error }, { status: 400 })
    }

    const data = parsed.data

    const id = await createUser(data)

    if (!id) {
        return Response.json({ error: 'Error creating user' }, { status: 500 })
    }

    return Response.json({ id })
}
