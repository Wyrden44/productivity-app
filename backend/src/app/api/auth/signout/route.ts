import { signOut } from '@/auth'

export const runtime = 'nodejs'

export async function POST() {
    try {
        await signOut({ redirect: false })
    } catch (e) {
        console.error(e)
        return Response.json({ msg: 'Error' })
    }
    return Response.json({ msg: 'Success' })
}
