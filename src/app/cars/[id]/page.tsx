import { Container } from "@/components/layout/Container"
import { supabaseServer } from "@/lib/supabase-server"
import CarEditForm from "./CarEditForm"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CarDetailPage({ params }: PageProps) {
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
    <Container>
      <section className="mt-20 py-10 min-h-[calc(100vh-80px)]">
        <h1 className="text-3xl text-center text-gray font-bold mb-8">
          EDIT CAR
        </h1>

        <CarEditForm car={data} />
      </section>
    </Container>
  )
}