"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface RevealTextProps {
  children: string
  className?: string
  delay?: number
}

export function RevealText({ children, className, delay = 0 }: RevealTextProps) {
  const { ref, isVisible } = useScrollAnimation()
  const words = children.split(" ")

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.25em]">
          <span
            className={cn(
              "inline-block transition-all duration-500",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
            )}
            style={{ transitionDelay: `${delay + index * 0.05}s` }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  )
}
