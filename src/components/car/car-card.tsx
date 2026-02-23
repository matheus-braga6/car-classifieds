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

export function CarCard({ car, editable = false }: Props) {
  const [imageLoading, setImageLoading] = useState(true)
  
  return (
    <Card className="rounded-2xl border border-gray-300 shadow-md gap-0 py-0 overflow-hidden">
      

      <div className="relative w-full h-60 min-h-60">  
        {imageLoading && (
          <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
        )}

        <Image
          src={car.image_url}
          alt={car.title}
          width={400}
          height={400}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoading(false)}
        />
      </div>

      <CardContent className="p-4 h-full flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{car.title}</h2>
        <p className="text-sm">
          {car.brand} • {car.year}
        </p>
        <p className="text-xl font-bold text-orange">
           {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(car.price)}
        </p>

        <Link 
          href={editable ? `/dashboard/cars/${car.id}` : `/cars/${car.id}`} 
          className={`
            mt-auto"
            ${!editable ? "pointer-events-none" : ""}
          `}
        >
          <Button 
            className={`
              w-full h-10
              bg-orange hover:bg-darkorange transition-colors
              text-white
              cursor-pointer
              ${!editable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {editable ? "Editar" : "Ver detalhes (Em Breve)"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}