"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Check, Code2, Copy, Github, Globe, Linkedin, Loader2, Mail, Phone, Send, Facebook, MessageSquare } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { useClickEffect } from "@/hooks/use-click-effect"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { toast } from "sonner"
import { useAboutSync } from "@/hooks/use-portfolio-sync"
import { addMessage } from "@/lib/portfolio-store"

export function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { createParticles } = useClickEffect()
  const { aboutInfo, isLoading } = useAboutSync()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const copyToClipboard = (text: string, type: string, e: React.MouseEvent) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    createParticles(e, "snow")
    toast.success("Đã sao chép!", {
      description: type === "email" ? "Email đã được sao chép vào clipboard" : "Số điện thoại đã được sao chép",
    })
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Vui lòng điền đầy đủ thông tin!")
      return
    }

    setIsSubmitting(true)
    createParticles(e as unknown as React.MouseEvent, "confetti")

    setTimeout(() => {
      // Save message to store
      addMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "Không có chủ đề",
        message: formData.message,
      })

      setIsSubmitting(false)
      toast.success("Gửi thành công!", {
        description: "Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất có thể.",
      })

      // Reset form
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 1500)
  }

  if (isLoading || !aboutInfo) {
    return (
      <section id="contact" className="py-20 bg-secondary/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.1),transparent_60%)]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <FadeIn direction="right">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-green-500 font-medium tracking-wider uppercase">Open to work</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Liên hệ với tôi</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Tôi luôn sẵn sàng thảo luận về các dự án công nghệ, cơ hội hợp tác hoặc chỉ đơn giản là chia sẻ niềm đam
                mê lập trình. Inbox của tôi luôn mở.
              </p>

              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-foreground">Thông tin trực tiếp</h3>

                <div className="bg-card rounded-xl p-4 border border-border flex items-center justify-between card-hover">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Email</p>
                      <p className="text-foreground">{aboutInfo.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => copyToClipboard(aboutInfo.email, "email", e)}
                    className="text-primary hover:bg-primary/10 smooth-scale"
                  >
                    {copied === "email" ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Đã copy!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-card rounded-xl p-4 border border-border flex items-center justify-between card-hover">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Điện thoại</p>
                      <p className="text-foreground">{aboutInfo.phone}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => copyToClipboard(aboutInfo.phone.replace(/\s/g, ""), "phone", e)}
                    className="text-primary hover:bg-primary/10 smooth-scale"
                  >
                    {copied === "phone" ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Đã copy!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Mạng xã hội</h3>
                <div className="flex gap-3 flex-wrap">
                  {(aboutInfo.socials && aboutInfo.socials.filter(s => s.href && s.href.trim() !== "").length > 0
                    ? aboutInfo.socials.filter(s => s.href && s.href.trim() !== "")
                    : [
                      { platform: "github", href: aboutInfo.github },
                      { platform: "linkedin", href: aboutInfo.linkedin },
                      { platform: "twitter", href: aboutInfo.twitter },
                    ].filter(s => s.href)
                  ).map((social, index) => {
                    const platform = social.platform.toLowerCase()
                    const iconMap: Record<string, any> = {
                      github: Github,
                      linkedin: Linkedin, // Updated to use Linkedin icon if available, but looking at line 10 it's not there. Wait, I should add Linkedin to imports too.
                      twitter: Code2,
                      facebook: Facebook,
                      telegram: Send,
                      gmail: Mail,
                      zalo: MessageSquare,
                    }
                    const Icon = iconMap[platform] || Globe
                    const label = social.platform.charAt(0).toUpperCase() + social.platform.slice(1)

                    return (
                      <MagneticButton key={index}>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="bg-card border border-border hover:border-primary/50 hover:bg-primary/10 transition-all smooth-scale"
                          onClick={(e) => {
                            createParticles(e, "sparkle")
                            if (social.href) {
                              window.open(social.href, "_blank")
                              toast.info(`Đang mở ${label}...`)
                            } else {
                              toast.info("Chưa có link", { description: "Vui lòng cập nhật trong Admin" })
                            }
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </Button>
                      </MagneticButton>
                    )
                  })}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <div className="bg-card rounded-xl p-8 border border-border gradient-border">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-primary text-xl">{">"}</span>
                <h3 className="font-semibold text-foreground text-xl">Gửi tin nhắn</h3>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="group">
                    <label className="text-sm text-muted-foreground mb-2 block group-focus-within:text-primary transition-colors">
                      Họ và tên
                    </label>
                    <Input
                      placeholder="John Doe"
                      className="bg-secondary border-border focus:border-primary transition-colors"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="group">
                    <label className="text-sm text-muted-foreground mb-2 block group-focus-within:text-primary transition-colors">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="bg-secondary border-border focus:border-primary transition-colors"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-sm text-muted-foreground mb-2 block group-focus-within:text-primary transition-colors">
                    Chủ đề
                  </label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border focus:border-primary transition-colors">
                      <SelectValue placeholder="Chọn chủ đề" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hợp tác dự án">Hợp tác dự án</SelectItem>
                      <SelectItem value="Cơ hội việc làm">Cơ hội việc làm</SelectItem>
                      <SelectItem value="Tư vấn">Tư vấn</SelectItem>
                      <SelectItem value="Khác">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="group">
                  <label className="text-sm text-muted-foreground mb-2 block group-focus-within:text-primary transition-colors">
                    Nội dung tin nhắn
                  </label>
                  <Textarea
                    placeholder="Hãy mô tả chi tiết về yêu cầu của bạn..."
                    className="bg-secondary border-border min-h-[120px] focus:border-primary transition-colors"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <MagneticButton className="w-full">
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 smooth-scale ripple"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Đang gửi...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Gửi ngay
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </MagneticButton>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
