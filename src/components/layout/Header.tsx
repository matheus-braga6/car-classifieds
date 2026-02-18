"use client"

import { Container } from "@/components/layout/Container"
import Link from "next/link"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export function Header() {
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
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink 
                  asChild 
                  className="hover:bg-gray-300 transition-colors"
                >
                  <Link href="/">All Cars</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink 
                  asChild 
                  className="bg-orange hover:bg-darkorange transition-colors text-white"
                >
                  <Link href="/cars/new">Post Car</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </Container>
    </header>
  )
}