import { z } from "zod"

/* =========================
   CAR CARD TYPE
========================= */
export interface Car {
  id: string
  title: string
  brand: string
  year_fab: number
  year_model: number
  mileage: number
  price: number
  image_urls: string[]
  status: string  
  editable?: boolean
}

/* =========================
   SELECT OPTIONS
========================= */
export const fuelOptions = [
  { value: "flex", label: "Flex" },
  { value: "gasoline", label: "Gasolina" },
  { value: "ethanol", label: "Álcool" },
  { value: "diesel", label: "Diesel" },
  { value: "electric", label: "Elétrico" },
  { value: "hybrid", label: "Híbrido" },
  { value: "gnv", label: "GNV" },
]

export const transmissionOptions = [
  { value: "manual", label: "Manual" },
  { value: "automatic", label: "Automático" },
  { value: "automated", label: "Automatizado" },
  { value: "cvt", label: "CVT" },
]

export const categoryOptions = [
  { value: "hatch", label: "Hatch" },
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "pickup", label: "Picape" },
  { value: "minivan", label: "Minivan" },
  { value: "coupe", label: "Cupê" },
  { value: "convertible", label: "Conversível" },
  { value: "wagon", label: "Perua/Wagon" },
  { value: "van", label: "Van" },
  { value: "truck", label: "Caminhão" },
]

/* =========================
   FORM VALIDATION
========================= */

export const carSchema = z.object({
  title: z.string().min(2, "O título deve ter pelo menos 2 caracteres"),
  brand: z.string().min(1, "A marca é obrigatória"),
  model: z.string().min(1, "O modelo é obrigatório"),
  year_fab: z.number({ message: "O ano de fabricação é obrigatório" }).min(1900, "Ano inválido"),
  year_model: z.number({ message: "O ano do modelo é obrigatório" }).min(1900, "Ano inválido"),
  category: z.string().min(1, "A categoria é obrigatória"),
  color_main: z.string().min(1, "A cor é obrigatória"),
  mileage: z.number({ message: "A quilometragem é obrigatória" }).min(0, "Quilometragem inválida"),
  fuel: z.string().min(1, "O tipo de combustível é obrigatório"),
  transmission: z.string().min(1, "O tipo de transmissão é obrigatório"),

  price: z.number().min(0).optional(),
  color_secondary: z.string().optional(),
  color_interior: z.string().optional(),
  plate: z.string().optional(),
  renavam: z.string().optional(),
  chassis: z.string().optional(),
  doors: z.number().min(0).optional(),
  seats: z.number().min(0).optional(),
  engine: z.string().optional(),
  power: z.string().optional(),
  acceleration: z.string().optional(),
  autonomy: z.number().min(0).optional(),
  airbags: z.number().min(0).optional(),
  warranty_until: z.string().optional(),
  brakes: z.string().optional(),
  headlights: z.string().optional(),
  wheels: z.string().optional(),
  sunroof: z.string().optional(),
  description: z.string().optional(),
  armored: z.boolean().default(false),
  convertible: z.boolean().default(false),
  autopilot: z.boolean().default(false),
  bluetooth: z.boolean().default(false),
  parking_sensor: z.boolean().default(false),
  camera: z.boolean().default(false),
  rain_sensor: z.boolean().default(false),
  multimedia: z.boolean().default(false),
  featured: z.boolean().default(false),
  status: z.string().default("active"),
  image_urls: z.array(z.string()).optional().default([])
})

export type CarFormData = z.infer<typeof carSchema>

/* =========================
   DB TYPE
========================= */
export type CarFromDB = Omit<CarFormData, "image_urls"> & {
  id: string
  image_urls: string[]
  created_at: string
}