import { z } from "zod"

export const carSchema = z.object({
  title: z.string().min(2, "Title must have at least 2 characters"),
  brand: z.string().min(2, "Brand is required"),
  year: z.number().min(1900, "Invalid year"),
  price: z.number().positive("Price must be greater than 0"),
  image: z.any().optional()
})

export type CarFormData = z.infer<typeof carSchema>

export type CarFromDB = Omit<CarFormData, "image"> & {
  id: string
  image_url: string | null
}