"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Resolver } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

import { registerSchema, RegisterFormData } from "@/types/auth"
import { createClient } from "@/lib/supabase-client"
import { maskCPF, maskCNPJ, maskPhone, maskCEP, unmask } from "@/lib/masks"

import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import { EyeLineIcon } from "@/assets/icons/EyeLineIcon"
import { EyeOffLineIcon } from "@/assets/icons/EyeOffLineIcon"

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider border-b border-gray-200 pb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}

function FormRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  )
}

function usePasswordVisibility() {
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible((prev) => !prev)
  return { visible, toggle }
}

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isCNPJ, setIsCNPJ] = useState(false)
  const [isFetchingCEP, setIsFetchingCEP] = useState(false)
  const password = usePasswordVisibility()
  const confirmPassword = usePasswordVisibility()

  const { control, handleSubmit, setValue, setError } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema) as Resolver<RegisterFormData>,
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      name: "",
      document_type: "cpf",
      document: "",
      phone: "",
      company_name: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  })

  // Fetch address from ViaCEP when CEP is complete
  async function handleCEPBlur(cep: string) {
    const numbers = unmask(cep)
    if (numbers.length !== 8) return

    setIsFetchingCEP(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${numbers}/json/`)
      const data = await res.json()

      if (data.erro) {
        setError("cep", { message: "CEP não encontrado" })
        return
      }

      setValue("street", data.logradouro ?? "")
      setValue("neighborhood", data.bairro ?? "")
      setValue("city", data.localidade ?? "")
      setValue("state", data.uf ?? "")
    } catch {
      setError("cep", { message: "Erro ao buscar CEP" })
    } finally {
      setIsFetchingCEP(false)
    }
  }

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true)
    const supabase = createClient()

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login?confirmed=true`
      }
    })

    if (authError || !authData.user) {
      toast.error(authError?.message ?? "Erro ao criar conta")
      setIsLoading(false)
      return
    }

    // Insert profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      name: data.name,
      document: unmask(data.document),
      document_type: data.document_type,
      phone: unmask(data.phone),
      company_name: data.company_name || null,
      cep: unmask(data.cep),
      street: data.street,
      number: data.number,
      complement: data.complement || null,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
    })

    if (profileError) {
      toast.error("Erro ao salvar dados do perfil")
      setIsLoading(false)
      return
    }

    toast.success("Conta criada com sucesso!")
    router.push("/confirm-email")
  }

  return (
    <Container>
      <section className="mt-20 py-10 min-h-[calc(100vh-80px)] flex flex-col">
        <h1 className="text-3xl text-center text-gray font-bold mb-8">
          CADASTRE-SE
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto p-6 max-w-3xl w-full border border-gray-300 rounded-2xl flex flex-col gap-4"
        >
          {/* ── ACESSO ── */}
          <FormSection title="Acesso">
            <FormRow>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Email <span className="text-red-400">*</span></FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="seu@email.com"
                      className="border-gray-300 focus-visible:ring-0 shadow-none"
                    />
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FormRow>

            <FormRow>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Senha <span className="text-red-400">*</span></FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type={password.visible ? "text" : "password"}
                        placeholder="••••••"
                        className="border-gray-300 focus-visible:ring-0 shadow-none pr-8"
                      />
                      <button
                        type="button"
                        onClick={password.toggle}
                        className="size-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        {password.visible
                          ? <EyeOffLineIcon className="size-4" />
                          : <EyeLineIcon className="size-4" />
                        }
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirm_password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Confirmar senha <span className="text-red-400">*</span></FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type={confirmPassword.visible ? "text" : "password"}
                        placeholder="••••••"
                        className="border-gray-300 focus-visible:ring-0 shadow-none pr-8"
                      />
                      <button
                        type="button"
                        onClick={confirmPassword.toggle}
                        className="size-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        {confirmPassword.visible
                          ? <EyeOffLineIcon className="size-4" />
                          : <EyeLineIcon className="size-4" />
                        }
                      </button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FormRow>
          </FormSection>

          {/* ── DADOS PESSOAIS ── */}
          <FormSection title="Dados pessoais">
            {/* Radio CPF/CNPJ */}
            <Controller
              name="document_type"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`
                      flex flex-col gap-0.5 p-3 rounded-lg border cursor-pointer transition-colors
                      ${!isCNPJ
                        ? "border-orange bg-orange/5"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      checked={!isCNPJ}
                      onChange={() => {
                        setIsCNPJ(false)
                        field.onChange("cpf")
                        setValue("document", "")
                      }}
                    />
                    <span className="text-sm font-medium">Pessoa Física</span>
                    <span className="text-xs text-gray-400">Cadastro individual (CPF)</span>
                  </label>

                  <label
                    className={`
                      flex flex-col gap-0.5 p-3 rounded-lg border cursor-pointer transition-colors
                      ${isCNPJ
                        ? "border-orange bg-orange/5"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      checked={isCNPJ}
                      onChange={() => {
                        setIsCNPJ(true)
                        field.onChange("cnpj")
                        setValue("document", "")
                      }}
                    />
                    <span className="text-sm font-medium">Pessoa Jurídica</span>
                    <span className="text-xs text-gray-400">Empresa, MEI ou similar (CNPJ)</span>
                  </label>
                </div>
              )}
            />

            <FormRow>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Nome completo <span className="text-red-400">*</span></FieldLabel>
                    <Input
                      {...field}
                      placeholder="Seu nome"
                      className="border-gray-300 focus-visible:ring-0 shadow-none"
                    />
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="document"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">
                      {isCNPJ ? "CNPJ" : "CPF"} <span className="text-red-400">*</span>
                    </FieldLabel>
                    <Input
                      value={field.value}
                      onChange={(e) => {
                        const masked = isCNPJ
                          ? maskCNPJ(e.target.value)
                          : maskCPF(e.target.value)
                        field.onChange(masked)
                      }}
                      placeholder={isCNPJ ? "00.000.000/0000-00" : "000.000.000-00"}
                      className="border-gray-300 focus-visible:ring-0 shadow-none"
                    />
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FormRow>

            <FormRow>
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Telefone <span className="text-red-400">*</span></FieldLabel>
                    <Input
                      value={field.value}
                      onChange={(e) => field.onChange(maskPhone(e.target.value))}
                      placeholder="(00) 00000-0000"
                      className="border-gray-300 focus-visible:ring-0 shadow-none"
                    />
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              {isCNPJ && (
                <Controller
                  name="company_name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="gap-1">
                      <FieldLabel className="font-normal">Razão social</FieldLabel>
                      <Input
                        {...field}
                        placeholder="Nome da empresa"
                        className="border-gray-300 focus-visible:ring-0 shadow-none"
                      />
                      {fieldState.invalid && (
                        <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              )}
            </FormRow>
          </FormSection>

          {/* ── ENDEREÇO ── */}
          <FormSection title="Endereço">
            <FormRow>
              <Controller
                name="cep"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">
                      CEP <span className="text-red-400">*</span>
                      {isFetchingCEP && <span className="text-xs text-gray-400 ml-1">Buscando...</span>}
                    </FieldLabel>
                    <Input
                      value={field.value}
                      onChange={(e) => field.onChange(maskCEP(e.target.value))}
                      onBlur={(e) => handleCEPBlur(e.target.value)}
                      placeholder="00000-000"
                      className="border-gray-300 focus-visible:ring-0 shadow-none"
                    />
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="street"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Rua <span className="text-red-400">*</span></FieldLabel>
                    <Input
                      {...field}
                      placeholder="Preenchido automaticamente"
                      className="border-gray-300 focus-visible:ring-0 shadow-none"
                    />
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FormRow>

            <FormRow>
              <Controller
                name="number"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Número <span className="text-red-400">*</span></FieldLabel>
                    <Input
                      {...field}
                      placeholder="Ex: 123"
                      className="border-gray-300 focus-visible:ring-0 shadow-none"
                    />
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="complement"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Complemento</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Apto, sala, bloco..."
                      className="border-gray-300 focus-visible:ring-0 shadow-none"
                    />
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FormRow>

            <FormRow>
              <Controller
                name="neighborhood"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Bairro <span className="text-red-400">*</span></FieldLabel>
                    <Input
                      {...field}
                      placeholder="Preenchido automaticamente"
                      className="border-gray-300 focus-visible:ring-0 shadow-none"
                    />
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="city"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Cidade <span className="text-red-400">*</span></FieldLabel>
                    <Input
                      {...field}
                      placeholder="Preenchido automaticamente"
                      className="border-gray-300 focus-visible:ring-0 shadow-none"
                    />
                    {fieldState.invalid && (
                      <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FormRow>

            <Controller
              name="state"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1 max-w-[calc(50%-8px)]">
                  <FieldLabel className="font-normal">Estado <span className="text-red-400">*</span></FieldLabel>
                  <Input
                    {...field}
                    placeholder="Preenchido automaticamente"
                    className="border-gray-300 focus-visible:ring-0 shadow-none"
                  />
                  {fieldState.invalid && (
                    <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FormSection>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-orange hover:bg-darkorange text-white cursor-pointer"
          >
            {isLoading
              ? <LoaderLineIcon className="size-4 animate-spin" />
              : "Criar Conta"
            }
          </Button>

          <p className="text-sm text-center text-gray-500">
            Já possui uma conta?{" "}
            <Link href="/login" className="text-orange hover:underline">
              Login
            </Link>
          </p>
        </form>
      </section>
    </Container>
  )
}