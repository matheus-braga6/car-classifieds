import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BaseProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  required?: boolean
  className?: string
}

/* =========================
   FORM INPUT
========================= */
interface FormInputProps<T extends FieldValues> extends BaseProps<T> {
  placeholder?: string
  type?: "text" | "number" | "date"
  hint?: string
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  required = false,
  hint,
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="gap-1">
          <FieldLabel htmlFor={String(name)} className="font-normal gap-0">
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
            {hint && <span className="text-gray-400 text-xs ml-1">{hint}</span>}
          </FieldLabel>
          <Input
            {...field}
            id={String(name)}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            className="text-sm border-gray-300 focus-visible:ring-0 shadow-none"
            value={type === "number" ? (field.value ?? "") : (field.value ?? "")}
            onChange={(e) => {
              if (type === "number") {
                field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
              } else {
                field.onChange(e.target.value)
              }
            }}
          />
          {fieldState.invalid && (
            <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
          )}
        </Field>
      )}
    />
  )
}

/* =========================
   FORM PRICE INPUT
========================= */
function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

interface FormPriceInputProps<T extends FieldValues> extends BaseProps<T> {
  placeholder?: string
  hint?: string
}

export function FormPriceInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder = "R$ 0,00",
  hint,
}: FormPriceInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="gap-1">
          <FieldLabel htmlFor={String(name)} className="font-normal gap-0">
            {label}
            {hint && <span className="text-gray-400 text-xs ml-1">{hint}</span>}
          </FieldLabel>
          <Input
            id={String(name)}
            type="text"
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            className="text-sm border-gray-300 focus-visible:ring-0 shadow-none"
            value={field.value ? formatCurrency(field.value) : ""}
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, "")
              field.onChange(numbers ? Number(numbers) / 100 : undefined)
            }}
          />
          {fieldState.invalid && (
            <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
          )}
        </Field>
      )}
    />
  )
}

/* =========================
   FORM SELECT
========================= */
interface FormSelectProps<T extends FieldValues> extends BaseProps<T> {
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder = "Selecione",
  required = false
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="gap-1">
          <FieldLabel className="font-normal gap-0">
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
          </FieldLabel>
          <Select value={String(field.value ?? "")} onValueChange={field.onChange}>
            <SelectTrigger className="border-gray-300 focus-visible:ring-0 cursor-pointer">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="bg-white border-gray-300"
            >
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && (
            <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
          )}
        </Field>
      )}
    />
  )
}

/* =========================
   FORM SWITCH
========================= */
interface FormSwitchProps<T extends FieldValues> extends BaseProps<T> {
  row?: boolean
}

export function FormSwitch<T extends FieldValues>({
  name,
  control,
  label,
  row = false,
}: FormSwitchProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Field className={row ? "flex-row items-center justify-between gap-2" : "gap-1"}>
          <FieldLabel className="font-normal cursor-pointer gap-0">{label}</FieldLabel>
          <Switch
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
            className="cursor-pointer data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-orange"
          />
        </Field>
      )}
    />
  )
}


/* =========================
   FORM TEXTAREA
========================= */
interface FormTextareaProps<T extends FieldValues> extends BaseProps<T> {
  placeholder?: string
}

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
}: FormTextareaProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="gap-1">
          <FieldLabel htmlFor={String(name)} className="font-normal gap-0">{label}</FieldLabel>
          <Textarea
            {...field}
            id={String(name)}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            className="text-sm border-gray-300 focus-visible:ring-0 shadow-none min-h-28 resize-none"
          />
          {fieldState.invalid && (
            <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
          )}
        </Field>
      )}
    />
  )
}