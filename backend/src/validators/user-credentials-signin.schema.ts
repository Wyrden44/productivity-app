import { z } from 'zod'

export const userCredentialsSignin = z.object({
    email: z.email(),
    password: z.string().min(1),
})

export type UserCredentialsSigninInput = z.infer<typeof userCredentialsSignin>
