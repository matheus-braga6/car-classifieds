export type FilterType = "select" | "input-number" | "multi-select" | "price-range" | "year-range" | "mileage-range"

export interface FilterConfig {
  key: string
  label: string
  type: FilterType
  placeholder: string
}

export const filterLabels: Record<string, string> = {
  // Combustível
  flex: "Flex",
  gasoline: "Gasolina",
  ethanol: "Álcool",
  diesel: "Diesel",
  electric: "Elétrico",
  hybrid: "Híbrido",
  gnv: "GNV",

  // Transmissão
  manual: "Manual",
  automatic: "Automático",
  automated: "Automatizado",
  cvt: "CVT",
  
  // Categoria
  hatch: "Hatch",
  sedan: "Sedan",
  suv: "SUV",
  pickup: "Picape",
  minivan: "Minivan",
  coupe: "Cupê",
  convertible: "Conversível",
  wagon: "Perua/Wagon",
  van: "Van",
  truck: "Caminhão",
}


export const dashboardFilterConfig: FilterConfig[] = [
  {
    key: "brand",
    label: "Marca",
    type: "select",
    placeholder: "Todas as marcas",
  },
  {
    key: "fuel",
    label: "Combustível",
    type: "select",
    placeholder: "Todos os combustíveis",
  },
  {
    key: "transmission",
    label: "Transmissão",
    type: "select",
    placeholder: "Todas as transmissões",
  },
  { 
    key: "color_main",   
    label: "Cor",         
    type: "select",        
    placeholder: "Todas as cores" 
  },
  {
    key: "year_model",
    label: "Ano",
    type: "year-range",
    placeholder: "Ano",
  },
  { 
    key: "mileage",      
    label: "Km",          
    type: "mileage-range", 
    placeholder: "Quilometragem" 
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
    key: "fuel",
    label: "Combustível",
    type: "multi-select",
    placeholder: "Combustível",
  },
  {
    key: "transmission",
    label: "Transmissão",
    type: "multi-select",
    placeholder: "Transmissão",
  },
  {
    key: "category",
    label: "Categoria",
    type: "multi-select",
    placeholder: "Categoria",
  },
  { 
    key: "color_main",   
    label: "Cor",         
    type: "multi-select",  
    placeholder: "Cor" 
  },
  {
    key: "year_model",
    label: "Ano",
    type: "year-range",
    placeholder: "Ano",
  },
  { 
    key: "mileage",      
    label: "Km",          
    type: "mileage-range", 
    placeholder: "Quilometragem" 
  },
  {
    key: "price",         
    label: "Preço",
    type: "price-range",
    placeholder: "Preço",
  },
]