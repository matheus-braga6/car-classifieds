"use client"

import { useState } from "react"
import { MenuLineIcon } from "@/assets/icons/MenuLineIcon"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/auth/LogoutButton"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface MenuContentProps {
  onClose: () => void
}

const menuLinks = [
  { href: "/dashboard",          label: "Meus Carros" },
  { href: "/dashboard/cars/new", label: "Adicionar Carro" },
  { href: "/dashboard/profile",  label: "Meu Perfil" },
]

function MenuContent({ onClose }: MenuContentProps) {
  const pathname = usePathname()

  return (
    <div className="w-full flex flex-col gap-5 lg:p-4">
      <Link href="/" className="flex w-max mx-auto">
        <Image
          src="/logo.png"
          alt="Stox Favicon"
          width={170}
          height={56}
        />
      </Link>

      {menuLinks.map((link) => {
        const isActive = pathname === link.href

        return (
          <Link key={link.href} href={link.href} onClick={onClose}>
            <Button
              variant="ghost"
              className={`
                w-max lg:w-full h-fit lg:h-9 p-2
                cursor-pointer
                ${isActive
                  ? "bg-orange text-white hover:bg-orange hover:text-white"
                  : "text-black hover:bg-orange hover:text-white"
                }
              `}
            >
              {link.label}
            </Button>
          </Link>
        )
      })}

      <LogoutButton variant="ghost" />
    </div>
  )
}

export default function DashboardMenu () {
  const [open, setOpen] = useState(false)

  return (
    <>
      <aside className="hidden lg:flex w-60 min-w-60 min-h-screen bg-snow">
        <MenuContent onClose={() => {}}/>
      </aside>

      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="bg-orange p-2 rounded-full">
              <MenuLineIcon className="size-5 text-snow" />
            </SheetTrigger>

            <SheetContent 
              side="left" 
              className="w-80 min-w-80 p-4 bg-white border-none"
            >
              <VisuallyHidden>
                <SheetTitle>Menu</SheetTitle>
              </VisuallyHidden>
              <MenuContent onClose={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
      </div>
    </>
  )
}