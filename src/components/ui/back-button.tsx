"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeftLineIcon } from "@/assets/icons/ArrowLeftLineIcon"

export function BackButton() {
  const router = useRouter()
  return (
    <Button
      onClick={() => router.back()}
      className="
        w-max h-fit p-0 
        text-orange text-sm
        border-b border-b-transparent hover:border-b-orange hover:border-b rounded-none
        cursor-pointer
      "
    >
      <ArrowLeftLineIcon className="size-4" />
      Voltar
    </Button>
  )
}