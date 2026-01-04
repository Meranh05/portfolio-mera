"use client"

import type React from "react"
import Link from "next/link"
import { Code2, Github, Linkedin, Mail, Globe, Send, MessageSquare, Link as LinkIcon } from "lucide-react"
import { useClickEffect } from "@/hooks/use-click-effect"
import { toast } from "sonner"
import { useAboutSync } from "@/hooks/use-portfolio-sync"

export function Footer() {
  const { createParticles } = useClickEffect()
  const { aboutInfo } = useAboutSync()

  const siteName = aboutInfo?.siteName || "Mera"

  const handleSocialClick = (e: React.MouseEvent, platform: string, href: string) => {
    e.preventDefault()
    createParticles(e, "snow")
    toast.info(`Đang mở ${platform}...`, {
      description: "Bạn sẽ được chuyển hướng ngay.",
    })
    setTimeout(() => {
      window.open(href, "_blank")
    }, 500)
  }

  return (
    <footer className="py-8 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={(e) => {
              createParticles(e, "sparkle")
              window.scrollTo({ top: 0, behavior: "smooth" })
              toast.success("Đã cuộn lên đầu trang!")
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors group-hover:scale-110 transform duration-300">
              <Code2 className="w-4 h-4 text-primary" />
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              © 2026 {siteName}. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            {(aboutInfo?.socials && aboutInfo.socials.length > 0
              ? aboutInfo.socials.filter(s => s.href && s.href.trim() !== "")
              : [
                { platform: "email", href: aboutInfo?.email ? `mailto:${aboutInfo.email}` : "mailto:contact@mera.dev" },
                { platform: "github", href: aboutInfo?.github || "https://github.com" },
                { platform: "linkedin", href: aboutInfo?.linkedin || "https://linkedin.com" },
              ]
            ).map((social, index) => {
              const platform = social.platform.toLowerCase()
              const iconMap: Record<string, any> = {
                email: Mail,
                github: Github,
                linkedin: Linkedin,
                facebook: Globe,
                telegram: Send,
                zalo: MessageSquare,
              }
              const Icon = iconMap[platform] || LinkIcon
              const label = social.platform.charAt(0).toUpperCase() + social.platform.slice(1)

              return (
                <button
                  key={index}
                  onClick={(e) => handleSocialClick(e, label, social.href)}
                  className="text-muted-foreground hover:text-primary transition-all hover:scale-110 transform duration-200"
                >
                  <Icon className="w-5 h-5" />
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Terms of Service
              <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
