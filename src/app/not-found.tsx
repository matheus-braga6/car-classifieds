import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-4">
      <h1 className="text-8xl font-bold text-orange">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700">Página não encontrada</h2>
      <p className="text-gray-400 max-w-sm">
        O conteúdo que você está procurando não existe ou foi removido.
      </p>
      <Link href="/">
        <Button className="bg-orange hover:bg-darkorange text-white cursor-pointer">
          Voltar para a home
        </Button>
      </Link>
    </div>
  )
}