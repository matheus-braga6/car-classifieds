"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { carSchema, CarFormData, CarFromDB } from "@/schemas/car-schema"

import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { CloseLineIcon } from "@/assets/icons/CloseLineIcon"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import { toast } from "sonner"
import { DeleteCarDialog } from "./DeleteCarDialog"

interface Props {
  car: CarFromDB
}

function formatCurrency(value: string) {
  const numbers = value.replace(/\D/g, "")
  const number = Number(numbers) / 100
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number)
}

export default function CarEditForm({ car }: Props) {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(car.image_url)
  const [saving, setSaving] = useState(false)
  const [priceFormatted, setPriceFormatted] = useState(() => {
    if (!car.price) return ""
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(car.price)
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      title: car.title,
      brand: car.brand,
      year: car.year,
      price: car.price,
      image: undefined,
    },
  })

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value
    const numbers = rawValue.replace(/\D/g, "")
    const number = Number(numbers) / 100
    setPriceFormatted(formatCurrency(rawValue))
    setValue("price", number, { shouldValidate: true })
  }

  async function onSubmit(data: CarFormData) {
    const hasNewImage = data.image && data.image.length > 0
    const hasExistingImage = preview !== null

    if (!hasNewImage && !hasExistingImage) {
      toast.error("Image is required")
      return
    }

    setSaving(true)
    let imageUrl = preview

    if (hasNewImage) {
      const imageFile = data.image[0]
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("car-images")
        .upload(fileName, imageFile)

      if (uploadError) {
        toast.error("Failed to upload image")
        setSaving(false)
        return
      }

      const { data: publicUrlData } = supabase.storage
        .from("car-images")
        .getPublicUrl(fileName)

      imageUrl = publicUrlData.publicUrl
    }

    const { error } = await supabase
      .from("cars")
      .update({
        title: data.title,
        brand: data.brand,
        year: data.year,
        price: data.price,
        image_url: imageUrl,
      })
      .eq("id", car.id)

    if (error) {
      toast.error("Failed to update car")
      setSaving(false)
      return
    }

    toast.success("Car updated successfully!")
    router.push("/")
  }

  async function handleDelete() {
    const { error } = await supabase
      .from("cars")
      .delete()
      .eq("id", car.id)

    if (error) {
      toast.error("Failed to delete car")
      return false
    }

    toast.success("Car deleted successfully!")
    router.push("/")
    return true
  }

  function handleRemoveImage() {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setValue("image", undefined)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto p-6 max-w-3xl border border-gray-300 rounded-2xl flex flex-col gap-4"
    >
      <Field className="gap-1">
        <FieldLabel className="font-normal">Title</FieldLabel>
        <Input 
          placeholder="Title" 
          {...register("title")} 
          className="border-gray-300 focus-visible:ring-0 shadow-none"
        />
        <FieldError className="text-red-500 text-xs mt-1">{errors.title?.message}</FieldError>
      </Field>

      <Field className="gap-1">
        <FieldLabel className="font-normal">Brand</FieldLabel>
        <Input 
          placeholder="Brand" 
          {...register("brand")} 
          className="border-gray-300 focus-visible:ring-0 shadow-none"
        />
        <FieldError className="text-red-500 text-xs mt-1">{errors.brand?.message}</FieldError>
      </Field>

      <Field className="gap-1">
        <FieldLabel className="font-normal">Year</FieldLabel>
        <Input 
          placeholder="Year" 
          type="number" 
          {...register("year", { valueAsNumber: true })} 
          className="border-gray-300 focus-visible:ring-0 shadow-none"
        />
        <FieldError className="text-red-500 text-xs mt-1">{errors.year?.message}</FieldError>
      </Field>

      <Field className="gap-1">
        <FieldLabel className="font-normal">Price</FieldLabel>
        <Input 
          type="text"
          placeholder="R$0,00"
          value={priceFormatted}
          onChange={handlePriceChange} 
          className="border-gray-300 focus-visible:ring-0 shadow-none"
        />
        <FieldError className="text-red-500 text-xs mt-1">{errors.price?.message}</FieldError>
      </Field>

      <Field className="gap-4">
        <FieldLabel 
          htmlFor="image"
          className="
            w-full h-10
            flex items-center justify-center
            rounded-md
            font-normal
            bg-snow hover:bg-gray-300 transition-colors
            cursor-pointer"
        >
          Select Image
        </FieldLabel>

        <Input 
          id="image"
          type="file"
          accept="image/*"
          className="hidden"
          {...register("image")}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              if (preview) URL.revokeObjectURL(preview)
              setPreview(URL.createObjectURL(file))
            }
          }}
        />

        {preview && (
          <div className="relative w-fit!">
            <Image
              src={preview}
              alt="Preview"
              className="w-50 object-cover border border-gray-300 rounded-lg"
              width={100}
              height={100}
              sizes="200px"
            />

            <Button
              type="button"
              size="icon"
              onClick={handleRemoveImage}
              className="
                w-8 h-8
                absolute top-2 right-2
                bg-white
                flex justify-center items-center
                rounded-full
                shadow-md
                cursor-pointer
              "                
            >
              <CloseLineIcon className="size-4 text-black" />
            </Button>
          </div>
        )}
        <FieldError className="text-red-500 text-xs mt-1">{errors.image?.message as string}</FieldError>
      </Field>

      <Button 
        type="submit" 
        className="w-full h-10 bg-orange hover:bg-darkorange text-white cursor-pointer"
        disabled={saving}
      >
        {saving ? <LoaderLineIcon className="size-4 animate-spin" /> : "Save Changes"}
      </Button>
      
      <DeleteCarDialog onDelete={handleDelete} />
    </form>
  )
}