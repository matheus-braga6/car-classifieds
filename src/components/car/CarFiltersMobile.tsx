"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { CarFilters } from "@/components/car/CarFilters"
import { EqualizerLineIcon } from "@/assets/icons/EqualizerLineIcon"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { useSearchParams } from "next/navigation"

interface Props {
  options: {
    [key: string]: string[] | number[]
  }
}

export function CarFiltersMobile({ options }: Props) {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()

  // Counts active filters from URL params
  const activeCount = searchParams.toString()
    ? searchParams.toString().split("&").length
    : 0

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="border-gray-300 cursor-pointer gap-2 mr-auto">
          <EqualizerLineIcon className="size-4" />
          Filtros
          {activeCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-orange text-white text-xs">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-white w-80 min-w-80 p-4 pt-11 flex flex-col overflow-y-auto border-r-0">
        <VisuallyHidden>
          <SheetTitle>Filtros</SheetTitle>
        </VisuallyHidden>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <CarFilters options={options} />
        </div>
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          className="w-full text-orange cursor-pointer mt-4 shrink-0"
        >
          Ver resultados
        </Button>
      </SheetContent>
    </Sheet>
  )
}