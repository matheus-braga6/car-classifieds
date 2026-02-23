"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { carSchema, CarFormData, CarFromDB } from "@/types/car"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import Image from "next/image"
import { CloseLineIcon } from "@/assets/icons/CloseLineIcon"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import { toast } from "sonner"
import { DeleteCarDialog } from "./DeleteCarDialog"
interface Props {
  car: CarFromDB
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export default function CarEditForm({ car }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(car.image_url)
  const [saving, setSaving] = useState(false)

  const form = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      title: car.title,
      brand: car.brand,
      year: car.year,
      price: car.price,
      image: undefined,
    },
  })

  const { control, handleSubmit, setValue } = form

  async function onSubmit(data: CarFormData) {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error("Você precisa estar logado!")
      return
    }
    
    const hasNewImage = data.image && data.image.length > 0
    const hasExistingImage = preview !== null

    if (!hasNewImage && !hasExistingImage) {
      toast.error("A imagem é obrigatória!")
      return
    }

    setSaving(true)
    let imageUrl = preview

    if (hasNewImage) {
      const imageFile = data.image[0]
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("car-images")
        .upload(fileName, imageFile)

      if (uploadError) {
        toast.error("Falha ao adicionar imagem, tente novamente!")
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
      toast.error("Falha ao atualizar o carro, tente novamente!")
      setSaving(false)
      return
    }

    toast.success("Carro atualizado com sucesso!")
    router.push("/dashboard")
  }

  async function handleDelete() {
    const imageUrl = car.image_url

    if (imageUrl) {
      const path = imageUrl.split("/car-images/")[1]

      if (path) {
        await supabase.storage
          .from("car-images")
          .remove([path])
      }
    }

    const { error } = await supabase
      .from("cars")
      .delete()
      .eq("id", car.id)

    if (error) {
      toast.error("Falha ao deletar o carro, tente novamente!")
      return false
    }

    toast.success("Carro deletado com sucesso!")
    router.push("/dashboard")
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
              id={field.name}
              type="number"
              placeholder="Ano"
              aria-invalid={fieldState.invalid}
              className="border-gray-300 focus-visible:ring-0 shadow-none"
              defaultValue={field.value}
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
                    w-8 h-8 absolute top-2 right-2
                    bg-white flex justify-center items-center
                    rounded-full shadow-md cursor-pointer"
                >
                  <CloseLineIcon className="size-4 text-black" />
                </Button>
              </div>
            )}

            {fieldState.invalid && (
              <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
            )}
          </Field>
        )}
      />

      <Button 
        type="submit" 
        disabled={saving}
        className="
          w-full h-10 
          bg-orange hover:bg-darkorange
          text-white
          cursor-pointer"
      >
        {saving ? <LoaderLineIcon className="size-4 animate-spin" /> : "Salvar Alterações"}
      </Button>
      
      <DeleteCarDialog onDelete={handleDelete} />
    </form>
  )
}