export {}

declare global {
  interface Window {
    activeCarousels: InstanceType<typeof import("merrygo-carousel").default>[]
  }
}