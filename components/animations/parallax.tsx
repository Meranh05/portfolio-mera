"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ParallaxProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down"
}

export function Parallax({ children, className, speed = 0.5, direction = "up" }: ParallaxProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setOffset(scrollY * speed * (direction === "up" ? -1 : 1))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed, direction])

  return (
    <div className={cn("will-change-transform", className)} style={{ transform: `translateY(${offset}px)` }}>
      {children}
    </div>
  )
}
