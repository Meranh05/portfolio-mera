"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor, Palette, Check, Eye } from "lucide-react"
import { toast } from "sonner"
import { FadeIn } from "@/components/animations/fade-in"

const themes = [
  { id: "dark", name: "Tối", icon: Moon, description: "Giao diện tối, dễ nhìn trong điều kiện ánh sáng yếu" },
  { id: "light", name: "Sáng", icon: Sun, description: "Giao diện sáng, phù hợp với môi trường nhiều ánh sáng" },
  { id: "system", name: "Hệ thống", icon: Monitor, description: "Tự động theo cài đặt hệ thống của bạn" },
]

const accentColors = [
  { id: "cyan", name: "Cyan", color: "#06b6d4", hue: 200 },
  { id: "blue", name: "Xanh dương", color: "#3b82f6", hue: 220 },
  { id: "purple", name: "Tím", color: "#8b5cf6", hue: 270 },
  { id: "pink", name: "Hồng", color: "#ec4899", hue: 330 },
  { id: "green", name: "Xanh lá", color: "#22c55e", hue: 140 },
  { id: "orange", name: "Cam", color: "#f97316", hue: 25 },
]

function AppearancePageContent() {
  const [selectedTheme, setSelectedTheme] = useState("dark")
  const [selectedAccent, setSelectedAccent] = useState("cyan")
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark"
    const savedAccent = localStorage.getItem("portfolio-accent") || "cyan"
    setSelectedTheme(savedTheme)
    setSelectedAccent(savedAccent)
  }, [])

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId)

    if (themeId === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      document.documentElement.classList.remove("dark", "light")
      document.documentElement.classList.add(prefersDark ? "dark" : "light")
    } else {
      document.documentElement.classList.remove("dark", "light")
      document.documentElement.classList.add(themeId)
    }

    localStorage.setItem("portfolio-theme", themeId)
    toast.success("Đã thay đổi giao diện", {
      description: `Giao diện ${themes.find((t) => t.id === themeId)?.name} đã được áp dụng.`,
    })
  }

  const handleAccentChange = (accentId: string) => {
    setSelectedAccent(accentId)
    const accent = accentColors.find((a) => a.id === accentId)
    if (accent) {
      document.documentElement.style.setProperty("--color-primary", `oklch(0.7 0.18 ${accent.hue})`)
      document.documentElement.style.setProperty("--color-accent", `oklch(0.7 0.18 ${accent.hue})`)
      document.documentElement.style.setProperty("--color-ring", `oklch(0.7 0.18 ${accent.hue})`)
    }
    localStorage.setItem("portfolio-accent", accentId)
    toast.success("Đã thay đổi màu chủ đạo", {
      description: `Màu ${accent?.name} đã được áp dụng.`,
    })
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="space-y-8">
        <FadeIn>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Giao diện</h1>
            <p className="text-muted-foreground mt-2">Tùy chỉnh giao diện và màu sắc cho portfolio</p>
          </div>
        </FadeIn>

        {/* Theme Selection */}
        <FadeIn delay={0.1}>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Moon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Chế độ hiển thị</h2>
                <p className="text-sm text-muted-foreground">Chọn chế độ sáng hoặc tối</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${selectedTheme === theme.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 bg-secondary/50"
                    }`}
                >
                  {selectedTheme === theme.id && (
                    <div className="absolute top-3 right-3">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center mb-3 border border-border">
                    <theme.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Accent Color Selection */}
        <FadeIn delay={0.2}>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Màu chủ đạo</h2>
                <p className="text-sm text-muted-foreground">Chọn màu accent cho các thành phần UI</p>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {accentColors.map((accent) => (
                <button
                  key={accent.id}
                  onClick={() => handleAccentChange(accent.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${selectedAccent === accent.id ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-2 ring-2 ring-offset-2 ring-offset-card transition-all"
                    style={
                      {
                        backgroundColor: accent.color,
                        "--tw-ring-color": selectedAccent === accent.id ? accent.color : "transparent",
                      } as React.CSSProperties
                    }
                  />
                  <p className="text-sm text-center text-foreground font-medium">{accent.name}</p>
                  {selectedAccent === accent.id && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Preview */}
        <FadeIn delay={0.3}>
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Xem trước</h2>
                  <p className="text-sm text-muted-foreground">Preview các thành phần UI</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                {previewMode ? "Thu gọn" : "Mở rộng"}
              </Button>
            </div>

            <div
              className={`space-y-4 overflow-hidden transition-all ${previewMode ? "max-h-[1000px]" : "max-h-[300px]"}`}
            >
              {/* Buttons Preview */}
              <div className="p-4 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-3">Buttons</p>
                <div className="flex flex-wrap gap-3">
                  <Button>Primary Button</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>

              {/* Cards Preview */}
              <div className="p-4 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-3">Cards</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-card rounded-lg border border-border">
                    <h3 className="font-semibold text-foreground">Card Title</h3>
                    <p className="text-sm text-muted-foreground mt-1">Card description text</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="font-semibold text-primary">Highlighted Card</h3>
                    <p className="text-sm text-muted-foreground mt-1">With primary accent</p>
                  </div>
                </div>
              </div>

              {/* Badges Preview */}
              <div className="p-4 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-3">Badges</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">React</span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">Node.js</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">TypeScript</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-sm">Next.js</span>
                </div>
              </div>

              {/* Progress Bars Preview */}
              <div className="p-4 bg-background rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-3">Progress Bars</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">JavaScript</span>
                      <span className="text-sm text-primary">90%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "90%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-foreground">React</span>
                      <span className="text-sm text-primary">85%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}

export default function AppearancePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AppearancePageContent />
    </Suspense>
  )
}
