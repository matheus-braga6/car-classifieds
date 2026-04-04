import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { Button } from "@/components/ui/button"

export default function ConfirmEmailPage() {
  return (
    <Container>
      <section className="mt-20 py-10 min-h-[calc(100vh-80px)] flex flex-col items-center">
        <h1 className="text-3xl text-center text-gray font-bold mb-8">
          CONFIRME SEU E-MAIL
        </h1>
        
        <div className="mx-auto p-6 max-w-3xl w-full border border-gray-300 rounded-2xl flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-500">
              Enviamos um link de confirmação para o seu email. 
              Acesse sua caixa de entrada e clique no link para ativar sua conta.
            </p>
          </div>

          <p className="text-xs text-gray-400">
            Não recebeu? Verifique a pasta de spam.
          </p>

          <Link href="/login" className="w-full">
            <Button className="w-full h-10 bg-orange hover:bg-darkorange text-white cursor-pointer">
              Ir para o login
            </Button>
          </Link>
        </div>
      </section>
    </Container>
  )
}