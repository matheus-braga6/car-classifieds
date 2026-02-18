import type { ReactNode } from "react"

interface SocialIconButtonProps {
  href: string
  ariaLabel: string
  children: ReactNode
  external?: boolean
}

export function SocialIconButton({
  href,
  ariaLabel,
  children,
  external = true,
}: SocialIconButtonProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      className="
        w-12 h-12
        flex items-center justify-center
        bg-orange
        hover:bg-darkorange
        transition-colors
        rounded-md
      "
    >
      {children}
    </a>
  )
}
