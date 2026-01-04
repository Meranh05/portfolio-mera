"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  duration?: number
  delay?: number
  distance?: number
}

export function FloatingElement({ children, className, duration = 3, delay = 0, distance = 10 }: FloatingElementProps) {
  return (
    <div
      className={cn("animate-float", className)}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        // @ts-ignore - CSS custom property
        "--float-distance": `${distance}px`,
      }}
    >
      {children}
    </div>
  )
}
