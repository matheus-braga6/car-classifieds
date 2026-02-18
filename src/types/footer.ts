export type FooterLink = {
  label: string
  href: string
  external?: boolean
}

export type FooterSection = {
  title?: string
  links: FooterLink[]
}