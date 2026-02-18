"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import Image from "next/image" 
import { toast } from "sonner"

import { supabase } from "@/lib/supabase"
import { carSchema, CarFormData } from "@/schemas/car-schema"

import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CloseLineIcon } from "@/assets/icons/CloseLineIcon"

import {
  Field,
  FieldLabel,
  FieldError
} from "@/components/ui/field"

export default function NewCarPage() {
  const router = useRouter()

  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [priceFormatted, setPriceFormatted] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
  })

  const { onChange, ...rest } = register("image")

  function formatCurrency(value: string) {
    const numbers = value.replace(/\D/g, "")
    const number = Number(numbers) / 100

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(number)
  }
    
  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawValue = e.target.value
    const numbers = rawValue.replace(/\D/g, "")
    const number = Number(numbers) / 100

    setPriceFormatted(formatCurrency(rawValue))

    setValue("price", number, { shouldValidate: true })
  }

  async function onSubmit(data: CarFormData) {
    try {
       setIsLoading(true)
       const imageFile = data.image[0]
       if (!imageFile) {
        toast.error("Please select an image")
        return
      }
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
      .from("car-images")
      .upload(fileName, imageFile)

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from("car-images")
        .getPublicUrl(fileName)

      const imageUrl = publicUrlData.publicUrl

      const { error: insertError } = await supabase
        .from("cars")
        .insert({
          title: data.title,
          brand: data.brand,
          year: data.year,
          price: data.price,
          image_url: imageUrl,
        })

      if (insertError) throw insertError

      toast.success("Car added successfully!")

      reset()
      setPreview(null)
      router.push("/") 
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong, please try again!")
    } finally {
      setIsLoading(false)
    }
  }

  function handleRemoveImage() {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setValue("image", undefined)
  }

  return (
    <Container>
      <section className="mt-20 py-10 min-h-[calc(100vh-80px)]">
        <h1 className="text-3xl text-center text-gray font-bold mb-8">
          ADD NEW CAR
        </h1>

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
              type="number" 
              placeholder="Year" 
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

          <Field className="gap-1">
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
              {...rest}
              onChange={(e) => {
              onChange(e) 

              const file = e.target.files?.[0]
              if (file) {
                if (preview) URL.revokeObjectURL(preview)
                const imageUrl = URL.createObjectURL(file)
                setPreview(imageUrl)
              }
            }}
            />
            <FieldError className="text-red-500 text-xs mt-1">{errors.image?.message as string}</FieldError>
          </Field>
            
          {preview && (
            <div className="relative w-fit">
              <Image
                src={preview}
                alt="Preview"
                className="
                  w-50 object-cover 
                  border border-gray-300 rounded-lg"
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

          <Button 
            type="submit" 
            disabled={isLoading}
            className="
              w-full h-10 
              bg-orange hover:bg-darkorange
              text-white
              cursor-pointer"
          >
            {isLoading && (
              <LoaderLineIcon className="size-4 animate-spin" />
            )}

            {isLoading ? "" : "Create Car"}
          </Button>
        </form>
      </section>
    </Container>
  )
}