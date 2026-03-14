import { z } from 'zod'

export const userCredentials = z.object({
    email: z.email('Invalid email'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .refine((val) => /[A-Z]/.test(val), 'Password must contain uppercase character')
        .refine((val) => /[a-z]/.test(val), 'Password must contain lowercase character')
        .refine((val) => /[0-9]/.test(val), 'Password must contain number')
        .refine(
            (val) => /[!@#$%^&*\(\)+-_;.,:]/.test(val),
            'Password must contain special character',
        ),
})

export type UserCredentialsInput = z.infer<typeof userCredentials>
