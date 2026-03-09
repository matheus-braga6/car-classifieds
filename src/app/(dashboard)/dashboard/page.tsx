import { createSupabaseServerClient } from "@/lib/supabase-server"
import { CarCard } from "@/components/car/CarCard"
import { CarFiltersDashboard } from "@/components/car/CarFiltersDashboard"
interface PageProps {
  searchParams: Promise<{
    brand?: string
    fuel?: string
    transmission?: string
    color_main?: string  
    yearMin?: string
    yearMax?: string
    mileageMin?: string
    mileageMax?: string
    priceMin?: string
    priceMax?: string
  }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { brand, fuel, transmission, color_main, yearMin, yearMax, mileageMin, mileageMax, priceMin, priceMax } = await searchParams
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: allCars } = await supabase
    .from("cars")
    .select("brand, year_model, fuel, transmission, color_main")
    .eq("user_id", user!.id)

  const brands = [...new Set(allCars?.map((c) => c.brand) ?? [])].sort()
  const fuels = [...new Set(allCars?.map((c) => c.fuel).filter(Boolean) ?? [])]
  const transmissions = [...new Set(allCars?.map((c) => c.transmission).filter(Boolean) ?? [])]
  const colors = [...new Set(allCars?.map((c) => c.color_main).filter(Boolean) ?? [])].sort()


  let query = supabase
  .from("cars")
  .select("*")
  .eq("user_id", user!.id)
  .order("featured", { ascending: false })
  .order("created_at", { ascending: false })

  if (brand) query = query.eq("brand", brand)
  if (fuel) query = query.eq("fuel", fuel)
  if (transmission) query = query.eq("transmission", transmission)
  if (color_main) query = query.eq("color_main", color_main)
  if (yearMin) query = query.gte("year_model", Number(yearMin))
  if (yearMax) query = query.lte("year_model", Number(yearMax))
  if (mileageMin) query = query.gte("mileage", Number(mileageMin))
  if (mileageMax) query = query.lte("mileage", Number(mileageMax))
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
        options={{ brand: brands, fuel: fuels, transmission: transmissions, color_main: colors, year_model: [], mileage: [] }}
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