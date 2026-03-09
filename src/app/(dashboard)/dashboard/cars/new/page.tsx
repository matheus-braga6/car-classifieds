"use client"

import { useState } from "react"
import { useForm, Resolver} from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image" 
import { toast } from "sonner"

import { createClient } from "@/lib/supabase-client"
import { carSchema, CarFormData, fuelOptions, transmissionOptions, categoryOptions } from "@/types/car"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { FormInput, FormSelect, FormSwitch, FormTextarea, FormPriceInput } from "@/components/ui/form-fields"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import { CloseLineIcon } from "@/assets/icons/CloseLineIcon"

const statusOptions = [
  { value: "active", label: "Ativo" },
  { value: "sold", label: "Vendido" },
  { value: "reserved", label: "Reservado" },
]

const switchFields = [
  { name: "armored",        label: "Blindado" },
  { name: "convertible",    label: "Conversível" },
  { name: "autopilot",      label: "Piloto automático" },
  { name: "bluetooth",      label: "Bluetooth" },
  { name: "parking_sensor", label: "Sensor de estacionamento" },
  { name: "camera",         label: "Câmera de ré" },
  { name: "rain_sensor",    label: "Sensor de chuva" },
  { name: "multimedia",     label: "Central multimídia" },
] as const

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider border-b border-gray-200 pb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}

function FormRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  )
}

