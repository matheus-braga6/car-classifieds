import { createSupabaseServerClient } from "@/lib/supabase-server"
import { CarDetail } from "@/components/car/CarDetail"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function CarDetailDashboardPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: car, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !car) notFound()

  return (
    <section className="w-full p-4 lg:py-10">
      <CarDetail car={car} />
    </section>
  )
}