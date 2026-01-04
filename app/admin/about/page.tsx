"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useClickEffect } from "@/hooks/use-click-effect"
import { getAboutInfo, saveAboutInfo, type AboutInfo } from "@/lib/portfolio-store"
import {
  User,
  Save,
  Upload,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Quote,
  Briefcase,
  Globe,
  Send,
  MessageSquare,
  Facebook,
} from "lucide-react"

export default function AdminAboutPage() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const { createParticles } = useClickEffect()

  useEffect(() => {
    const info = getAboutInfo()
    setAboutInfo(info)
    setAvatarPreview(info.avatar)
  }, [])

  const handleSave = async (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    if (!aboutInfo) return

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    await saveAboutInfo(aboutInfo)
    setIsSaving(false)
    toast.success("Đã lưu thông tin thành công!")
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setAvatarPreview(result)
        if (aboutInfo) {
          setAboutInfo({ ...aboutInfo, avatar: result })
        }
      }
      reader.readAsDataURL(file)
      toast.success("Đã tải ảnh lên!")
    }
  }

  if (!aboutInfo) {
    return (
      <div className="flex min-h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <User className="w-8 h-8 text-primary" />
                Thông tin cá nhân
              </h1>
              <p className="text-muted-foreground mt-1">Cập nhật thông tin hiển thị trên trang portfolio của bạn</p>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary text-primary-foreground gap-2">
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Lưu thay đổi
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <Card className="lg:col-span-1 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Ảnh đại diện
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative group cursor-pointer mb-4">
                <Avatar className="w-32 h-32 border-4 border-primary/20 group-hover:border-primary/50 transition-all">
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} />
                  <AvatarFallback className="text-3xl bg-primary/20 text-primary">
                    {aboutInfo.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="w-8 h-8 text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Click vào ảnh để thay đổi
                <br />
                Định dạng: JPG, PNG (max 2MB)
              </p>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 mb-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-primary font-semibold">
                    <Globe className="w-4 h-4" /> Tên trang web (Logo)
                  </Label>
                  <Input
                    value={aboutInfo.siteName || "Mera"}
                    onChange={(e) => setAboutInfo({ ...aboutInfo, siteName: e.target.value })}
                    placeholder="Mera"
                    className="font-bold text-lg"
                  />
                  <p className="text-xs text-muted-foreground">Tên này sẽ hiển thị ở logo header của trang web</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Họ và tên</Label>
                  <Input
                    value={aboutInfo.name}
                    onChange={(e) => setAboutInfo({ ...aboutInfo, name: e.target.value })}
                    placeholder="Nguyen Van A"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Chức danh</Label>
                  <Input
                    value={aboutInfo.title}
                    onChange={(e) => setAboutInfo({ ...aboutInfo, title: e.target.value })}
                    placeholder="Full Stack Developer"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phụ đề</Label>
                  <Input
                    value={aboutInfo.subtitle}
                    onChange={(e) => setAboutInfo({ ...aboutInfo, subtitle: e.target.value })}
                    placeholder="& UI/UX Designer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số năm kinh nghiệm</Label>
                  <Input
                    type="number"
                    value={aboutInfo.yearsExperience}
                    onChange={(e) =>
                      setAboutInfo({ ...aboutInfo, yearsExperience: Number.parseInt(e.target.value) || 0 })
                    }
                    min={0}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Giới thiệu ngắn</Label>
                <Textarea
                  value={aboutInfo.bio}
                  onChange={(e) => setAboutInfo({ ...aboutInfo, bio: e.target.value })}
                  placeholder="Mô tả ngắn về bản thân..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quote */}
          <Card className="lg:col-span-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Quote className="w-5 h-5 text-primary" />
                Câu nói / Quote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={aboutInfo.quote}
                onChange={(e) => setAboutInfo({ ...aboutInfo, quote: e.target.value })}
                placeholder="Câu nói truyền cảm hứng của bạn..."
                rows={4}
                className="italic"
              />
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Thông tin liên hệ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input
                    type="email"
                    value={aboutInfo.email}
                    onChange={(e) => setAboutInfo({ ...aboutInfo, email: e.target.value })}
                    placeholder="contact@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Số điện thoại
                  </Label>
                  <Input
                    value={aboutInfo.phone}
                    onChange={(e) => setAboutInfo({ ...aboutInfo, phone: e.target.value })}
                    placeholder="+84 123 456 789"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Địa chỉ
                </Label>
                <Input
                  value={aboutInfo.location}
                  onChange={(e) => setAboutInfo({ ...aboutInfo, location: e.target.value })}
                  placeholder="Ho Chi Minh, Vietnam"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="lg:col-span-3 animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Mạng xã hội
              </CardTitle>
              <p className="text-sm text-muted-foreground">Chọn và sắp xếp các liên kết mạng xã hội để hiển thị trên trang.</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {[
                  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourprofile", icon: Facebook },
                  { key: "telegram", label: "Telegram", placeholder: "https://t.me/username", icon: Send },
                  { key: "gmail", label: "Gmail", placeholder: "mailto:you@example.com", icon: Mail },
                  { key: "zalo", label: "Zalo", placeholder: "https://zalo.me/yourid", icon: MessageSquare },
                  { key: "github", label: "GitHub", placeholder: "https://github.com/username", icon: Github },
                  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username", icon: Linkedin },
                ].map((p) => {
                  const socials = aboutInfo.socials || []
                  const active = socials.some((s) => s.platform === p.key)
                  const current = socials.find((s) => s.platform === p.key)
                  const Icon = p.icon

                  const togglePlatform = (platform: string) => {
                    const exists = socials.find((s) => s.platform === platform)
                    if (exists) {
                      setAboutInfo({ ...aboutInfo, socials: socials.filter((s) => s.platform !== platform) })
                    } else {
                      setAboutInfo({ ...aboutInfo, socials: [...socials, { platform, href: "" }] })
                    }
                  }

                  const updateHref = (platform: string, href: string) => {
                    setAboutInfo({
                      ...aboutInfo,
                      socials: socials.map((s) => (s.platform === platform ? { ...s, href } : s))
                    })
                  }

                  const move = (platform: string, dir: "up" | "down") => {
                    const idx = socials.findIndex((s) => s.platform === platform)
                    if (idx === -1) return
                    const copy = [...socials]
                    const swap = dir === "up" ? idx - 1 : idx + 1
                    if (swap < 0 || swap >= copy.length) return
                    const tmp = copy[swap]
                    copy[swap] = copy[idx]
                    copy[idx] = tmp
                    setAboutInfo({ ...aboutInfo, socials: copy })
                  }

                  return (
                    <div key={p.key} className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center gap-3 w-full md:w-64">
                        <button
                          onClick={() => togglePlatform(p.key)}
                          aria-pressed={active}
                          className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${active ? "bg-primary text-primary-foreground" : "bg-secondary"
                            }`}
                        >
                          <span className="sr-only">Toggle {p.label}</span>
                          <Icon className="w-4 h-4" />
                        </button>
                        <div>
                          <div className="text-sm font-medium">{p.label}</div>
                          <div className="text-xs text-muted-foreground">{p.placeholder}</div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col md:flex-row items-center gap-2 w-full">
                        <Input
                          value={current?.href || ""}
                          placeholder={p.placeholder}
                          onChange={(e) => updateHref(p.key, e.target.value)}
                          className="bg-secondary border-border flex-1"
                          disabled={!active}
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => move(p.key, "up")}
                            disabled={!active}
                          >
                            ↑
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => move(p.key, "down")}
                            disabled={!active}
                          >
                            ↓
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
