"use client"

import type React from "react"
import { Suspense, useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useClickEffect } from "@/hooks/use-click-effect"
import { cn } from "@/lib/utils"
import {
  getGitHubRepos,
  getGitHubUsername,
  fetchGitHubRepos,
  updateRepoVisibility,
  calculateSkillsFromGitHub,
  type GitHubRepo,
} from "@/lib/portfolio-store"
import {
  Github,
  RefreshCw,
  Search,
  Star,
  GitFork,
  Eye,
  EyeOff,
  ExternalLink,
  Code2,
  Calendar,
  Sparkles,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const languageColors: Record<string, string> = {
  JavaScript: "bg-yellow-500",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  Java: "bg-red-500",
  "C++": "bg-pink-500",
  "C#": "bg-purple-500",
  Go: "bg-cyan-500",
  Rust: "bg-orange-500",
  Ruby: "bg-red-400",
  PHP: "bg-indigo-500",
  Swift: "bg-orange-400",
  Kotlin: "bg-purple-400",
  HTML: "bg-orange-600",
  CSS: "bg-blue-400",
  Vue: "bg-green-400",
  Dart: "bg-cyan-400",
}

function GitHubPageContent() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showOnlyVisible, setShowOnlyVisible] = useState(false)
  const [sortBy, setSortBy] = useState<"updated" | "stars" | "name">("updated")
  const [expandedStats, setExpandedStats] = useState(true)
  const { createParticles } = useClickEffect()

  useEffect(() => {
    const savedUsername = getGitHubUsername()
    const savedRepos = getGitHubRepos()
    if (savedUsername) setUsername(savedUsername)
    if (savedRepos.length) setRepos(savedRepos)
  }, [])

  const handleFetchRepos = async (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    if (!username.trim()) {
      toast.error("Vui lòng nhập GitHub username!")
      return
    }

    setIsLoading(true)
    try {
      const fetchedRepos = await fetchGitHubRepos(username.trim())
      setRepos(fetchedRepos)
      toast.success(`Đã tải ${fetchedRepos.length} repositories!`)
    } catch {
      toast.error("Không thể tải repositories. Kiểm tra lại username!")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleVisibility = async (id: number, currentVisible: boolean, featured: boolean) => {
    const updated = await updateRepoVisibility(id, !currentVisible, featured)
    setRepos(updated)
    toast.success(!currentVisible ? "Đã hiển thị project" : "Đã ẩn project")
  }

  const handleToggleFeatured = async (id: number, visible: boolean, currentFeatured: boolean) => {
    const updated = await updateRepoVisibility(id, visible, !currentFeatured)
    setRepos(updated)
    toast.success(!currentFeatured ? "Đã đánh dấu nổi bật" : "Đã bỏ đánh dấu nổi bật")
  }

  const filteredRepos = repos
    .filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesVisibility = showOnlyVisible ? repo.visible : true
      return matchesSearch && matchesVisibility
    })
    .sort((a, b) => {
      if (sortBy === "stars") return b.stargazers_count - a.stargazers_count
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })

  const skillsFromGitHub = calculateSkillsFromGitHub(repos)
  const visibleCount = repos.filter((r) => r.visible).length
  const featuredCount = repos.filter((r) => r.featured).length

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Github className="w-8 h-8 text-primary" />
          Kết nối GitHub
        </h1>
        <p className="text-muted-foreground mt-1">Đồng bộ và quản lý các dự án từ GitHub của bạn</p>
      </div>

      <Card className="mb-8 animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5 text-primary" />
            Kết nối tài khoản GitHub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="sr-only">GitHub Username</Label>
              <Input
                placeholder="Nhập GitHub username của bạn..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetchRepos(e as any)}
              />
            </div>
            <Button
              onClick={handleFetchRepos}
              disabled={isLoading}
              className="bg-primary text-primary-foreground gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {isLoading ? "Đang tải..." : "Đồng bộ"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {repos.length > 0 && (
        <>
          <Card className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="cursor-pointer" onClick={() => setExpandedStats(!expandedStats)}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Thống kê & Phân tích ngôn ngữ
                </div>
                {expandedStats ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </CardTitle>
            </CardHeader>
            {expandedStats && (
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-secondary/50 text-center">
                    <div className="text-3xl font-bold text-foreground">{repos.length}</div>
                    <div className="text-sm text-muted-foreground">Tổng repos</div>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 text-center">
                    <div className="text-3xl font-bold text-primary">{visibleCount}</div>
                    <div className="text-sm text-muted-foreground">Đang hiển thị</div>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-500/10 text-center">
                    <div className="text-3xl font-bold text-yellow-400">{featuredCount}</div>
                    <div className="text-sm text-muted-foreground">Nổi bật</div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 text-center">
                    <div className="text-3xl font-bold text-green-400">
                      {repos.reduce((sum, r) => sum + r.stargazers_count, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Tổng stars</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Phân bố ngôn ngữ (từ repos hiển thị)
                  </h4>
                  <div className="space-y-3">
                    {skillsFromGitHub.map((skill) => (
                      <div key={skill.language}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground">{skill.language}</span>
                          <span className="text-primary">{skill.percentage}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              languageColors[skill.language] || "bg-gray-500",
                            )}
                            style={{ width: `${skill.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          <Card className="mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardContent className="py-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm repos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">Chỉ hiển thị đã chọn</Label>
                  <Switch checked={showOnlyVisible} onCheckedChange={setShowOnlyVisible} />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === "updated" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("updated")}
                  >
                    Mới nhất
                  </Button>
                  <Button
                    variant={sortBy === "stars" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("stars")}
                  >
                    Stars
                  </Button>
                  <Button
                    variant={sortBy === "name" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("name")}
                  >
                    Tên
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredRepos.map((repo, index) => (
              <Card
                key={repo.id}
                className={cn(
                  "animate-slide-up transition-all",
                  repo.visible ? "border-primary/30" : "opacity-60",
                  repo.featured && "ring-2 ring-yellow-500/50",
                )}
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                          {repo.name}
                        </h3>
                        {repo.featured && (
                          <Badge className="bg-yellow-500/20 text-yellow-400 gap-1">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </Badge>
                        )}
                        {repo.language && (
                          <Badge
                            variant="secondary"
                            className={cn("text-white", languageColors[repo.language] || "bg-gray-500")}
                          >
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {repo.description || "Không có mô tả"}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-4 h-4" />
                          {repo.forks_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(repo.updated_at).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      {repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {repo.topics.slice(0, 5).map((topic) => (
                            <Badge key={topic} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant={repo.visible ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          createParticles(e, "snow")
                          handleToggleVisibility(repo.id, repo.visible, repo.featured)
                        }}
                        className="gap-2"
                      >
                        {repo.visible ? (
                          <>
                            <Eye className="w-4 h-4" /> Hiển thị
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4" /> Ẩn
                          </>
                        )}
                      </Button>
                      <Button
                        variant={repo.featured ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          createParticles(e, "confetti")
                          handleToggleFeatured(repo.id, repo.visible, repo.featured)
                        }}
                        className={cn("gap-2", repo.featured && "bg-yellow-500 hover:bg-yellow-600")}
                      >
                        <Sparkles className="w-4 h-4" />
                        {repo.featured ? "Nổi bật" : "Đánh dấu"}
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="gap-2">
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                          GitHub
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRepos.length === 0 && (
            <Card className="animate-slide-up">
              <CardContent className="py-12 text-center">
                <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Không tìm thấy repository nào</p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {repos.length === 0 && !isLoading && (
        <Card className="animate-slide-up">
          <CardContent className="py-12 text-center">
            <Github className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Chưa kết nối GitHub</h3>
            <p className="text-muted-foreground mb-4">Nhập username GitHub của bạn để đồng bộ các dự án public</p>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

export default function AdminGitHubPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <Suspense fallback={null}>
        <GitHubPageContent />
      </Suspense>
    </div>
  )
}
