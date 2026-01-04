"use client"

import type * as React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  resolvedTheme: "dark" | "light"
  setTheme: (theme: Theme) => void
  toggleTheme: () => "dark" | "light"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = (localStorage.getItem("portfolio-theme") as Theme) || "dark"
    setThemeState(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = useCallback((newTheme: Theme) => {
    let resolved: "dark" | "light" = "dark"

    if (newTheme === "system") {
      resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    } else {
      resolved = newTheme
    }

    setResolvedTheme(resolved)
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(resolved)
  }, [])

  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme)
      localStorage.setItem("portfolio-theme", newTheme)
      applyTheme(newTheme)
    },
    [applyTheme],
  )

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    return newTheme
  }, [resolvedTheme, setTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => applyTheme("system")

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, applyTheme])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Return default values if not within provider
    return {
      theme: "dark" as Theme,
      resolvedTheme: "dark" as "dark" | "light",
      setTheme: () => {},
      toggleTheme: () => "dark" as "dark" | "light",
    }
  }
  return context
}
