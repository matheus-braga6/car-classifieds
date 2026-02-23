import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { quickLinks } from "@/data/footer"
import { SocialIconButton } from "../ui/social-icon-button"
import { MailFillIcon } from "@/assets/icons/MailFillIcon"
import { WhatsAppFillIcon } from "@/assets/icons/WhatsAppFillIcon"

export function Footer() {
  return (
    <footer className="w-full text-gray">
      <div className="w-full bg-snow">
        <Container>
          <div className="grid gap-7 lg:gap-12 py-16 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Car Classifieds</h3>
              <p className="text-gray text-sm max-w-sm">
                Encontre o carro perfeito com facilidade. Explore anúncios confiáveis, compare opções e conecte-se diretamente com os vendedores — tudo em um só lugar.
              </p>

              <div className="flex gap-3 mt-8">
                <SocialIconButton
                  href="carclassifiedsmail@gmail.com" 
                  ariaLabel="Email"
                  external={false}
                >
                  <MailFillIcon className="h-6 w-6 text-white" />
                </SocialIconButton>

                <SocialIconButton 
                  href="https://wa.me/+5544999546644" 
                  ariaLabel="WhatsApp"
                >
                  <WhatsAppFillIcon className="h-6 w-6 text-white" />
                </SocialIconButton>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Links Rápidos</h4>

              <ul className="space-y-2 text-sm text-gray">
                {quickLinks.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-400 py-6">
            <p className="text-center text-xs text-gray">
              © {new Date().getFullYear()} Car Classifieds. Todos direitos reservados.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
}
