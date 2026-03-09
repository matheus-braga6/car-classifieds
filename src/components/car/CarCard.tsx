"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Car } from "@/types/car"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface Props {
  car: Car
  editable?: boolean
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}



export function CarCard({ car, editable = false }: Props) {
  const [imageLoading, setImageLoading] = useState(true)
  const coverImage = car.image_urls?.[0]

  const statusLabel: Record<string, string> = {
    sold: "Vendido",
    reserved: "Reservado",
    active: "Ativo"
  }

  const statusColor: Record<string, string> = {
    sold: "bg-red-100 text-red-600",
    reserved: "bg-yellow-100 text-yellow-600",
    active: "bg-green-100 text-green-600"
  }
  
  return (
    <Card className="rounded-2xl border border-gray-300 shadow-md gap-0 py-0 overflow-hidden">
      <div className="relative w-full h-60 min-h-60">  
        {imageLoading && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        )}

        {editable && (
          <span className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-sm ${statusColor[car.status]}`}>
            {statusLabel[car.status]}
          </span>
        )}

        {coverImage && (
          <Image
            src={coverImage}
            alt={car.title}
            width={400}
            height={400}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoading(false)}
          />
        )}
      </div>

      <CardContent className="p-4 h-full flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{car.title}</h2>
        <p className="text-sm">
          {car.brand} • {car.year_fab}/{car.year_model} • {new Intl.NumberFormat("pt-BR").format(car.mileage)} km
        </p>
        <p className="text-xl font-bold text-orange">
           {car.price ? formatCurrency(car.price) : "Sob consulta"}
        </p>

        <div className={`mt-auto flex gap-2 ${editable ? "flex-col sm:flex-row" : ""}`}>
          <Link 
            href={editable ? `/dashboard/cars/${car.id}/details` : `/cars/${car.id}`} 
            className="w-full"
          >
            <Button className="w-full h-10 bg-orange hover:bg-darkorange text-white cursor-pointer">
              Ver detalhes
            </Button>
          </Link>
          {editable && (
            <Link href={`/dashboard/cars/${car.id}`} className="w-full">
              <Button
                variant="outline"
                className="w-full h-10 border-gray-300 cursor-pointer"
              >
                Editar
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}