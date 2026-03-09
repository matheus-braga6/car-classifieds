import { createSupabaseServerClient } from "@/lib/supabase-server"
import { Container } from "@/components/layout/Container"
import { CarDetail } from "@/components/car/CarDetail"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !car) notFound()

  return (
    <Container>
      <section className="mt-20 py-10 min-h-[calc(100vh-80px)]">
        <CarDetail car={car} />
      </section>
    </Container>
  )
}