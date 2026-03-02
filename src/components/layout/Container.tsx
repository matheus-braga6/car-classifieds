import type { ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="w-full mx-auto max-w-355 px-4">
      {children}
    </div>
  )
}