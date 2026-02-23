"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"

interface Props {
  variant?: "outline" | "ghost"
}

export function LogoutButton({ variant = "outline" }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    router.push("/")
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      variant={variant}
      className={
        `cursor-pointer 
        ${variant === "ghost" ? "text-red-500 hover:text-white hover:bg-red-500" : ""}`
      }
    >
      {isLoading ? <LoaderLineIcon className="size-4 animate-spin" /> : "Sair da Conta"}
    </Button>
  )
}