import { z } from "zod"

/* =========================
   USER TYPE
========================= */
export interface User {
  id: string
  email: string
}

/* =========================
   FORM VALIDATION
========================= */
export const authSchema = z.object({
  email: z.string().check(z.email("Email inválido")),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .refine((val) => /[0-9]/.test(val), "A senha deve conter pelo menos 1 número")
    .refine((val) => /[^a-zA-Z0-9]/.test(val), "A senha deve conter pelo menos 1 símbolo"),
})

export type AuthFormData = z.infer<typeof authSchema>