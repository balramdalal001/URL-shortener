import { z } from "zod";

export const createUrlSchema = z.object({
  url: z.string().url()
});

export const shortCodeSchema = z.object({
  code: z.string().regex(/^[A-Za-z0-9_-]+$/)
});

export type CreateUrlBody = z.infer<typeof createUrlSchema>;
export type ShortCodeParams = z.infer<typeof shortCodeSchema>;
