import { z } from "zod"

/* =========================
   USER TYPE
========================= */
export interface User {
  id: string
  email: string
}

/* =========================
   PROFILE TYPE
========================= */
export interface Profile {
  id: string
  name: string
  document: string
  document_type: "cpf" | "cnpj"
  phone: string
  company_name: string | null
  avatar_url: string | null
  cep: string
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
}

/* =========================
   PASSWORD RULES
========================= */
const passwordSchema = z
  .string()
  .min(6, "A senha deve ter pelo menos 6 caracteres")
  .refine((val) => /[0-9]/.test(val), "A senha deve conter pelo menos 1 número")
  .refine((val) => /[^a-zA-Z0-9]/.test(val), "A senha deve conter pelo menos 1 símbolo")


/* =========================
   LOGIN
========================= */
export const loginSchema = z.object({
  email: z.string().check(z.email("Email inválido")),
  password: z.string().min(1, "Senha obrigatória"),
})

export type LoginFormData = z.infer<typeof loginSchema>

/* =========================
   REGISTER
========================= */
export const registerSchema = z.object({
  // Auth
  email: z.string().check(z.email("Email inválido")),
  password: passwordSchema,
  confirm_password: z.string(),

  // Dados pessoais
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  document_type: z.enum(["cpf", "cnpj"]),
  document: z.string().min(1, "Documento obrigatório"),
  phone: z.string().min(14, "Telefone inválido"),
  company_name: z.string().optional(),

  // Endereço
  cep: z.string().min(9, "CEP inválido"),
  street: z.string().min(1, "Rua obrigatória"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro obrigatório"),
  city: z.string().min(1, "Cidade obrigatória"),
  state: z.string().min(1, "Estado obrigatório"),
}).refine((data) => data.password === data.confirm_password, {
  message: "As senhas não coincidem",
  path: ["confirm_password"],
})

export type RegisterFormData = z.infer<typeof registerSchema>

/* =========================
   EDIT PROFILE
========================= */
export const editProfileSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  document_type: z.enum(["cpf", "cnpj"]),
  document: z.string().min(1, "Documento obrigatório"),
  phone: z.string().min(14, "Telefone inválido"),
  company_name: z.string().optional(),
  cep: z.string().min(9, "CEP inválido"),
  street: z.string().min(1, "Rua obrigatória"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro obrigatório"),
  city: z.string().min(1, "Cidade obrigatória"),
  state: z.string().min(1, "Estado obrigatório"),
})

export type EditProfileFormData = z.infer<typeof editProfileSchema>

/* =========================
   CHANGE PASSWORD
========================= */
export const changePasswordSchema = z.object({
  password: passwordSchema,
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "As senhas não coincidem",
  path: ["confirm_password"],
})

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>