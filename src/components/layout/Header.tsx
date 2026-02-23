"use client"

import { useEffect, useState } from "react"
import { Container } from "@/components/layout/Container"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"

import { createClient } from "@/lib/supabase-client"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
      setChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header className="absolute bg-snow top-0 left-0 w-full h-20 z-50">
      <Container>
        <div className="flex items-center gap-7 h-full">
          <Link href="/" className="flex w-max mr-auto">
            <Image
              src="/favicon.png"
              alt="Car Classifieds"
              width={80}
              height={80}
            />
          </Link>

          <NavigationMenu>
            <NavigationMenuList className="min-w-50 min-h-9 gap-6 justify-end relative">
              {checking ? (
                <Skeleton className="absolute inset-0 w-full h-full" />
              ) : isLoggedIn ? (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="hover:bg-orange hover:text-white transition-colors"
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              ) : (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="hover:bg-orange hover:text-white transition-colors"
                    >
                      <Link href="/register">Cadastre-se</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className="bg-orange px-5 hover:bg-darkorange transition-colors text-white"
                    >
                      <Link href="/login">Login</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </Container>
    </header>
  )
}