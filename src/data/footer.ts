import type { FooterSection } from "@/types/footer"

export const quickLinks: FooterSection = {
  title: "Quick Links",
  links: [
    { label: "All Cars", href: "/" },
    { label: "Post Car", href: "/cars/new"}
  ],
}