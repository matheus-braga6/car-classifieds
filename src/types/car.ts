import { z } from "zod"

/* =========================
   CAR CARD TYPE
========================= */
export interface Car {
  id: string
  title: string
  brand: string
  year: number
  price: number
  image_url: string
  editable?: boolean
}

/* =========================
   FORM VALIDATION
========================= */

export const carSchema = z.object({
  title: z.string().min(2, "O título deve ter pelo menos 2 caracteres"),
  brand: z.string().min(2, "A marca é obrigatória"),
  year: z.number({ message: "O ano é obrigatório" }).min(1900, "Ano inválido"),
  price: z.number().positive("O preço deve ser maior que zero"),
  image: z.any().optional()
})

export type CarFormData = z.infer<typeof carSchema>

export type CarFromDB = Omit<CarFormData, "image"> & {
  id: string
  image_url: string | null
}