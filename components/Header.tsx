"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Code2, Download, Menu, Moon, Sun, X } from "lucide-react"
import { useClickEffect } from "@/hooks/use-click-effect"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { toast } from "sonner"
import { getCVData } from "@/lib/cv-store"
import { useAboutSync } from "@/hooks/use-portfolio-sync"
import { useThemeContext } from "@/components/ThemeProvider"

const navItems = [
  { label: "Câu chuyện", href: "#about" },
  { label: "Kinh nghiệm", href: "#experience" },
  { label: "Kỹ năng", href: "#skills" },
  { label: "Dự án", href: "#projects" },
  { label: "Liên hệ", href: "#contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { createParticles } = useClickEffect()
  const { aboutInfo } = useAboutSync()
  const { theme, toggleTheme } = useThemeContext()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = navItems.map((item) => item.href.replace("#", ""))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  const handleToggleTheme = (e: React.MouseEvent) => {
    createParticles(e, "sparkle")
    document.documentElement.classList.add("theme-transition")
    toggleTheme()
    toast.info(theme === "dark" ? "Chế độ sáng đã bật" : "Chế độ tối đã bật", {
      description: "Giao diện đã được thay đổi.",
    })
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition")
    }, 300)
  }

  const handleDownloadCV = (e: React.MouseEvent) => {
    createParticles(e, "confetti")

    const cvData = getCVData()

    if (cvData.fileUrl && cvData.fileName) {
      toast.success("Đang tải CV...", {
        description: cvData.fileName,
      })

      setTimeout(() => {
        const link = document.createElement("a")
        link.href = cvData.fileUrl
        link.download = cvData.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 300)
    } else {
      toast.info("CV mặc định", {
        description: `Đang tải CV của ${aboutInfo?.name || "Developer"}...`,
      })

      setTimeout(() => {
        const link = document.createElement("a")
        link.href = "/cv-default.pdf"
        link.download = `CV-${aboutInfo?.name?.replace(/\s+/g, "-") || "Developer"}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 300)
    }
  }

  const isDark = theme === "dark"
  const siteName = aboutInfo?.siteName || "Mera"

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-lg" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors group-hover:scale-110 transform duration-300">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {siteName}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("#", "")
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`text-sm relative py-2 transition-colors cursor-pointer ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                  />
                </a>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground smooth-scale relative overflow-hidden"
              onClick={handleToggleTheme}
            >
              <Moon
                className={`w-5 h-5 absolute transition-all duration-500 ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
              />
              <Sun
                className={`w-5 h-5 absolute transition-all duration-500 ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
              />
            </Button>
            <MagneticButton>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-scale"
                onClick={handleDownloadCV}
              >
                <Download className="w-4 h-4 mr-2" />
                Tải CV
              </Button>
            </MagneticButton>
          </div>

          <button
            className="md:hidden text-foreground p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <X
                className={`w-6 h-6 absolute transition-all duration-300 ${mobileMenuOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`}
              />
              <Menu
                className={`w-6 h-6 absolute transition-all duration-300 ${mobileMenuOpen ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
              />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden bg-background/95 backdrop-blur-md border-b border-border overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors py-2 border-b border-border/50 last:border-0"
              onClick={(e) => handleNavClick(e, item.href)}
              style={{
                animationDelay: `${index * 0.05}s`,
                animation: mobileMenuOpen ? "slide-in-up 0.3s ease forwards" : "none",
              }}
            >
              {item.label}
            </a>
          ))}
          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">Chế độ {isDark ? "tối" : "sáng"}</span>
            <Button variant="ghost" size="icon" onClick={handleToggleTheme}>
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          </div>
          <Button className="bg-primary text-primary-foreground w-full mt-2" onClick={handleDownloadCV}>
            <Download className="w-4 h-4 mr-2" />
            Tải CV
          </Button>
        </nav>
      </div>
    </header>
  )
}
