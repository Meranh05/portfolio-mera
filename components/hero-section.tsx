"use client"

import type React from "react"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Code2, Loader2 } from "lucide-react"
import { useTypingEffect } from "@/hooks/use-typing-effect"
import { useClickEffect } from "@/hooks/use-click-effect"
import { FadeIn } from "@/components/animations/fade-in"
import { FloatingElement } from "@/components/animations/floating-element"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { Parallax } from "@/components/animations/parallax"
import { toast } from "sonner"
import { useAboutSync } from "@/hooks/use-portfolio-sync"

export function HeroSection() {
  const { aboutInfo, isLoading } = useAboutSync()
  const { displayText, isComplete } = useTypingEffect(aboutInfo?.title || "FULL STACK DEV", 100, 500)
  const { createParticles } = useClickEffect()

  const scrollToContact = (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
    toast.success("Cuộn đến phần Liên hệ!", {
      description: "Hãy điền form để liên lạc với tôi.",
    })
  }

  const scrollToProjects = (e: React.MouseEvent) => {
    createParticles(e, "sparkle")
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (isLoading || !aboutInfo) {
    return (
      <section className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    )
  }

  return (
    <section className="min-h-screen pt-24 pb-16 flex items-center overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <FadeIn delay={0}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-green-500 font-medium tracking-wider uppercase">Sẵn sàng làm việc</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">XIN CHÀO, TÔI LÀ</h1>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                  {displayText}
                  {!isComplete && <span className="animate-pulse">|</span>}
                </h2>
                <p className="text-xl text-muted-foreground">{aboutInfo.subtitle}</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="text-muted-foreground text-lg max-w-lg leading-relaxed">{aboutInfo.bio}</p>
            </FadeIn>

            <FadeIn delay={0.6}>
              <div className="flex flex-wrap gap-4">
                <MagneticButton>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-scale ripple animate-pulse-glow"
                    onClick={scrollToContact}
                  >
                    Liên hệ ngay
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </MagneticButton>
                <MagneticButton>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border text-foreground hover:bg-secondary bg-transparent smooth-scale"
                    onClick={scrollToProjects}
                  >
                    Xem Portfolio
                  </Button>
                </MagneticButton>
              </div>
            </FadeIn>

            <FadeIn delay={0.8}>
              <div className="flex items-center gap-6 pt-4">
                <span className="text-xs text-muted-foreground tracking-wider uppercase">Tech Stack</span>
                <div className="flex items-center gap-4 text-muted-foreground">
                  {["HTML", "CSS", "JS"].map((tech, i) => (
                    <span
                      key={tech}
                      className="text-sm font-mono hover:text-primary transition-colors glow-text cursor-default"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {tech}
                    </span>
                  ))}
                  <Code2 className="w-4 h-4 hover:text-primary transition-colors" />
                </div>
              </div>
            </FadeIn>
          </div>

          <Parallax speed={0.1}>
            <FadeIn direction="left" delay={0.3}>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary to-secondary border border-border card-hover">
                  <Image
                    src="/developer-workspace-with-multiple-monitors-showing.jpg"
                    alt="Developer Workspace"
                    width={600}
                    height={500}
                    className="w-full h-auto object-cover"
                  />

                  <FloatingElement className="absolute top-4 right-4" duration={4} distance={8}>
                    <div
                      className="bg-card/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-border cursor-pointer smooth-scale"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        const rect = (e.target as HTMLElement).getBoundingClientRect()
                        const particles = 15
                        for (let i = 0; i < particles; i++) {
                          const particle = document.createElement("div")
                          particle.style.cssText = `
                            position: fixed;
                            left: ${rect.left + rect.width / 2}px;
                            top: ${rect.top + rect.height / 2}px;
                            width: 6px;
                            height: 6px;
                            background: #fff;
                            border-radius: 50%;
                            pointer-events: none;
                            z-index: 9999;
                            animation: snow-fall ${1 + Math.random()}s ease-out forwards;
                            --tx: ${(Math.random() - 0.5) * 100}px;
                            --ty: ${Math.random() * 100 + 50}px;
                          `
                          document.body.appendChild(particle)
                          setTimeout(() => particle.remove(), 2000)
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-xs text-muted-foreground">KINH NGHIỆM</p>
                          <p className="text-lg font-bold text-foreground">{aboutInfo.yearsExperience}+ Năm</p>
                        </div>
                      </div>
                    </div>
                  </FloatingElement>
                </div>

                <FloatingElement
                  className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"
                  duration={5}
                  distance={15}
                />
                <FloatingElement
                  className="absolute -top-4 -right-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"
                  duration={4}
                  delay={1}
                  distance={12}
                />
              </div>
            </FadeIn>
          </Parallax>
        </div>

        <FadeIn delay={1.2} className="flex justify-center mt-16">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs tracking-widest uppercase">Scroll Down</span>
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        </FadeIn>
      </div>

      <style jsx global>{`
        @keyframes snow-fall {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0);
          }
        }
      `}</style>
    </section>
  )
}
