import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next()
    }

    if (req.nextUrl.pathname.startsWith('/api')) {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        })

        if (!token?.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const response = NextResponse.next()
        response.headers.set('x-user-id', token.sub)

        return response
    }

    return NextResponse.next()
}
