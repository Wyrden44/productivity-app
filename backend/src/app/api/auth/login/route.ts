import { signIn } from '@/auth'
import { userCredentialsSignin } from '@productivity/shared'

export const runtime = 'nodejs'

export async function POST(req: Request) {
    let incoming

    try {
        incoming = await req.json()
    } catch {
        return Response.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const parsed = userCredentialsSignin.safeParse(incoming)

    if (!parsed.success) {
        return Response.json({ error: 'Invalid payload', details: parsed.error }, { status: 400 })
    }

    const data = parsed.data

    try {
        await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        })

        return Response.json({ msg: 'Success' })
    } catch {
        return Response.json({ msg: 'Invalid credentials' }, { status: 401 })
    }
}
