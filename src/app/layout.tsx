import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Car Classifieds",
  description: "Find your next car",
  icons: {
    icon: "/favicon.png",      
    shortcut: "/favicon.png",   
    apple: "/favicon.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body
        className="antialiased"
      >
        <Header />
        {children}
        <Footer />
        <Toaster position="bottom-left" richColors />
      </body>
    </html>
  );
}
