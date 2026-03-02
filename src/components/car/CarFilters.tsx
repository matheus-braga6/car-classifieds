"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CloseLineIcon } from "@/assets/icons/CloseLineIcon"
import { homeFilterConfig } from "@/data/car-filters"

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

export function CarFilters({ options }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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

  // Returns array of selected values for a given filter key
  function getSelected(key: string): string[] {
    return searchParams.getAll(key)
  }

  // Toggles a value in the filter (adds or removes)
  const toggleValue = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.getAll(key)

    params.delete(key)

    if (current.includes(value)) {
      current.filter((v) => v !== value).forEach((v) => params.append(key, v))
    } else {
      current.forEach((v) => params.append(key, v))
      params.append(key, value)
    }

    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])

  // Handles price input formatting and updates local state
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

  function applyPriceFilter() {
    const params = new URLSearchParams(searchParams.toString())

     if (priceMin) {
      params.set("priceMin", priceMin)   
    } else {
      params.delete("priceMin")          
    }

    if (priceMax) {
      params.set("priceMax", priceMax)   
    } else {
      params.delete("priceMax")        
    }

    router.push(`${pathname}?${params.toString()}`)
  }

   // Removes a specific value from a filter
  const removeValue = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

     if (key === "price") { 
      params.delete("priceMin")          
      params.delete("priceMax")          
      setPriceMin("")
      setPriceMax("")
      setPriceMinFormatted("")
      setPriceMaxFormatted("")
    } else {
      const current = params.getAll(key)
      params.delete(key)
      current.filter((v) => v !== value).forEach((v) => params.append(key, v))
    }

    router.push(`${pathname}?${params.toString()}`)
  }, [searchParams, pathname, router])

  // Builds the list of active filter tags to display
  const activeTags: { key: string; value: string }[] = []
  homeFilterConfig.forEach((filter) => {
    if (filter.type === "multi-select") {
      getSelected(filter.key).forEach((value) => {
        activeTags.push({ key: filter.key, value })
      })
    } else if (filter.type === "price-range") {
      const min = searchParams.get("priceMin")  
      const max = searchParams.get("priceMax")

      if (min && max) {
        activeTags.push({ 
          key: "price", 
          value: `${formatCurrency(Number(min))} — ${formatCurrency(Number(max))}` 
        })
      } else if (min) {
        activeTags.push({ 
          key: "price", 
          value: `A partir de ${formatCurrency(Number(min))}` 
        })
      } else if (max) {
        activeTags.push({ 
          key: "price", 
          value: `Até ${formatCurrency(Number(max))}` 
        })
      }
    }
  })

  const hasFilters = activeTags.length > 0

  return (
    <div className="w-full lg:w-65 max-w-75 flex flex-col gap-4">
      {hasFilters && (
        <div className="flex flex-wrap gap-3">
          {activeTags.map(({ key, value }) => (
            <Badge
              key={`${key}-${value}`}
              variant="outline"
              className="flex flex-wrap items-center gap-1 px-2 py-1 border-gray-300 rounded-md text-sm"
            >
              <span>{value}</span>
              <Button
                onClick={() => removeValue(key, value)}
                className="w-4 h-4 p-0 hover:text-orange transition-colors cursor-pointer"
              >
                <CloseLineIcon className="size-4" />
              </Button>
            </Badge>
          ))}

          <Button
            onClick={() => router.push(pathname)}
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
        </div>
      )}

      <Accordion type="multiple" className="w-full">
        {homeFilterConfig.map((filter) => {

          if (filter.type === "multi-select") {
            const filterOptions = options[filter.key] ?? []
            const selected = getSelected(filter.key)

            return (
              <AccordionItem key={filter.key} value={filter.key} className="border-b-0">
                <AccordionTrigger className="cursor-pointer py-2 hover:no-underline">
                  <div className="w-full flex items-center gap-1">
                    {filter.placeholder}
                    {selected.length > 0 && (
                      <Badge className="w-4.5 h-4.5 p-0 ml-auto bg-orange text-white shrink-0 text-[12px] flex items-center justify-center">
                        {selected.length}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3">
                    {filterOptions.map((option) => {
                      const value = String(option)
                      const isChecked = selected.includes(value)

                      return (
                        <label
                          key={value}
                          className="
                            flex items-center gap-2 
                            text-sm hover:text-gray-600
                            cursor-pointer"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleValue(filter.key, value)}
                            className="
                              cursor-pointer 
                              hover:text-gray-600 data-[state=checked]:bg-orange
                              data-[state=checked]:border-orange"
                          />
                          {option}
                        </label>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          }

          if (filter.type === "price-range") {
            return (
              <AccordionItem key={filter.key} value={filter.key} className="border-b-0">
                <AccordionTrigger className="cursor-pointer py-2 hover:no-underline">
                  {filter.placeholder}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-sm">De</span>
                      <Input
                        type="text"
                        placeholder="R$ 0,00"
                        value={priceMinFormatted}
                        onChange={(e) => handlePriceInput(e.target.value, setPriceMin, setPriceMinFormatted)}
                        className="border-gray-300 focus-visible:ring-0 shadow-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-sm">Até</span>
                      <Input
                        type="text"
                        placeholder="R$ 0,00"
                        value={priceMaxFormatted}
                        onChange={(e) => handlePriceInput(e.target.value, setPriceMax, setPriceMaxFormatted)}                         className="border-gray-300 focus-visible:ring-0 shadow-none"
                      />
                    </div>
                    <Button
                      onClick={applyPriceFilter}
                      className="w-full bg-orange hover:bg-darkorange text-white cursor-pointer"
                    >
                      Aplicar
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          }
        })}
      </Accordion>
    </div>
  )
}