export type FilterType = "select" | "input-number" | "multi-select" | "price-range"

export interface FilterConfig {
  key: string
  label: string
  type: FilterType
  placeholder: string
}

export const dashboardFilterConfig: FilterConfig[] = [
  {
    key: "brand",
    label: "Marca",
    type: "select",
    placeholder: "Todas as marcas",
  },
  {
    key: "year",
    label: "Ano",
    type: "select",
    placeholder: "Todos os anos",
  },
  {
    key: "price",
    label: "Preço",
    type: "price-range",
    placeholder: "Preço",
  },
]

export const homeFilterConfig: FilterConfig[] = [
  {
    key: "brand",
    label: "Marca",
    type: "multi-select",
    placeholder: "Marca",
  },
  {
    key: "year",
    label: "Ano",
    type: "multi-select",
    placeholder: "Ano",
  },
  {
    key: "price",         
    label: "Preço",
    type: "price-range",
    placeholder: "Preço",
  },
]