import { z } from "zod";

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type UserCreateBody = z.infer<typeof userCreateSchema>;


export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type UserLoginBody = z.infer<typeof userLoginSchema>;
