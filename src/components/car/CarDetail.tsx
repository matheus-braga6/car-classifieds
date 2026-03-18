import { BackButton } from "@/components/ui/back-button"
import { fuelOptions, transmissionOptions, categoryOptions } from "@/types/car"
import { CarImageSlider } from "@/components/car/CarImageSlider"

interface Car {
  id: string
  title: string
  brand: string
  model: string
  year_fab: number
  year_model: number
  category: string | null
  color_main: string
  color_secondary: string | null
  color_interior: string | null
  mileage: number
  fuel: string | null
  transmission: string | null
  price: number | null
  plate: string | null
  renavam: string | null
  chassis: string | null
  doors: number | null
  seats: number | null
  engine: string | null
  power: string | null
  acceleration: string | null
  autonomy: number | null
  airbags: number | null
  warranty_until: string | null
  brakes: string | null
  headlights: string | null
  wheels: string | null
  sunroof: string | null
  description: string | null
  armored: boolean | null
  convertible: boolean | null
  autopilot: boolean | null
  bluetooth: boolean | null
  parking_sensor: boolean | null
  camera: boolean | null
  rain_sensor: boolean | null
  multimedia: boolean | null
  image_urls: string[]
}

function resolveLabel(value: string | null | undefined, options: { value: string; label: string }[]) {
  if (!value) return null
  return options.find((o) => o.value === value)?.label ?? value
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR")
}

function maskSensitive(value: string | null | undefined) {
  if (!value) return null
  return value.slice(0, 3) + "•".repeat(Math.max(0, value.length - 3))
}

function DetailItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  )
}

function FeatureItem({ label, value }: { label: string; value: boolean | null | undefined }) {
  if (!value) return null
  return (
    <span className="px-3 py-1 rounded-full bg-snow text-sm text-gray-700 border border-gray-200">
      {label}
    </span>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider border-b border-gray-200 pb-2">
        {title}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  )
}

export function CarDetail({ car }: { car: Car }) {
  const features = [
    { label: "Blindado",                 value: car.armored },
    { label: "Conversível",              value: car.convertible },
    { label: "Piloto automático",        value: car.autopilot },
    { label: "Bluetooth",                value: car.bluetooth },
    { label: "Sensor de estacionamento", value: car.parking_sensor },
    { label: "Câmera de ré",             value: car.camera },
    { label: "Sensor de chuva",          value: car.rain_sensor },
    { label: "Central multimídia",       value: car.multimedia },
  ]

  const activeFeatures = features.filter((f) => f.value)

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">

      <BackButton />

      {/* ── TÍTULO E PREÇO ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{car.title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {car.model} • {car.year_fab}/{car.year_model}
          </p>
        </div>
        <p className="text-3xl font-bold text-orange">
          {car.price ? formatCurrency(car.price) : "Sob consulta"}
        </p>
      </div>

      {/* ── IMAGENS ── */}
      {car.image_urls?.length > 0 && (
        <CarImageSlider images={car.image_urls} title={car.title} />
      )}

      {/* ── IDENTIFICAÇÃO ── */}
      <Section title="Identificação">
        <DetailItem label="Marca" value={car.brand} />
        <DetailItem label="Modelo" value={car.model} />
        <DetailItem label="Ano fabricação" value={car.year_fab} />
        <DetailItem label="Ano modelo" value={car.year_model} />
        <DetailItem label="Categoria" value={resolveLabel(car.category, categoryOptions)} />
        <DetailItem label="Quilometragem" value={car.mileage ? `${new Intl.NumberFormat("pt-BR").format(car.mileage)} km` : null} />
        <DetailItem label="Placa" value={maskSensitive(car.plate)} />
        <DetailItem label="Chassi" value={maskSensitive(car.chassis)} />
        <DetailItem label="Renavam" value={maskSensitive(car.renavam)} />
      </Section>

      {/* ── MECÂNICA ── */}
      <Section title="Mecânica">
        <DetailItem label="Combustível" value={resolveLabel(car.fuel, fuelOptions)} />
        <DetailItem label="Transmissão" value={resolveLabel(car.transmission, transmissionOptions)} />
        <DetailItem label="Motor" value={car.engine} />
        <DetailItem label="Potência" value={car.power} />
        <DetailItem label="Aceleração" value={car.acceleration} />
        <DetailItem label="Autonomia" value={car.autonomy ? `${car.autonomy} km/l` : null} />
      </Section>

      {/* ── CARACTERÍSTICAS ── */}
      <Section title="Características">
        <DetailItem label="Cor predominante" value={car.color_main} />
        <DetailItem label="Cor secundária" value={car.color_secondary} />
        <DetailItem label="Cor interna" value={car.color_interior} />
        <DetailItem label="Portas" value={car.doors} />
        <DetailItem label="Bancos" value={car.seats} />
        <DetailItem label="Airbags" value={car.airbags} />
        <DetailItem label="Freios" value={car.brakes} />
        <DetailItem label="Faróis" value={car.headlights} />
        <DetailItem label="Rodas" value={car.wheels} />
        <DetailItem label="Teto solar" value={car.sunroof} />
        <DetailItem label="Garantia até" value={car.warranty_until ? formatDate(car.warranty_until) : null} />
      </Section>

      {/* ── OPCIONAIS ── */}
      {activeFeatures.length > 0 && (
        <Section title="Opcionais">
          <div className="col-span-2 sm:col-span-3 md:col-span-4 flex flex-wrap gap-2">
            {activeFeatures.map(({ label }) => (
              <FeatureItem key={label} label={label} value={true} />
            ))}
          </div>
        </Section>
      )}

      {/* ── DESCRIÇÃO ── */}
      {car.description && (
        <Section title="Descrição">
          <p className="col-span-2 sm:col-span-3 md:col-span-4 text-sm text-gray-700 leading-relaxed">
            {car.description}
          </p>
        </Section>
      )}

    </div>
  )
}