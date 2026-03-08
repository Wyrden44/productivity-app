import bcrypt from 'bcryptjs'

// not tests for this file - add tests if you modify with own logic

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
}
