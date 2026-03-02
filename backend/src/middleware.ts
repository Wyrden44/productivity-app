import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractToken } from '@/lib/auth'

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/api')) {
        const authHeader = req.headers.get('authorization')

        const token = extractToken(authHeader)

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = verifyToken(token)

        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        // Attach userId to request headers
        const requestHeaders = new Headers(req.headers)
        requestHeaders.set('x-user-id', payload.userId)

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/api/:path*',
}
