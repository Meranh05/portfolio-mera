"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Code2,
  ExternalLink,
  FolderKanban,
  Github,
  LayoutDashboard,
  Palette,
  Settings,
  User,
  Briefcase,
  MessageSquare,
} from "lucide-react"
import { useClickEffect } from "@/hooks/use-click-effect"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { useEffect, useState } from "react"
import { getMessages } from "@/lib/portfolio-store"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
  { icon: Github, label: "GitHub", href: "/admin/github" },
  { icon: Code2, label: "Skills", href: "/admin/skills" },
  { icon: Briefcase, label: "Experience", href: "/admin/experience" },
  { icon: User, label: "About Me", href: "/admin/about" },
  { icon: MessageSquare, label: "Messages", href: "/admin/messages", badge: true },
  { icon: Palette, label: "Appearance", href: "/admin/appearance" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { createParticles } = useClickEffect()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const updateUnread = () => {
      const messages = getMessages()
      setUnreadCount(messages.filter((m) => !m.read).length)
    }
    updateUnread()

    const handleStorage = () => updateUnread()
    window.addEventListener("storage", handleStorage)
    window.addEventListener("portfolio-sync" as any, handleStorage)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("portfolio-sync" as any, handleStorage)
    }
  }, [])

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="p-6 relative z-10">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => createParticles(e, "sparkle")}>
          <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
            <AvatarImage src="/developer-avatar.png" />
            <AvatarFallback className="bg-primary/20 text-primary">AC</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Admin Console</p>
            <p className="text-sm text-muted-foreground">Welcome back, Mera </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 relative z-10">
        <ul className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href} className="animate-slide-left" style={{ animationDelay: `${index * 0.05}s` }}>
                <Link
                  href={item.href}
                  onClick={(e) => !isActive && createParticles(e, "snow")}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {!isActive && (
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  )}
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      isActive ? "scale-110" : "group-hover:scale-110",
                    )}
                  />
                  <span className="relative flex-1">{item.label}</span>
                  {item.badge && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                      {unreadCount}
                    </span>
                  )}
                  {isActive && !item.badge && (
                    <span className="absolute right-3 w-2 h-2 bg-primary-foreground rounded-full animate-pulse" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 mt-auto relative z-10">
        <MagneticButton className="w-full">
          <Link href="/" target="_blank" className="block">
            <Button
              className="w-full bg-primary text-primary-foreground smooth-scale ripple"
              onClick={(e) => createParticles(e, "confetti")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Site
            </Button>
          </Link>
        </MagneticButton>
      </div>
    </aside>
  )
}
