"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"

import { authSchema, AuthFormData } from "@/types/auth"
import { createClient } from "@/lib/supabase-client"

import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: AuthFormData) {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success("Conta criada com sucesso!")
    router.push("/login")
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
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor={field.name} className="font-normal">Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="seu@email.com"
                  aria-invalid={fieldState.invalid}
                  className="border-gray-300 focus-visible:ring-0 shadow-none"
                />
                {fieldState.invalid && (
                  <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor={field.name} className="font-normal">Senha</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  placeholder="••••••"
                  aria-invalid={fieldState.invalid}
                  className="border-gray-300 focus-visible:ring-0 shadow-none"
                />
                {fieldState.invalid && (
                  <FieldError className="text-red-500 text-xs">{fieldState.error?.message}</FieldError>
                )}
              </Field>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-orange hover:bg-darkorange text-white cursor-pointer"
          >
            {isLoading ? <LoaderLineIcon className="size-4 animate-spin" /> : "Criar Conta"}
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