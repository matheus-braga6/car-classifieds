import { Container } from "@/components/layout/Container"
import { CarCard } from "@/components/ui/car-card"
import { supabaseServer } from "@/lib/supabase-server"

export default async function Home() {
  const { data, error } = await supabaseServer
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error(error)
  }

  const cars = data ?? []
  
  return (
    <Container>
      <section className="mt-20 py-10 min-h-[calc(100vh-80px)]">
        <h1 className="text-3xl text-center text-gray font-bold mb-8">
          CAR CLASSIFIEDS
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>
    </Container>
  );
}
