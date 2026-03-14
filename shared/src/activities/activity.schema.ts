import { z } from 'zod'
import { isValidActivity, isValidFocus, isValidTime } from '../utils/validator'

export const activitySchema = z.object({
    id: z.uuid(),
    activity: z.string().refine(isValidActivity),
    startTime: z.string().refine(isValidTime),
    endTime: z.string().refine(isValidTime),
    focus: z.string().refine(isValidFocus),
    deleted: z.boolean(),
    updatedAt: z.number().int().nonnegative(),
})

export type ActivityInput = z.infer<typeof activitySchema>
