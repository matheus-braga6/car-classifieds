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

interface MenuContentProps {
  onClose: () => void
}

function MenuContent({ onClose }: MenuContentProps) {
  return (
    <div className="flex flex-col gap-5 p-6">
      <Link href="/" className="flex w-max mr-auto">
        <Image
          src="/favicon.png"
          alt="Car Classifieds"
          width={80}
          height={80}
        />
      </Link>

      <Link href="/dashboard" onClick={onClose}>
        <Button
          variant="ghost"
          className="w-full hover:bg-orange text-black hover:text-white font-normal cursor-pointer"
        >
          Meus Carros
        </Button>
      </Link>

      <Link href="/dashboard/cars/new" onClick={onClose}>
        <Button
          variant="ghost"
          className="w-full hover:bg-orange text-black hover:text-white font-normal cursor-pointer"
        >
          Adicionar Carro
        </Button>
      </Link>

      <LogoutButton variant="ghost" />
    </div>
  )
}

export default function DashboardMenu () {
  const [open, setOpen] = useState(false)

  return (
    <>
      <aside className="hidden md:flex w-60 min-h-screen bg-snow">
        <MenuContent onClose={() => {}}/>
      </aside>

      <div className="md:hidden fixed top-9 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="bg-orange p-2 rounded-full">
              <MenuLineIcon className="size-6 text-snow" />
            </SheetTrigger>

            <SheetContent 
              side="left" 
              className="bg-white border-none"
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