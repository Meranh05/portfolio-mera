"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import React from "react"

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  direction?: "up" | "down" | "left" | "right"
}

export function StaggerContainer({ children, className, staggerDelay = 0.1, direction = "up" }: StaggerContainerProps) {
  const { ref, isVisible } = useScrollAnimation()

  const directionStyles = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
  }

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className={cn(
            "transition-all duration-500",
            isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${directionStyles[direction]}`,
          )}
          style={{
            transitionDelay: isVisible ? `${index * staggerDelay}s` : "0s",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
