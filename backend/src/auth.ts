import { verifyPassword } from '@/lib/auth'
import prisma from '@/lib/prisma'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: 'email',
                    label: 'Email',
                },
                password: {
                    type: 'password',
                    label: 'Password',
                },
            },
            authorize: async (credentials) => {
                let user = null

                // verify user exists
                user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string,
                    },
                })

                if (
                    !user ||
                    !(await verifyPassword(credentials.password as string, user.hashedPassword))
                ) {
                    throw new Error('Invalid credentials')
                }

                return user
            },
        }),
    ],

    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: 'api/auth/login',
        error: 'api/auth/login',
        signOut: 'api/auth/signout',
    },

    secret: process.env.NEXTAUTH_SECRET,
})
