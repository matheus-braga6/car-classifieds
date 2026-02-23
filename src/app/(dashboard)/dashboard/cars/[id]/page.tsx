import { Container } from "@/components/layout/Container"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import CarEditForm from "./CarEditForm"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CarDetailPage({ params }: PageProps) {
  const supabaseServer = await createSupabaseServerClient()
  const { id } = await params

  const { data, error } = await supabaseServer
    .from("cars")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return (
      <Container>
        <div className="mt-20 text-center">
          Car not found.
        </div>
      </Container>
    )
  }

  return (
    <section 
      className="
        w-full px-15 py-10 sm:p-10
        flex flex-col items-center gap-5
      "
    >
      <h1 className="text-3xl text-center text-gray font-bold mb-8">
        EDITAR CARRO
      </h1>

      <CarEditForm car={data} />
    </section>
  )
}