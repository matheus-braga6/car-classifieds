"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Link from "next/link"
import { z } from "zod"

import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import { createClient } from "@/lib/supabase-client"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"

const forgotPasswordSchema = z.object({
  email: z.string().check(z.email("Email inválido")),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { control, handleSubmit } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(data: ForgotPasswordFormData) {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      toast.error("Erro ao enviar email. Tente novamente.")
      setIsLoading(false)
      return
    }

    setSent(true)
    setIsLoading(false)
  }

  if (sent) {
    return (
      <Container>
        <section className="mt-20 py-10 min-h-[calc(100vh-80px)] flex flex-col">
          <h1 className="text-3xl text-center text-gray font-bold mb-8">
            EMAIL ENVIADO!
          </h1>

          <div className="mx-auto p-6 max-w-3xl w-full border border-gray-300 rounded-2xl flex flex-col gap-4">
            <p className="text-sm text-gray-500">
              Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada e a pasta de spam.
            </p>

            <p className="text-xs text-gray-400">O link expira em 1 hora.</p>
            
            <Link href="/login" className="w-full">
              <Button className="w-full h-10 bg-orange hover:bg-darkorange text-white cursor-pointer">
                Voltar para o login
              </Button>
            </Link>
          </div>
        </section>
      </Container>
    )
  }

  return (
    <Container>
      <section className="mt-20 py-10 min-h-[calc(100vh-80px)] flex flex-col">
        <h1 className="text-3xl text-center text-gray font-bold mb-8">
          RECUPERAR SENHA
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto p-6 max-w-3xl w-full border border-gray-300 rounded-2xl flex flex-col gap-4"
        >
          <p className="text-sm text-gray-500">
            Digite seu email cadastrado e enviaremos um link para redefinir sua senha.
          </p>

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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-orange hover:bg-darkorange text-white cursor-pointer"
          >
            {isLoading ? <LoaderLineIcon className="size-4 animate-spin" /> : "Enviar link"}
          </Button>

          <p className="text-sm text-center text-gray-500">
            Lembrou a senha?{" "}
            <Link href="/login" className="text-orange hover:underline">
              Voltar para o login
            </Link>
          </p>
        </form>
      </section>
    </Container>
  )
}