import { createSupabaseServerClient } from "@/lib/supabase-server"
import { CarCard } from "@/components/car/CarCard"
import { CarFiltersDashboard } from "@/components/car/CarFiltersDashboard"
interface PageProps {
  searchParams: Promise<{
    brand?: string    
    year?: string    
    priceMin?: string 
    priceMax?: string 
  }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { brand, year, priceMin, priceMax } = await searchParams
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: allCars } = await supabase
    .from("cars")
    .select("brand, year")
    .eq("user_id", user!.id)

  const brands = [...new Set(allCars?.map((c) => c.brand) ?? [])].sort()
  const years = [...new Set(allCars?.map((c) => c.year) ?? [])].sort((a, b) => b - a)

  let query = supabase
  .from("cars")
  .select("*")
  .eq("user_id", user!.id)
  .order("created_at", { ascending: false })

  if (brand) query = query.eq("brand", brand)
  if (year) query = query.eq("year", Number(year))
  if (priceMin) query = query.gte("price", Number(priceMin))
  if (priceMax) query = query.lte("price", Number(priceMax))

  const { data: cars } = await query

  return (
    <section 
      className="
        w-full p-4 lg:py-10
        flex flex-col items-center gap-5
      "
    >
      <h1 className="w-[75%] text-3xl text-center text-gray font-bold">
        MEUS CARROS
      </h1>

      <CarFiltersDashboard
        options={{
          brand: brands,
          year: years
        }}
      />

      {cars && cars.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} editable />
          ))}
        </div>
      ) : (
        <p 
          className="
            p-10 my-auto
            bg-snow rounded-lg
            text-center text-gray-500 
          "
        >
          Você ainda não cadastrou nenhum carro
        </p>
      )}
    </section>
  )

}