"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Filter,
  FolderKanban,
  Plus,
  TrendingUp,
  Upload,
  X,
  Edit,
  Trash2,
  Save,
  Star,
} from "lucide-react"
import { useClickEffect } from "@/hooks/use-click-effect"
import { MagneticButton } from "@/components/animations/magnetic-button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { getProjects, addProject, updateProject, deleteProject, getViews, type Project } from "@/lib/portfolio-store"

function AdminProjectsPageContent() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const { createParticles } = useClickEffect()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    tags: [] as string[],
    techs: [] as string[],
    github: "",
    demo: "",
    visible: true,
    featured: false,
    status: "published" as Project["status"],
  })
  const [newTech, setNewTech] = useState("")
  const [newTag, setNewTag] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  const itemsPerPage = 5

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  const filteredProjects = filterStatus === "all" ? projects : projects.filter((p) => p.status === filterStatus)

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const stats = {
    total: projects.length,
    published: projects.filter((p) => p.status === "published" && p.visible).length,
    drafts: projects.filter((p) => p.status === "draft").length,
    views: getViews(),
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      tags: [],
      techs: [],
      github: "",
      demo: "",
      visible: true,
      featured: false,
      status: "published",
    })
    setNewTech("")
    setNewTag("")
  }

  const handleAddProject = async (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    if (!formData.title) {
      toast.error("Vui lòng nhập tên dự án!")
      return
    }

    const newProjects = await addProject({
      title: formData.title,
      description: formData.description,
      image: formData.image || "/project-management-team.png",
      tags: formData.tags,
      techs: formData.techs,
      github: formData.github,
      demo: formData.demo,
      visible: formData.visible,
      featured: formData.featured,
      status: formData.status,
    })
    setProjects(newProjects)
    resetForm()
    setIsAdding(false)
    toast.success("Đã thêm dự án mới!")
  }

  const handleUpdateProject = async (e: React.MouseEvent) => {
    createParticles(e, "sparkle")
    if (!editingId) return

    const newProjects = await updateProject(editingId, formData)
    setProjects(newProjects)
    setEditingId(null)
    resetForm()
    toast.success("Đã cập nhật dự án!")
  }

  const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    createParticles(e, "confetti")
    const newProjects = await deleteProject(id)
    setProjects(newProjects)
    toast.success("Đã xóa dự án!")
  }

  const handleToggleVisibility = async (e: React.MouseEvent, id: string, visible: boolean) => {
    e.stopPropagation()
    createParticles(e, "sparkle")
    const newProjects = await updateProject(id, { visible: !visible })
    setProjects(newProjects)
    toast.success(visible ? "Đã ẩn dự án" : "Đã hiện dự án")
  }

  const handleToggleFeatured = async (e: React.MouseEvent, id: string, featured: boolean) => {
    e.stopPropagation()
    createParticles(e, "sparkle")
    const newProjects = await updateProject(id, { featured: !featured })
    setProjects(newProjects)
    toast.success(featured ? "Đã bỏ nổi bật" : "Đã đánh dấu nổi bật")
  }

  const startEditing = (project: Project) => {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags,
      techs: project.techs,
      github: project.github,
      demo: project.demo,
      visible: project.visible,
      featured: project.featured,
      status: project.status,
    })
    setIsAdding(false)
  }

  const addTech = () => {
    if (newTech && !formData.techs.includes(newTech)) {
      setFormData({ ...formData, techs: [...formData.techs, newTech] })
      setNewTech("")
    }
  }

  const removeTech = (tech: string) => {
    setFormData({ ...formData, techs: formData.techs.filter((t) => t !== tech) })
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    createParticles(e as unknown as React.MouseEvent, "confetti")
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target?.result as string })
      }
      reader.readAsDataURL(file)
      toast.success(`Đã upload: ${file.name}`)
    }
  }

  const handleFileClick = (e: React.MouseEvent) => {
    createParticles(e, "sparkle")
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFormData({ ...formData, image: e.target?.result as string })
        }
        reader.readAsDataURL(file)
        toast.success(`Đã chọn: ${file.name}`)
      }
    }
    input.click()
  }

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400"
      case "draft":
        return "bg-yellow-500/20 text-yellow-400"
      case "archived":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-secondary text-muted-foreground"
    }
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý Dự án</h1>
          <p className="text-muted-foreground">Quản lý các dự án trong portfolio của bạn</p>
        </div>
        <div className="flex gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32 bg-card border-border">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="archived">Đã lưu trữ</SelectItem>
            </SelectContent>
          </Select>
          <MagneticButton>
            <Button
              className="bg-primary text-primary-foreground"
              onClick={() => {
                setIsAdding(true)
                setEditingId(null)
                resetForm()
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm dự án
            </Button>
          </MagneticButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Tổng dự án", value: stats.total, icon: FolderKanban, color: "text-primary" },
          {
            title: "Đã xuất bản",
            value: stats.published,
            icon: Eye,
            color: "text-green-400",
            trend: "+2% tháng này",
          },
          { title: "Bản nháp", value: stats.drafts, icon: FileText, color: "text-yellow-400" },
          {
            title: "Lượt xem",
            value: stats.views.toLocaleString(),
            icon: TrendingUp,
            color: "text-cyan-400",
            trend: "+15% tháng này",
          },
        ].map((stat, index) => (
          <Card
            key={stat.title}
            className="bg-card border-border card-hover cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              {stat.trend && (
                <p className="text-sm text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.trend}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Table */}
      <Card className="bg-card border-border mb-8 animate-slide-up">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Dự án</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tech Stack</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Hiển thị</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.map((project) => (
                <tr
                  key={project.id}
                  className={cn(
                    "border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer",
                    !project.visible && "opacity-50",
                  )}
                  onClick={() => startEditing(project)}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{project.title}</p>
                          {project.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                        </div>
                        <p className="text-sm text-muted-foreground">Cập nhật: {project.updatedAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {project.techs.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.techs.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.techs.length - 3}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status === "published" && "• "}
                      {project.status === "published"
                        ? "Đã xuất bản"
                        : project.status === "draft"
                          ? "Bản nháp"
                          : "Đã lưu trữ"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => handleToggleVisibility(e, project.id, project.visible)}
                      >
                        {project.visible ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => handleToggleFeatured(e, project.id, project.featured)}
                      >
                        <Star
                          className={cn(
                            "w-4 h-4",
                            project.featured ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground",
                          )}
                        />
                      </Button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditing(project)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-400"
                        onClick={(e) => handleDeleteProject(e, project.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredProjects.length)} của {filteredProjects.length} dự án
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Sau
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="bg-card border-border animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              {isAdding ? "Thêm dự án mới" : "Chỉnh sửa dự án"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Tên dự án *</label>
                    <Input
                      placeholder="FinTech Dashboard"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Trạng thái</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: Project["status"]) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">Đã xuất bản</SelectItem>
                        <SelectItem value="draft">Bản nháp</SelectItem>
                        <SelectItem value="archived">Đã lưu trữ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Mô tả</label>
                  <Textarea
                    placeholder="Mô tả chi tiết về dự án..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-secondary border-border min-h-[100px]"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">GitHub URL</label>
                    <Input
                      placeholder="https://github.com/..."
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Demo URL</label>
                    <Input
                      placeholder="https://demo.vercel.app"
                      value={formData.demo}
                      onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Tech Stack</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.techs.map((tech) => (
                      <Badge key={tech} variant="secondary" className="pr-1">
                        {tech}
                        <button onClick={() => removeTech(tech)} className="ml-1 hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Thêm tech..."
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                      className="bg-secondary border-border"
                    />
                    <Button variant="outline" onClick={addTech}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="pr-1">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Thêm tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="bg-secondary border-border"
                    />
                    <Button variant="outline" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.visible}
                      onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                    />
                    <label className="text-sm text-foreground">Hiển thị</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <label className="text-sm text-foreground">Nổi bật</label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Ảnh dự án</label>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
                      isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                    )}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFileDrop}
                    onClick={handleFileClick}
                  >
                    {formData.image ? (
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-lg object-cover"
                      />
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-foreground font-medium">Click hoặc kéo thả ảnh</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG, GIF (max. 5MB)</p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Preview</span>
                  </div>
                  <div className="bg-secondary rounded-xl p-4 border border-border">
                    {formData.title ? (
                      <div>
                        <h4 className="text-foreground font-semibold mb-2">{formData.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {formData.description || "Chưa có mô tả"}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {formData.techs.slice(0, 4).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">Preview sẽ hiển thị ở đây</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={isAdding ? handleAddProject : handleUpdateProject}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isAdding ? "Thêm dự án" : "Lưu thay đổi"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false)
                      setEditingId(null)
                      resetForm()
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AdminProjectsPage() {
  return (
    <Suspense fallback={null}>
      <AdminProjectsPageContent />
    </Suspense>
  )
}
