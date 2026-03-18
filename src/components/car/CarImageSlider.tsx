"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import MerryGo from "merrygo-carousel"
import { ArrowLeftIcon } from "@/assets/icons/ArrowLeftIcon"
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon"

interface Props {
  images: string[]
  title: string
}

export function CarImageSlider({ images, title }: Props) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const paginationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!galleryRef.current || !innerRef.current) return

    const carousel = new MerryGo({
      gallery: galleryRef.current,
      galleryInner: innerRef.current,
      prevBtn: prevRef.current ?? undefined,
      nextBtn: nextRef.current ?? undefined,
      pagination: paginationRef.current ?? undefined,
      gap: 24
    })

    window.activeCarousels = window.activeCarousels || []
    window.activeCarousels.push(carousel)

    return () => {
      carousel.destroy()
      window.activeCarousels = window.activeCarousels?.filter((c) => c !== carousel) ?? []
    }
  }, [images])

  if (!images || images.length === 0) return null

  return (
    <div className="relative w-full overflow-hidden">

      {/* Gallery */}
      <div ref={galleryRef} className="w-full overflow-hidden select-none">
        <div
          ref={innerRef}
          className="flex transition-transform gap-6 duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-transform"
        >
          {images.map((url, index) => (
            <div key={url} className="shrink-0 w-full box-border">
              <div className="relative w-full aspect-video">
                <Image
                  src={url}
                  alt={`${title} - foto ${index + 1}`}
                  fill
                  className="object-cover rounded-2xl"
                  sizes="100vw"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow prev */}
      <button
        ref={prevRef}
        aria-label="Foto anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-6 md:w-10 h-6 md:h-10 rounded-full bg-orange shadow flex items-center justify-center cursor-pointer hover:bg-darkorange transition-colors"
      >
        <ArrowLeftIcon className="size-6 text-white" />
      </button>

      {/* Arrow next */}
      <button
        ref={nextRef}
        aria-label="Próxima foto"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-6 md:w-10 h-6 md:h-10 rounded-full bg-orange shadow flex items-center justify-center cursor-pointer hover:bg-darkorange transition-colors"
      >
        <ArrowRightIcon className="size-6 text-white" />
      </button>

      {/* Pagination */}
      <div
        ref={paginationRef}
        className="car-slider__pagination flex items-center justify-center gap-1.5 py-3 bg-white"
      />

    </div>
  )
}
