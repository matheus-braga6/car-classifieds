import { createSupabaseServerClient } from "@/lib/supabase-server"
import { CarCard } from "@/components/car/car-card"

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  return (
    <section 
      className="
        w-full p-10 
        flex flex-col items-center gap-5
      "
    >
      <h1 className="text-3xl text-gray font-bold">
        MEUS CARROS
      </h1>

      {cars && cars.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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