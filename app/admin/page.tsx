"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Eye,
  FileText,
  FolderKanban,
  TrendingUp,
  Code2,
  Github,
  ArrowRight,
  Star,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { useClickEffect } from "@/hooks/use-click-effect"
import { useCounter } from "@/hooks/use-counter"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"
import {
  getDashboardStats,
  getGitHubRepos,
  getSkills,
  subscribeSyncEvent,
  type DashboardStats,
  type GitHubRepo,
  type Skill,
} from "@/lib/portfolio-store"
import { toast } from "sonner"

function AnimatedStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  index,
  color = "text-primary",
}: {
  title: string
  value: number
  subtitle?: string
  icon: any
  trend?: "up" | "neutral"
  index: number
  color?: string
}) {
  const { ref, isVisible } = useScrollAnimation()
  const { count, start } = useCounter(value, 1500, true)
  const { createParticles } = useClickEffect()

  useEffect(() => {
    if (isVisible) start()
  }, [isVisible, start])

  return (
    <Card
      ref={ref}
      className={cn(
        "bg-card border-border card-hover cursor-pointer transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
      style={{ transitionDelay: `${index * 0.1}s` }}
      onClick={(e) => createParticles(e, "sparkle")}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn("w-5 h-5", color)} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{count.toLocaleString()}</div>
        {subtitle && (
          <p
            className={cn(
              "text-sm flex items-center gap-1 mt-1",
              trend === "up" ? "text-green-400" : "text-muted-foreground",
            )}
          >
            {trend === "up" && <TrendingUp className="w-4 h-4" />}
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const { createParticles } = useClickEffect()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [featuredRepos, setFeaturedRepos] = useState<GitHubRepo[]>([])
  const [topSkills, setTopSkills] = useState<Skill[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = useCallback(() => {
    setStats(getDashboardStats())
    const repos = getGitHubRepos()
    setFeaturedRepos(repos.filter((r) => r.featured).slice(0, 3))
    const skills = getSkills()
    setTopSkills(skills.filter((s) => s.category === "language" && s.visible).slice(0, 4))
  }, [])

  useEffect(() => {
    loadData()

    // Subscribe to realtime sync events
    const unsubscribe = subscribeSyncEvent((key) => {
      loadData()
      toast.info("Dữ liệu đã được cập nhật", {
        description: `${key.replace("portfolio_", "").replace("_", " ")} đã thay đổi`,
      })
    })

    return unsubscribe
  }, [loadData])

  const handleRefresh = (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    setIsRefreshing(true)
    loadData()
    toast.success("Đã làm mới dữ liệu!")
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  if (!stats) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="mb-8 animate-slide-up flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Chào mừng trở lại! Đây là tổng quan portfolio của bạn.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
          Làm mới
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnimatedStatCard
          title="Tổng Projects"
          value={stats.totalProjects}
          subtitle="+2 tháng này"
          icon={FolderKanban}
          trend="up"
          index={0}
        />
        <AnimatedStatCard
          title="Lượt xem"
          value={stats.totalViews}
          subtitle="Realtime"
          icon={Eye}
          trend="up"
          index={1}
          color="text-green-400"
        />
        <AnimatedStatCard
          title="GitHub Repos"
          value={stats.githubRepos}
          subtitle="Đã đồng bộ"
          icon={Github}
          index={2}
          color="text-purple-400"
        />
        <AnimatedStatCard
          title="Kỹ năng"
          value={stats.totalSkills}
          subtitle="Đang hiển thị"
          icon={Code2}
          index={3}
          color="text-yellow-400"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Featured Projects */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Dự án nổi bật
            </CardTitle>
            <Link href="/admin/github">
              <Button variant="ghost" size="sm" className="gap-1">
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {featuredRepos.length > 0 ? (
              <div className="space-y-4">
                {featuredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer card-hover"
                    onClick={(e) => createParticles(e, "snow")}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{repo.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-sm text-yellow-400">
                          <Star className="w-4 h-4" />
                          {repo.stargazers_count}
                        </span>
                        {repo.language && <Badge variant="secondary">{repo.language}</Badge>}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {repo.description || "Không có mô tả"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Github className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">Chưa có dự án nổi bật</p>
                <Link href="/admin/github">
                  <Button variant="outline" size="sm">
                    Kết nối GitHub
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Skills - Realtime */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              Kỹ năng hàng đầu
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Realtime" />
            </CardTitle>
            <Link href="/admin/skills">
              <Button variant="ghost" size="sm" className="gap-1">
                Quản lý <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {topSkills.length > 0 ? (
              <div className="space-y-4">
                {topSkills.map((skill, index) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-2">
                      <span className="text-foreground">{skill.name}</span>
                      <span className="text-primary font-semibold">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-1000", skill.color)}
                        style={{
                          width: `${skill.level}%`,
                          transitionDelay: `${index * 0.1}s`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">Chưa có kỹ năng nào</p>
                <Link href="/admin/skills">
                  <Button variant="outline" size="sm">
                    Thêm kỹ năng
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8 animate-slide-up" style={{ animationDelay: "0.5s" }}>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/projects">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex-col gap-2 bg-transparent"
                onClick={(e) => createParticles(e, "sparkle")}
              >
                <FolderKanban className="w-6 h-6" />
                <span>Thêm Project</span>
              </Button>
            </Link>
            <Link href="/admin/github">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex-col gap-2 bg-transparent"
                onClick={(e) => createParticles(e, "sparkle")}
              >
                <Github className="w-6 h-6" />
                <span>Đồng bộ GitHub</span>
              </Button>
            </Link>
            <Link href="/admin/skills">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex-col gap-2 bg-transparent"
                onClick={(e) => createParticles(e, "sparkle")}
              >
                <Code2 className="w-6 h-6" />
                <span>Cập nhật Skills</span>
              </Button>
            </Link>
            <Link href="/admin/about">
              <Button
                variant="outline"
                className="w-full h-auto py-4 flex-col gap-2 bg-transparent"
                onClick={(e) => createParticles(e, "sparkle")}
              >
                <FileText className="w-6 h-6" />
                <span>Chỉnh sửa About</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Realtime Sync Status */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>Đồng bộ realtime đang hoạt động</span>
      </div>
    </div>
  )
}
