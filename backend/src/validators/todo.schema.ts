import { z } from 'zod'

export const todoSchema = z.object({
    id: z.uuid(),
    text: z.string().min(1).max(50),
    done: z.boolean(),
    deleted: z.boolean(),
    updatedAt: z.number().int().positive(),
})

export type TodoInput = z.infer<typeof todoSchema>
