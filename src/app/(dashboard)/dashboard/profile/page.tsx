"use client"

import { useEffect, useState, useMemo } from "react"
import { useForm, Controller, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Image from "next/image"

import { editProfileSchema, EditProfileFormData, changePasswordSchema, ChangePasswordFormData } from "@/types/auth"
import { createClient } from "@/lib/supabase-client"
import { maskCPF, maskCNPJ, maskPhone, maskCEP, unmask } from "@/lib/masks"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import { UserLineIcon } from "@/assets/icons/UserLineIcon"
import { EyeLineIcon } from "@/assets/icons/EyeLineIcon"
import { EyeOffLineIcon } from "@/assets/icons/EyeOffLineIcon"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function ProfilePage() {
  const supabase = useMemo(() => createClient(), [])
  const newPassword = usePasswordVisibility()
  const confirmNewPassword = usePasswordVisibility()

  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isAvatarLoading, setIsAvatarLoading] = useState(false)
  const [isCNPJ, setIsCNPJ] = useState(false)
  const [isFetchingCEP, setIsFetchingCEP] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  // Profile form
  const { control, handleSubmit, setValue, setError, reset } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema) as Resolver<EditProfileFormData>,
    defaultValues: {
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

  // Password form
  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema) as Resolver<ChangePasswordFormData>,
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  })

  // Load profile on mount
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!profile) {
        setIsLoadingProfile(false)
        return
      }

      const isCnpj = profile.document_type === "cnpj"
      setIsCNPJ(isCnpj)
      setAvatarUrl(profile.avatar_url)

      // Format fields for display
      const formatDocument = isCnpj
        ? maskCNPJ(profile.document)
        : maskCPF(profile.document)

      reset({
        name: profile.name ?? "",
        document_type: profile.document_type ?? "cpf",
        document: formatDocument,
        phone: maskPhone(profile.phone ?? ""),
        company_name: profile.company_name ?? "",
        cep: maskCEP(profile.cep ?? ""),
        street: profile.street ?? "",
        number: profile.number ?? "",
        complement: profile.complement ?? "",
        neighborhood: profile.neighborhood ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
      })

      setIsLoadingProfile(false)
    }

    loadProfile()
  }, [supabase, reset])

  // Fetch address from ViaCEP
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

  // Upload avatar
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return

    setIsUploadingAvatar(true)

    const ext = file.name.split(".").pop()
    const path = `${userId}/avatar.${ext}`

    // Delete previous avatar if exists
    if (avatarUrl) {
      const previousPath = avatarUrl.split("/avatars/")[1]?.split("?")[0]
      if (previousPath) {
        await supabase.storage.from("avatars").remove([previousPath])
      }
    }

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true })

    if (uploadError) {
      toast.error("Erro ao fazer upload da foto")
      setIsUploadingAvatar(false)
      return
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path)
    const url = `${data.publicUrl}?t=${Date.now()}` // cache bust

    await supabase.from("profiles").update({ avatar_url: url }).eq("id", userId)

    setAvatarUrl(url)
    setIsAvatarLoading(true)
    toast.success("Foto atualizada!")
    setIsUploadingAvatar(false)
  }

  // Save profile
  async function onSubmitProfile(data: EditProfileFormData) {
    if (!userId) return
    setIsSavingProfile(true)

    const { error } = await supabase.from("profiles").update({
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
    }).eq("id", userId)

    if (error) {
      toast.error("Erro ao salvar perfil")
    } else {
      toast.success("Perfil atualizado!")
    }

    setIsSavingProfile(false)
  }

  // Change password
  async function onSubmitPassword(data: ChangePasswordFormData) {
    setIsSavingPassword(true)

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (error) {
      toast.error("Erro ao alterar senha")
    } else {
      toast.success("Senha alterada com sucesso!")
      resetPassword()
    }

    setIsSavingPassword(false)
  }

  if (isLoadingProfile) {
    return (
      <section className="w-full p-4 lg:py-10 flex items-center justify-center min-h-screen">
        <LoaderLineIcon className="size-10 animate-spin text-orange" />
      </section>
    )
  }

  return (
    <section className="w-full p-4 lg:py-10 flex flex-col items-center gap-5">
      <h1 className="w-full max-w-3xl text-3xl text-gray font-bold">
        MEU PERFIL
      </h1>

      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* ── FOTO DE PERFIL ── */}
        <FormSection title="Foto de perfil">
          <div className="flex items-center gap-6">
            <div className="relative size-24 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
  
              {(isAvatarLoading || isUploadingAvatar) && (
                <Skeleton className="absolute inset-0 w-full h-full z-10" />
              )}

              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Foto de perfil"
                  fill
                  className="object-cover"
                  onLoad={() => setIsAvatarLoading(false)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserLineIcon className="size-10 text-gray-300" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="avatar-upload"
                className="
                  w-max px-4 h-9 rounded-md
                  bg-orange hover:bg-darkorange
                  text-white text-sm font-medium
                  flex items-center justify-center
                  cursor-pointer transition-colors
                "
              >
                {isUploadingAvatar
                  ? <LoaderLineIcon className="size-4 animate-spin" />
                  : "Trocar foto"
                }
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploadingAvatar}
              />
              <p className="text-xs text-gray-400">JPG, PNG ou WEBP. Máximo 2MB.</p>
            </div>
          </div>
        </FormSection>

        {/* ── DADOS PESSOAIS ── */}
        <form onSubmit={handleSubmit(onSubmitProfile)} className="flex flex-col gap-8">
          <FormSection title="Dados pessoais">
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
                        const masked = isCNPJ ? maskCNPJ(e.target.value) : maskCPF(e.target.value)
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
                <Field data-invalid={fieldState.invalid} className="gap-1 w-full sm:max-w-[calc(50%-8px)]">
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
            disabled={isSavingProfile}
            className="w-full h-10 bg-orange hover:bg-darkorange text-white cursor-pointer"
          >
            {isSavingProfile
              ? <LoaderLineIcon className="size-4 animate-spin" />
              : "Salvar alterações"
            }
          </Button>
        </form>

        {/* ── ALTERAR SENHA ── */}
        <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="flex flex-col gap-4">
          <FormSection title="Alterar senha">
            <FormRow>
              <Controller
                name="password"
                control={passwordControl}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Nova senha <span className="text-red-400">*</span></FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type={newPassword.visible ? "text" : "password"}
                        placeholder="••••••"
                        className="border-gray-300 focus-visible:ring-0 shadow-none pr-8"
                      />
                      <button
                        type="button"
                        onClick={newPassword.toggle}
                        className="size-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        {newPassword.visible
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
                control={passwordControl}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel className="font-normal">Confirmar nova senha <span className="text-red-400">*</span></FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type={confirmNewPassword.visible ? "text" : "password"}
                        placeholder="••••••"
                        className="border-gray-300 focus-visible:ring-0 shadow-none"
                      />
                      <button
                        type="button"
                        onClick={confirmNewPassword.toggle}
                        className="size-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        {confirmNewPassword.visible
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

          <Button
            type="submit"
            disabled={isSavingPassword}
            className="w-full h-10 bg-orange hover:bg-darkorange text-white cursor-pointer"
          >
            {isSavingPassword
              ? <LoaderLineIcon className="size-4 animate-spin" />
              : "Alterar senha"
            }
          </Button>
        </form>
      </div>
    </section>
  )
}