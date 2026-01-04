"use client"

import { Code2, Laptop, Rocket, Users, Loader2 } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerContainer } from "@/components/animations/stagger-container"
import { useClickEffect } from "@/hooks/use-click-effect"
import { useAboutSync } from "@/hooks/use-portfolio-sync"

const values = [
  {
    icon: Code2,
    title: "Clean Code",
    description: "Viết code sạch, dễ đọc và bảo trì",
    color: "text-cyan-400",
  },
  {
    icon: Laptop,
    title: "Responsive",
    description: "Tương thích mọi thiết bị",
    color: "text-green-400",
  },
  {
    icon: Rocket,
    title: "Performance",
    description: "Tối ưu hiệu suất cao nhất",
    color: "text-yellow-400",
  },
  {
    icon: Users,
    title: "Teamwork",
    description: "Làm việc nhóm hiệu quả",
    color: "text-pink-400",
  },
]

export function AboutSection() {
  const { createParticles } = useClickEffect()
  const { aboutInfo, isLoading } = useAboutSync()

  if (isLoading || !aboutInfo) {
    return (
      <section id="about" className="py-20 bg-secondary/30 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    )
  }

  return (
    <section id="about" className="py-20 bg-secondary/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.05),transparent_70%)]" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="text-sm text-muted-foreground tracking-wider uppercase">Câu chuyện</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">HÀNH TRÌNH PHÁT TRIỂN</h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative bg-card rounded-xl p-8 border border-border card-hover gradient-border">
              <div className="absolute -top-4 left-8">
                <span className="text-5xl text-primary animate-pulse">&#8220;</span>
              </div>
              <blockquote className="text-center text-muted-foreground italic text-lg leading-relaxed pt-4">
                {aboutInfo.quote}
              </blockquote>
            </div>
          </div>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all text-center card-hover cursor-pointer group"
              onClick={(e) => createParticles(e, "snow")}
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary/20">
                <value.icon className={`w-6 h-6 ${value.color} group-hover:scale-110 transition-transform`} />
              </div>
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {value.title}
              </h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
