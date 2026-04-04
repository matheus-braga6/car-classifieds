"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import { EyeLineIcon } from "@/assets/icons/EyeLineIcon"
import { EyeOffLineIcon } from "@/assets/icons/EyeOffLineIcon"

import { changePasswordSchema, ChangePasswordFormData } from "@/types/auth"
import { createClient } from "@/lib/supabase-client"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Resolver } from "react-hook-form"

function usePasswordVisibility() {
  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible((prev) => !prev)
  return { visible, toggle }
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const password = usePasswordVisibility()
  const confirmPassword = usePasswordVisibility()

  const { control, handleSubmit } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema) as Resolver<ChangePasswordFormData>,
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  })

  async function onSubmit(data: ChangePasswordFormData) {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (error) {
      toast.error("Erro ao redefinir senha. Tente novamente.")
      setIsLoading(false)
      return
    }

    toast.success("Senha redefinida com sucesso!")
    router.push("/login")
  }

  return (
    <Container>
      <section className="mt-20 py-10 min-h-[calc(100vh-80px)] flex flex-col">
        <h1 className="text-3xl text-center text-gray font-bold mb-8">
          NOVA SENHA
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto p-6 max-w-3xl w-full border border-gray-300 rounded-2xl flex flex-col gap-4"
        >
          <p className="text-sm text-gray-500">
            Digite sua nova senha abaixo.
          </p>

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="gap-1">
                <FieldLabel htmlFor={field.name} className="font-normal">Nova senha</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id={field.name}
                    type={password.visible ? "text" : "password"}
                    placeholder="••••••"
                    aria-invalid={fieldState.invalid}
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
                <FieldLabel htmlFor={field.name} className="font-normal">Confirmar nova senha</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id={field.name}
                    type={confirmPassword.visible ? "text" : "password"}
                    placeholder="••••••"
                    aria-invalid={fieldState.invalid}
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-orange hover:bg-darkorange text-white cursor-pointer"
          >
            {isLoading ? <LoaderLineIcon className="size-4 animate-spin" /> : "Redefinir senha"}
          </Button>
        </form>
      </section>
    </Container>
  )
}