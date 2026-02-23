import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Car Classifieds",
  description: "Encontre seu próximo carro",
  icons: {
    icon: "/favicon.png",      
    shortcut: "/favicon.png",   
    apple: "/favicon.png", 
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
        <Toaster position="bottom-left" richColors />
      </body>
    </html>
  )
}
