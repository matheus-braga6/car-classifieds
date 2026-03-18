declare module "merrygo-carousel" {
  export default class MerryGo {
    constructor(options: {
      gallery: HTMLElement
      galleryInner: HTMLElement
      prevBtn?: HTMLElement | null
      nextBtn?: HTMLElement | null
      pagination?: HTMLElement | null
      thumbs?: HTMLInputElement[]
      gap?: number
      slidesVisible?: number
      slidesToScroll?: number
      infinityLoop?: boolean
      autoplay?: number | boolean
      enableDrag?: boolean
      orientation?: "horizontal" | "vertical"
      breakpoints?: Record<number, {
        slidesVisible?: number
        slidesToScroll?: number
        gap?: number
        infinityLoop?: boolean
        autoplay?: number | boolean
      }>
    })
    goToSlide(index: number): void
    nextSlide(): void
    prevSlide(): void
    refresh(): void
    destroy(): void
    startAutoplay(): void
    stopAutoplay(): void
  }
}