export default function NewCarPage() {
  const supabase = createClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([])

  const { control, handleSubmit, reset } = useForm<CarFormData>({
    resolver: zodResolver(carSchema) as Resolver<CarFormData>,
    defaultValues: {
      title: "", brand: "", model: "",
      year_fab: undefined, year_model: undefined,
      category: "", color_main: "", mileage: undefined,
      fuel: "", transmission: "",
      price: undefined,
      color_secondary: "", color_interior: "",
      plate: "", renavam: "", chassis: "",
      doors: undefined, seats: undefined,
      engine: "", power: "", acceleration: "",
      autonomy: undefined, airbags: undefined,
      warranty_until: "",
      brakes: "", headlights: "", wheels: "", sunroof: "",
      description: "",
      armored: false, convertible: false, autopilot: false,
      bluetooth: false, parking_sensor: false, camera: false,
      rain_sensor: false, multimedia: false,
      featured: false, status: "active",
      image_urls: [],
    },
  })

  // Handles image selection and generates local previews
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setPreviews((prev) => [...prev, ...newPreviews])
  }

  // Removes a specific image from the preview list
  function handleRemoveImage(index: number) {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function onSubmit(data: CarFormData) {
    if (previews.length === 0) {
      toast.error("Adicione pelo menos uma imagem!")
      return
    }

    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error("Você precisa estar logado!")
      setIsLoading(false)
      return
    }

    try {
      const uploadedUrls: string[] = []
      for (const preview of previews) {
        const fileExt = preview.file.name.split(".").pop()
        const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("car-images")
          .upload(fileName, preview.file)

        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from("car-images")
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrlData.publicUrl)
      }

      const { error: insertError } = await supabase
        .from("cars")
        .insert({
          ...data,
          image_urls: uploadedUrls,
          user_id: user.id,
          warranty_until: data.warranty_until || null,
          color_secondary: data.color_secondary || null,
          color_interior: data.color_interior || null,
          plate: data.plate || null,
          renavam: data.renavam || null,
          chassis: data.chassis || null,
          engine: data.engine || null,
          power: data.power || null,
          acceleration: data.acceleration || null,
          brakes: data.brakes || null,
          headlights: data.headlights || null,
          wheels: data.wheels || null,
          sunroof: data.sunroof || null,
          description: data.description || null,
        })

      if (insertError) throw insertError

      toast.success("Carro adicionado com sucesso!")
      reset()
      setPreviews([])
      router.push("/dashboard") 
    } catch (err) {
      console.error(err)
      toast.error("Algo deu errado, por favor tente novamente!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section 
      className="
        w-full p-4 lg:py-10
        flex flex-col items-center gap-5
      "
    >
      <h1 className="w-[75%] text-3xl text-center text-gray font-bold mb-8">
        ADICIONAR CARRO
      </h1>
      
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="
          w-full mx-auto p-6 max-w-6xl 
          flex flex-col gap-6
          border border-gray-300 rounded-2xl 
        "
      >
        {/* ── ANÚNCIO ── */}
        <FormSection title="Anúncio">
          <FormInput name="title" control={control} label="Título do anúncio" placeholder='Ex: Honda Civic EXL 2022 impecável' required />
          <FormRow>
            <FormSelect name="status" control={control} label="Status" options={statusOptions} />
            <FormSwitch name="featured" control={control} label="Destacar Veículo" />
          </FormRow>
        </FormSection>

        {/* ── IDENTIFICAÇÃO ── */}
        <FormSection title="Identificação">
          <FormRow>
            <FormInput name="brand" control={control} label="Marca" placeholder="Ex: Honda" required />
            <FormInput name="model" control={control} label="Modelo" placeholder="Ex: Civic EXL" required />
          </FormRow>
          <FormRow>
            <FormInput name="year_fab" control={control} label="Ano de fabricação" placeholder="Ex: 2021" type="number" required />
            <FormInput name="year_model" control={control} label="Ano do modelo" placeholder="Ex: 2022" type="number" required />
          </FormRow>
          <FormRow>
            <FormSelect name="category" control={control} label="Categoria" options={categoryOptions} required />
            <FormInput name="mileage" control={control} label="Quilometragem" placeholder="Ex: 45000" type="number" required />
          </FormRow>
          <FormRow>
            <FormInput name="plate" control={control} label="Placa" placeholder="Ex: ABC-1234" />
            <FormInput name="chassis" control={control} label="Chassi" placeholder="Ex: 9BWZZZ377VT004251" />
          </FormRow>
          <FormInput name="renavam" control={control} label="Renavam" placeholder="Ex: 00123456789" />
        </FormSection>

        {/* ── MECÂNICA ── */}
        <FormSection title="Mecânica">
          <FormRow>
            <FormSelect name="fuel" control={control} label="Combustível" options={fuelOptions} required />
            <FormSelect name="transmission" control={control} label="Transmissão" options={transmissionOptions} required/>
          </FormRow>
          <FormRow>
            <FormInput name="engine" control={control} label="Motor" placeholder="Ex: 2.0 Turbo" />
            <FormInput name="power" control={control} label="Potência" placeholder="Ex: 200cv" />
          </FormRow>
          <FormRow>
            <FormInput name="acceleration" control={control} label="Aceleração" placeholder="Ex: 0-100 em 7s" />
            <FormInput name="autonomy" control={control} label="Autonomia (km/l)" placeholder="Ex: 12.5" type="number" />
          </FormRow>
        </FormSection>

         {/* ── CARACTERÍSTICAS ── */}
        <FormSection title="Características">
          <FormRow>
            <FormInput name="color_main" control={control} label="Cor predominante" placeholder="Ex: Preto" required />
            <FormInput name="color_secondary" control={control} label="Cor secundária" placeholder="Ex: Prata" />
          </FormRow>
          <FormRow>
            <FormInput name="color_interior" control={control} label="Cor interna" placeholder="Ex: Bege" />
            <FormInput name="doors" control={control} label="Portas" placeholder="Ex: 4" type="number" />
          </FormRow>
          <FormRow>
            <FormInput name="seats" control={control} label="Bancos" placeholder="Ex: 5" type="number" />
            <FormInput name="airbags" control={control} label="Airbags" placeholder="Ex: 6" type="number" />
          </FormRow>
          <FormRow>
            <FormInput name="brakes" control={control} label="Freios" placeholder="Ex: ABS a disco" />
            <FormInput name="headlights" control={control} label="Faróis" placeholder="Ex: LED" />
          </FormRow>
          <FormRow>
            <FormInput name="wheels" control={control} label="Rodas" placeholder='Ex: 17" liga leve' />
            <FormInput name="sunroof" control={control} label="Teto solar" placeholder="Ex: Panorâmico" />
          </FormRow>
          <FormRow>
            <FormInput name="warranty_until" control={control} label="Garantia de fábrica até" type="date" />
          </FormRow>
        </FormSection>

        {/* ── OPCIONAIS ── */}
        <FormSection title="Opcionais">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {switchFields.map(({ name, label }) => (
              <FormSwitch key={name} name={name} control={control} label={label} row />
            ))}
          </div>
        </FormSection>

        {/* ── PREÇO ── */}
        <FormSection title="Preço">
          <FormPriceInput
            name="price"
            control={control}
            label="Preço"
            hint='(deixe em branco para "Sob consulta")'
          />
        </FormSection>

        {/* ── DESCRIÇÃO ── */}
        <FormSection title="Descrição">
          <FormTextarea
            name="description"
            control={control}
            label="Descrição"
            placeholder="Descreva o veículo, diferenciais, histórico de manutenção..."
          />
        </FormSection>

        {/* ── IMAGENS ── */}
        <FormSection title="Imagens">
          <Field className="gap-1">
            <FieldLabel
              htmlFor="images"
              className="w-full h-10 flex items-center justify-center rounded-md font-normal bg-snow hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Selecionar Imagens
            </FieldLabel>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </Field>

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {previews.map((preview, index) => (
                <div key={preview.url} className="relative">
                  <Image
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    width={100}
                    height={100}
                    sizes="100px"
                    className="w-24 h-24 object-cover border border-gray-300 rounded-lg"
                  />
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 text-[10px] bg-orange text-white px-1 rounded">
                      Capa
                    </span>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => handleRemoveImage(index)}
                    className="w-6 h-6 absolute top-1 right-1 bg-white rounded-full shadow-md cursor-pointer"
                  >
                    <CloseLineIcon className="size-3 text-black" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </FormSection>
          
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-orange hover:bg-darkorange text-white cursor-pointer"
        >
          {isLoading ? <LoaderLineIcon className="size-4 animate-spin" /> : "Salvar"}
        </Button>
      </form>
    </section>
  )
}