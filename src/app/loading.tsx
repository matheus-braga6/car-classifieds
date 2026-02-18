import { Container } from "@/components/layout/Container"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"

export default function Loading() {
  return (
    <Container>
      <section className="mt-20 py-10 min-h-[calc(100vh-80px)] flex items-center justify-center">
        <LoaderLineIcon className="size-10 animate-spin text-orange" />
      </section>
    </Container>
  )
}
