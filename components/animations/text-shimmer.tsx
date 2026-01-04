"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface TextShimmerProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
}

export function TextShimmer({ children, className, as: Component = "span" }: TextShimmerProps) {
  return (
    <Component
      className={cn(
        "bg-gradient-to-r from-primary via-foreground to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x",
        className,
      )}
    >
      {children}
    </Component>
  )
}
