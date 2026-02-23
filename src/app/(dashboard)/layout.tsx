"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import Loading from "@/app/loading"

import DashboardMenu from "@/components/layout/DashboardMenu"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login")
      } else {
        setChecking(false)
      }
    })
  }, [router])

  if (checking) return <Loading />

  return (
    <div className="min-h-screen flex">
      <DashboardMenu />
      {children}
    </div>
  )
    
}