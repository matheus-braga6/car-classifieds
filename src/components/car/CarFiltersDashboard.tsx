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
import { dashboardFilterConfig, filterLabels } from "@/data/car-filters"
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
    dashboardFilterConfig
      .filter((f) => f.type === "select")
      .map((f) => [f.key, searchParams.get(f.key) ?? "all"])
  )

  const [isPending, startTransition] = useTransition()
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(initialFilters)

  // Price state
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") ?? "")
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") ?? "")
  const [priceMinFormatted, setPriceMinFormatted] = useState(() => {
    const val = searchParams.get("priceMin")
    return val ? formatCurrency(Number(val)) : ""
  })
  const [priceMaxFormatted, setPriceMaxFormatted] = useState(() => {
    const val = searchParams.get("priceMax")
    return val ? formatCurrency(Number(val)) : ""
  })

  // Year state
  const [yearMin, setYearMin] = useState(searchParams.get("yearMin") ?? "")
  const [yearMax, setYearMax] = useState(searchParams.get("yearMax") ?? "")

  // Mileage state
  const [mileageMin, setMileageMin] = useState(searchParams.get("mileageMin") ?? "")
  const [mileageMax, setMileageMax] = useState(searchParams.get("mileageMax") ?? "")
  const [mileageMinFormatted, setMileageMinFormatted] = useState(() => {
    const val = searchParams.get("mileageMin")
    return val ? new Intl.NumberFormat("pt-BR").format(Number(val)) : ""
  })
  const [mileageMaxFormatted, setMileageMaxFormatted] = useState(() => {
    const val = searchParams.get("mileageMax")
    return val ? new Intl.NumberFormat("pt-BR").format(Number(val)) : ""
  })

  // Handles price input formatting
  function handlePriceInput(
    raw: string,
    setSetter: (v: string) => void,
    setFormatted: (v: string) => void
  ) {
    const numbers = raw.replace(/\D/g, "")
    const number = Number(numbers) / 100
    setSetter(numbers ? String(number) : "")
    setFormatted(numbers ? formatCurrency(number) : "")
  }

  // Handles mileage input formatting
   function handleMileageInput(raw: string, setSetter: (v: string) => void, setFormatted: (v: string) => void) {
    const numbers = raw.replace(/\D/g, "")
    setSetter(numbers)
    setFormatted(numbers ? new Intl.NumberFormat("pt-BR").format(Number(numbers)) : "")
  }

  // Applies all local filters to the URL at once
  function applyFilters() {
    const params = new URLSearchParams()

    Object.entries(localFilters).forEach(([key, value]) => {
      if (value && value !== "all") params.set(key, value)
    })

    // Price range
    if (priceMin) params.set("priceMin", priceMin)
    if (priceMax) params.set("priceMax", priceMax)

    // Year range
    if (yearMin) params.set("yearMin", yearMin)
    if (yearMax) params.set("yearMax", yearMax)

    // Mileage range
    if (mileageMin) params.set("mileageMin", mileageMin)
    if (mileageMax) params.set("mileageMax", mileageMax)

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  // Resets all filters and clears the URL
  function clearFilters() {
    setLocalFilters(Object.fromEntries(Object.keys(localFilters).map((k) => [k, "all"])))
    setPriceMin(""); setPriceMax("")
    setPriceMinFormatted(""); setPriceMaxFormatted("")
    setYearMin(""); setYearMax("")
    setMileageMin(""); setMileageMax("")
    setMileageMinFormatted(""); setMileageMaxFormatted("")
    router.push(pathname)
  }

  const hasFilters = searchParams.toString() !== ""

  return (
    <div className="w-full flex flex-col gap-4 my-6">

      {/* Ranges */}
      <div className="flex flex-col flex-wrap sm:flex-row gap-4 md:items-end">

        {/* Year range */}
        <div className="w-full sm:w-max flex items-end gap-2">
          <div className="w-full sm:w-max flex flex-col">
            <span className="text-sm text-gray800">Ano</span>
            <Input
              type="number"
              placeholder="Ex.: 1900"
              value={yearMin}
              onChange={(e) => setYearMin(e.target.value)}
              className="w-full text-sm sm:w-30 border-gray-300 focus-visible:ring-0 shadow-none placeholder:text-gray-400"
            />
          </div>
          <span className="text-gray-400 text-sm mb-2">até</span>
          <div className="w-full sm:w-max flex flex-col">
            <Input
              type="number"
              placeholder="Ex.: 2026"
              value={yearMax}
              onChange={(e) => setYearMax(e.target.value)}
              className="w-full text-sm sm:w-30 border-gray-300 focus-visible:ring-0 shadow-none placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Mileage range */}
        <div className="w-full sm:w-max flex items-end gap-2">
          <div className="w-full sm:w-max flex flex-col">
            <span className="text-sm text-gray800">Quilometragem</span>
            <div className="relative">
              <Input
                type="text"
                placeholder="Ex: 10.000"
                value={mileageMinFormatted}
                onChange={(e) => handleMileageInput(e.target.value, setMileageMin, setMileageMinFormatted)}
                className="
                  w-full sm:w-30
                  border-gray-300 focus-visible:ring-0 
                  text-sm placeholder:text-gray-400 shadow-none 
                  pr-9
                "
              />
              {mileageMinFormatted && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                  km
                </span>
              )}
            </div>
          </div>
          <span className="text-gray-400 text-sm mb-2">até</span>
          <div className="w-full sm:w-max flex flex-col">
            <div className="relative">
              <Input
                type="text"
                placeholder="Ex: 50.000"
                value={mileageMaxFormatted}
                onChange={(e) => handleMileageInput(e.target.value, setMileageMax, setMileageMaxFormatted)}
                className="
                  w-full sm:w-30 
                  border-gray-300 focus-visible:ring-0 
                  text-sm placeholder:text-gray-400 shadow-none 
                  pr-9
                "
              />
              {mileageMaxFormatted && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                  km
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price range */}
        <div className="w-full sm:w-max flex items-end gap-2">
          <div className="w-full sm:w-max flex flex-col">
            <span className="text-sm text-gray800">Preço</span>
            <Input
              type="text"
              placeholder="R$ 0,00"
              value={priceMinFormatted}
              onChange={(e) => handlePriceInput(e.target.value, setPriceMin, setPriceMinFormatted)}
              className="w-full text-sm sm:w-30 border-gray-300 focus-visible:ring-0 shadow-none placeholder:text-gray-400"
            />
          </div>
          <span className="text-gray-400 text-sm mb-2">até</span>
          <div className="w-full sm:w-max flex flex-col">
            <Input
              type="text"
              placeholder="R$ 0,00"
              value={priceMaxFormatted}
              onChange={(e) => handlePriceInput(e.target.value, setPriceMax, setPriceMaxFormatted)}
              className="w-full text-sm sm:w-30 border-gray-300 focus-visible:ring-0 shadow-none placeholder:text-gray-400"
            />
          </div>
        </div>     
      </div>

      {/* Selects */}
      <div className="flex flex-col items-end flex-wrap xs:flex-row gap-4">
        {dashboardFilterConfig.map((filter) => {
          if (filter.type !== "select") return null
          const filterOptions = options[filter.key] ?? []

          return (
            <Select
              key={filter.key}
              value={localFilters[filter.key] ?? "all"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, [filter.key]: value }))
              }
            >
              <SelectTrigger className="w-full sm:w-53 border-gray-300 cursor-pointer focus-visible:ring-0">
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
                    {filterLabels[option] ?? option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        })}

        <Button
          onClick={applyFilters}
          className="w-full sm:w-max bg-orange hover:bg-darkorange text-white cursor-pointer"
        >
          <span className="text-white font-medium xs:hidden">Aplicar Filtros</span>
          {isPending 
            ? <LoaderLineIcon className="size-4 animate-spin" />
            : <SearchLineIcon className="size-4 text-white" />
          }
        </Button>

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