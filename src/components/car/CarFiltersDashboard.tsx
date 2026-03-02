"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { dashboardFilterConfig } from "@/data/car-filters"
import { SearchLineIcon } from "@/assets/icons/SearchLineIcon"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import { CloseLineIcon } from "@/assets/icons/CloseLineIcon"

interface Props {
  options: {
    [key: string]: string[] | number[]
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function CarFiltersDashboard({ options }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialFilters = Object.fromEntries(
    dashboardFilterConfig.map((filter) => {
      if (filter.type === "price-range") {
        return [
          ["priceMin", searchParams.get("priceMin") ?? ""],
          ["priceMax", searchParams.get("priceMax") ?? ""]
        ]
      }
      return [[filter.key, searchParams.get(filter.key) ?? "all"]]
    }).flat()
  )

  const [isPending, startTransition] = useTransition()
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(initialFilters)
  const [priceMinFormatted, setPriceMinFormatted] = useState(() => {  
    const val = searchParams.get("priceMin")                          
    return val ? formatCurrency(Number(val)) : ""
  })
  const [priceMaxFormatted, setPriceMaxFormatted] = useState(() => {  
    const val = searchParams.get("priceMax")                      
    return val ? formatCurrency(Number(val)) : ""
  })

  // Handles price input formatting and updates local filter state
  function handlePriceInput(
    raw: string,
    field: "priceMin" | "priceMax",
    setFormatted: (v: string) => void
  ) {
    const numbers = raw.replace(/\D/g, "")
    const number = Number(numbers) / 100
    setLocalFilters((prev) => ({ ...prev, [field]: numbers ? String(number) : "" }))
    setFormatted(numbers ? formatCurrency(number) : "")
  }

  // Applies all local filters to the URL at once
  function applyFilters() {
    const params = new URLSearchParams()

    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value)
    })

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  // Resets all filters and clears the URL
  function clearFilters() {
    const reset = Object.fromEntries(
      Object.keys(localFilters).map((key) => [key, key.startsWith("price") ? "" : "all"])
    )
    setLocalFilters(reset)
    setPriceMinFormatted("")  
    setPriceMaxFormatted("")
    router.push(pathname)
  }

  const hasFilters = searchParams.toString() !== ""

  return (
    <div className="w-full flex flex-col gap-4 my-6">
      <div className="flex flex-col xs:flex-row gap-4">
        {dashboardFilterConfig.map((filter) => {
          
          if (filter.type === "select") {
            const filterOptions = options[filter.key] ?? []

            return (
              <Select
                key={filter.key}
                value={localFilters[filter.key as "brand" | "year"]}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({ ...prev, [filter.key]: value }))
                }
              >
                <SelectTrigger className="w-full xs:w-45 border-gray-300 cursor-pointer">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent 
                  position="popper" 
                  className="bg-white border-gray-300"
                >
                  <SelectItem 
                    value="all" 
                    className="cursor-pointer"
                  >
                    {filter.placeholder}
                  </SelectItem>

                  {filterOptions.map((option) => (
                    <SelectItem 
                      key={option} 
                      value={String(option)} 
                      className="cursor-pointer hover:bg-snow"
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }
        })}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        {dashboardFilterConfig.map((filter) => {
          if (filter.type === "price-range") {
            return (
              <div key={filter.key} className="w-full xs:w-max flex flex-col xs:flex-row items-center gap-2">
                <div className="w-full xs:w-max flex flex-col">
                  <span className="text-gray-400 text-sm xs:hidden">De</span>
                  <Input
                    type="text"
                    placeholder="R$ 0,00"
                    value={priceMinFormatted}
                    onChange={(e) => handlePriceInput(e.target.value, "priceMin", setPriceMinFormatted)}
                    className="w-full xs:w-36 border-gray-300 focus-visible:ring-0 shadow-none"
                  />
                </div>

                <span className="hidden xs:block w-6 text-gray-400 text-sm">até</span>

                <div className="w-full xs:w-max flex flex-col">
                  <span className="text-gray-400 text-sm xs:hidden">Até</span>
                  <Input
                    type="text"
                    placeholder="R$ 0,00"
                    value={priceMaxFormatted}
                    onChange={(e) => handlePriceInput(e.target.value, "priceMax", setPriceMaxFormatted)}
                    className="w-full xs:w-36 border-gray-300 focus-visible:ring-0 shadow-none"
                  />
                </div>
                <Button
                  onClick={applyFilters}
                  className="w-full xs:w-max bg-orange hover:bg-darkorange text-white cursor-pointer"
                >
                  <span className="text-white font-medium xs:hidden">Aplicar Filtros</span>
                  {isPending 
                    ? <LoaderLineIcon className="size-4 animate-spin" />
                    : <SearchLineIcon className="size-4 text-white" />
                  }
                </Button>
              </div>
            )
          }
        })}

        {hasFilters && (
          <Button
            onClick={clearFilters}
            className="
              w-max h-fit p-0 
              text-orange text-sm
              border-b border-b-transparent hover:border-b-orange hover:border-b rounded-none
              cursor-pointer
            "        
          >
            Limpar filtros
            <CloseLineIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}