"use client"

import { CircleCheckIcon } from "@/assets/icons/CircleCheckIcon"
import { InformationLineIcon } from "@/assets/icons/InformationLineIcon"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import { CloseCircleLineIcon } from "@/assets/icons/CloseCircleLineIcon"
import { AlertLineIcon } from "@/assets/icons/AlertLineIcon"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InformationLineIcon className="size-4" />,
        warning: <AlertLineIcon className="size-4" />,
        error: <CloseCircleLineIcon className="size-4" />,
        loading: <LoaderLineIcon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
