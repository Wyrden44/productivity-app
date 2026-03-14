import { z } from "zod";

export const pullSchema = z.object({
  lastSyncedAt: z.number().int().nonnegative(),
});

export type PullInput = z.infer<typeof pullSchema>;
