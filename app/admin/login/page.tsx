"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Eye, EyeOff, Lock, Shield, User } from "lucide-react"
import { useClickEffect } from "@/hooks/use-click-effect"
import { toast } from "sonner"

export default function AdminLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { createParticles } = useClickEffect()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Vui lòng điền đầy đủ thông tin!", {
        description: "Email và mật khẩu không được để trống.",
      })
      return
    }

    setIsLoading(true)
    createParticles(e as unknown as React.MouseEvent, "confetti")

    // Simulate login
    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "admin123") {
        toast.success("Đăng nhập thành công!", {
          description: "Chào mừng bạn trở lại, Admin!",
        })
        localStorage.setItem("admin_logged_in", "true")
        // Set cookie for middleware2585
        document.cookie = "admin_session=true; path=/; max-age=86400; SameSite=Lax"
        router.push("/admin")
      } else {
        toast.error("Đăng nhập thất bại!", {
          description: "Email hoặc mật khẩu không đúng. Thử: admin@gmail.com / admin123",
        })
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    createParticles(e, "sparkle")
    toast.info("Đang phát triển...", {
      description: "Tính năng quên mật khẩu sẽ sớm có mặt!",
    })
  }

  const handleBackToHome = (e: React.MouseEvent) => {
    createParticles(e, "snow")
    toast.info("Đang chuyển hướng...", {
      description: "Bạn sẽ được đưa về trang chủ.",
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div
        className={`w-full max-w-md relative z-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4 animate-float cursor-pointer hover:scale-110 transition-transform"
            onClick={(e) => {
              createParticles(e, "confetti")
              toast.success("Chào mừng đến Admin Panel!")
            }}
          >
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Đăng nhập Admin</h1>
          <p className="text-muted-foreground mt-2">Chào mừng trở lại! Vui lòng nhập thông tin để truy cập.</p>
        </div>

        <div className="bg-card rounded-xl p-8 border border-border gradient-border backdrop-blur-sm">
          <form onSubmit={handleLogin} className="space-y-5">
            <div
              className="transition-all duration-300"
              style={{ transitionDelay: mounted ? "0.1s" : "0s", opacity: mounted ? 1 : 0 }}
            >
              <label className="text-sm text-muted-foreground mb-2 block uppercase tracking-wider">
                Email hoặc tên đăng nhập
              </label>
              <div className="relative group">
                <User className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10 bg-secondary border-border focus:border-primary transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div
              className="transition-all duration-300"
              style={{ transitionDelay: mounted ? "0.2s" : "0s", opacity: mounted ? 1 : 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-muted-foreground uppercase tracking-wider">Mật khẩu</label>
                <button type="button" onClick={handleForgotPassword} className="text-sm text-primary hover:underline">
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative group">
                <Lock className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-secondary border-border focus:border-primary transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    setShowPassword(!showPassword)
                    createParticles(e, "sparkle")
                    toast.info(showPassword ? "Đã ẩn mật khẩu" : "Đang hiển thị mật khẩu")
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground smooth-scale ripple"
              disabled={isLoading}
              style={{ transitionDelay: mounted ? "0.3s" : "0s", opacity: mounted ? 1 : 0 }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Đang đăng nhập...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">Hệ thống quản lý nội dung cá nhân được bảo mật.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:underline mt-3 text-sm group"
              onClick={handleBackToHome}
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Quay lại Trang chủ
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          © 2026 IT Profile Dashboard. All rights reserved.
        </p>
      </div>
    </div>
  )
}
