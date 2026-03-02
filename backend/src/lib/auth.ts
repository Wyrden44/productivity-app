import jwt from 'jsonwebtoken'

export interface AuthPayload {
    userId: string
}

export function verifyToken(token: string): AuthPayload | null {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload
    } catch {
        return null
    }
}

export function extractToken(authHeader: string | null) {
    if (!authHeader) return null
    if (!authHeader.startsWith('Bearer ')) return null
    return authHeader.split(' ')[1]
}
