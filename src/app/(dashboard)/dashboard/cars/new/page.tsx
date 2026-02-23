"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import { CloseLineIcon } from "@/assets/icons/CloseLineIcon"
import Image from "next/image" 
import { toast } from "sonner"

import { createClient } from "@/lib/supabase-client"
import { carSchema, CarFormData } from "@/types/car"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

export default function NewCarPage() {
  const supabase = createClient()
  const router = useRouter()

  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
     defaultValues: {
      title: "",
      brand: "",
      year: undefined,
      price: 0,   
      image: undefined,
    }
  })

  const { control, handleSubmit, setValue, reset } = form

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  async function onSubmit(data: CarFormData) {
    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Você precisa estar logado!")
      setIsLoading(false)
      return
    }

    try {
      const imageFile = data.image[0]
      if (!imageFile) {
        toast.error("Por favor selecione uma imagem.")
        return
      }
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`

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
          user_id: user!.id
        })

      if (insertError) throw insertError

      toast.success("Carro adicionado com sucesso!")
      router.push("/dashboard") 
      reset()
      setPreview(null)
    } catch (err) {
      console.error(err)
      toast.error("Algo deu errado, por favor tente novamente!")
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
    <section 
      className="
        w-full px-15 py-10 sm:p-10
        flex flex-col items-center gap-5
      "
    >
      <h1 className="text-3xl text-center text-gray font-bold mb-8">
        ADICIONAR CARRO
      </h1>
      
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="
          w-full mx-auto p-6 max-w-3xl 
          flex flex-col gap-4
          border border-gray-300 rounded-2xl 
        "
      >
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor={field.name} className="font-normal">Título</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Título"
                aria-invalid={fieldState.invalid}
                className="border-gray-300 focus-visible:ring-0 shadow-none"
              />
              {fieldState.invalid && (
                <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="brand"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor={field.name} className="font-normal">Marca</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Marca"
                aria-invalid={fieldState.invalid}
                className="border-gray-300 focus-visible:ring-0 shadow-none"
              />
              {fieldState.invalid && (
                <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="year"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor={field.name} className="font-normal">Ano</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="number"
                placeholder="Ano"
                aria-invalid={fieldState.invalid}
                className="border-gray-300 focus-visible:ring-0 shadow-none"
                value={field.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value
                  field.onChange(value === "" ? undefined : Number(value))
                }}
              />
              {fieldState.invalid && (
                <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel htmlFor={field.name} className="font-normal">Preço</FieldLabel>
              <Input
                id={field.name}
                type="text"
                placeholder="R$0,00"
                aria-invalid={fieldState.invalid}
                className="border-gray-300 focus-visible:ring-0 shadow-none"
                value={field.value ? formatCurrency(field.value) : ""}
                onChange={(e) => {
                  const numbers = e.target.value.replace(/\D/g, "")
                  field.onChange(Number(numbers) / 100)
                }}
              />
              {fieldState.invalid && (
                <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />

        <Controller
          name="image"
          control={control}
          render={({ field: { onChange: onFieldChange }, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-1">
              <FieldLabel
                htmlFor="image"
                className="
                  w-full h-10
                  flex items-center justify-center
                  rounded-md font-normal
                  bg-snow hover:bg-gray-300 transition-colors
                  cursor-pointer"
              >
                Selecionar Imagem
              </FieldLabel>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  onFieldChange(e.target.files)
                  const file = e.target.files?.[0]
                  if (file) {
                    if (preview) URL.revokeObjectURL(preview)
                    setPreview(URL.createObjectURL(file))
                  }
                }}
              />
              {fieldState.invalid && (
                <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
              )}
            </Field>
          )}
        />
          
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
          {isLoading ? <LoaderLineIcon className="size-4 animate-spin" /> : "Salvar Alterações"}
        </Button>
      </form>
    </section>
  )
}