import { Container } from "@/components/layout/Container"
import { CarCard } from "@/components/car/car-card"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export default async function Home() {
  const supabaseServer = await createSupabaseServerClient()

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
      <section className="mt-20 py-10 h-full flex flex-col items-center min-h-[calc(100vh-80px)]">
        <h1 className="text-3xl text-center text-gray font-bold mb-8">
          TODOS OS CARROS
        </h1>

        {cars && cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <p 
            className="
              w-max p-10 m-auto
              bg-snow rounded-lg
              text-center text-gray-500 
            "
          >
            Nenhum carro disponível
          </p>
        )}
      </section>
    </Container>
  );
}
