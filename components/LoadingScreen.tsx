"use client"

import { useEffect, useState } from "react"
import { Code2 } from "lucide-react"

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 300)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center transition-opacity duration-500">
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
          <Code2 className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-primary/50 animate-ping" />
      </div>

      <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <p className="mt-4 text-muted-foreground text-sm animate-pulse">Loading amazing things...</p>
    </div>
  )
}
