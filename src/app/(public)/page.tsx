import { Container } from "@/components/layout/Container"
import { CarCard } from "@/components/car/CarCard"
import { CarFilters } from "@/components/car/CarFilters"
import { CarFiltersMobile } from "@/components/car/CarFiltersMobile"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"
interface PageProps {
  searchParams: Promise<{
    brand?: string | string[]   
    year?: string | string[]    
    priceMin?: string
    priceMax?: string
  }>
}

export default async function Home({ searchParams }: PageProps) {
  const { brand, year, priceMin, priceMax } = await searchParams
  const supabaseServer = await createSupabaseServerClient()

  const { data: allCars } = await supabaseServer
    .from("cars")
    .select("brand, year")

  const brands = [...new Set(allCars?.map((c) => c.brand) ?? [])].sort()
  const years = [...new Set(allCars?.map((c) => c.year) ?? [])].sort((a, b) => b - a)

  const brands_filter = brand ? (Array.isArray(brand) ? brand : [brand]) : []
  const years_filter = year ? (Array.isArray(year) ? year.map(Number) : [Number(year)]) : []

  let query = supabaseServer
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false })

  if (brands_filter.length > 0) query = query.in("brand", brands_filter)
  if (years_filter.length > 0) query = query.in("year", years_filter)
  if (priceMin) query = query.gte("price", Number(priceMin))
  if (priceMax) query = query.lte("price", Number(priceMax))

  const { data, error } = await query
  if (error) console.error(error)

  const cars = data ?? []
  
  return (
    <Container>
      <section className="mt-20 py-10 h-full flex flex-col items-center min-h-[calc(100vh-80px)]">
        <div className="lg:hidden mb-10 flex w-full">
          <CarFiltersMobile
            options={{ brand: brands, year: years }}
          />
        </div>

        <div className="w-full flex gap-10">
          <aside className="hidden lg:block shrink-0">
            <CarFilters 
              options={{ brand: brands, year: years }}
            />
          </aside>

          <div className="w-full flex flex-col gap-7">
            <h1 className="text-3xl text-center text-gray font-bold">
              TODOS OS CARROS
            </h1>

            {cars && cars.length > 0 ? (
              <div className="h-fit grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p 
                  className="
                    w-max p-10
                    bg-snow rounded-lg
                    text-center text-gray-500 
                  "
                >
                  Nenhum carro disponível
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Container>
  );
}
