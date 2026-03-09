import { Container } from "@/components/layout/Container"
import { CarCard } from "@/components/car/CarCard"
import { CarFilters } from "@/components/car/CarFilters"
import { CarFiltersMobile } from "@/components/car/CarFiltersMobile"
import { createSupabaseServerClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"
interface PageProps {
  searchParams: Promise<{
    brand?: string | string[]
    fuel?: string | string[]
    transmission?: string | string[]
    category?: string | string[]
    color_main?: string | string[]
    yearMin?: string
    yearMax?: string
    mileageMin?: string
    mileageMax?: string
    priceMin?: string
    priceMax?: string
  }>
}

export default async function Home({ searchParams }: PageProps) {
  const {
    brand, fuel, transmission, category, color_main,
    yearMin, yearMax, mileageMin, mileageMax, priceMin, priceMax
  } = await searchParams
  const supabaseServer = await createSupabaseServerClient()

  const { data: allCars } = await supabaseServer
    .from("cars")
    .select("brand, fuel, transmission, category, color_main")

  const brands       = [...new Set(allCars?.map((c) => c.brand) ?? [])].sort()
  const fuels        = [...new Set(allCars?.map((c) => c.fuel).filter(Boolean) ?? [])]
  const transmissions= [...new Set(allCars?.map((c) => c.transmission).filter(Boolean) ?? [])]
  const categories   = [...new Set(allCars?.map((c) => c.category).filter(Boolean) ?? [])].sort()
  const colors       = [...new Set(allCars?.map((c) => c.color_main).filter(Boolean) ?? [])].sort()

  const toArray = (val?: string | string[]) => val ? (Array.isArray(val) ? val : [val]) : []

  const brands_filter       = toArray(brand)
  const fuels_filter        = toArray(fuel)
  const transmissions_filter= toArray(transmission)
  const categories_filter   = toArray(category)
  const colors_filter       = toArray(color_main)

  let query = supabaseServer
    .from("cars")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (brands_filter.length > 0)        query = query.in("brand", brands_filter)
  if (fuels_filter.length > 0)         query = query.in("fuel", fuels_filter)
  if (transmissions_filter.length > 0) query = query.in("transmission", transmissions_filter)
  if (categories_filter.length > 0)    query = query.in("category", categories_filter)
  if (colors_filter.length > 0)        query = query.in("color_main", colors_filter)
  if (yearMin)    query = query.gte("year_model", Number(yearMin))
  if (yearMax)    query = query.lte("year_model", Number(yearMax))
  if (mileageMin) query = query.gte("mileage", Number(mileageMin))
  if (mileageMax) query = query.lte("mileage", Number(mileageMax))
  if (priceMin)   query = query.gte("price", Number(priceMin))
  if (priceMax)   query = query.lte("price", Number(priceMax))

  const { data, error } = await query
  if (error) console.error(error)

  const cars = data ?? []
  
  return (
    <Container>
      <section className="mt-20 py-10 h-full flex flex-col items-center min-h-[calc(100vh-80px)]">
        <div className="lg:hidden mb-10 flex w-full">
          <CarFiltersMobile
            options={{ brand: brands, fuel: fuels, transmission: transmissions, category: categories, color_main: colors, year_model: [], mileage: [] }}
          />
        </div>

        <div className="w-full flex gap-10">
          <aside className="hidden lg:block shrink-0">
            <CarFilters 
              options={{ brand: brands, fuel: fuels, transmission: transmissions, category: categories, color_main: colors, year_model: [], mileage: [] }}
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
