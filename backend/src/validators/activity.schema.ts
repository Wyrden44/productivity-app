import { z } from 'zod'

export const activitySchema = z.object({
    id: z.uuid(),
    activity: z.string().max(50),
    startTime: z.string().regex(/^(1[0-9]|2[0-3]|0?[0-9]):[0-5][0-9]$/), // is valid time
    endTime: z.string().regex(/^(1[0-9]|2[0-3]|0?[0-9]):[0-5][0-9]$/), // same
    focus: z.string().refine((val) => {
        const num = Number(val)
        return val !== '' && !isNaN(num) && num >= 0 && num <= 10
    }),
    updatedAt: z.number().int().positive(),
})

export type TodoInput = z.infer<typeof activitySchema>
