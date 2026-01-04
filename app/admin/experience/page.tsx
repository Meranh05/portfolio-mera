"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Building2, Code2, Paintbrush, Briefcase, Rocket, Plus, Trash2, Save, X, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useClickEffect } from "@/hooks/use-click-effect"
import {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
  type Experience,
} from "@/lib/portfolio-store"

const iconMap = {
  building: Building2,
  code: Code2,
  paintbrush: Paintbrush,
  briefcase: Briefcase,
  rocket: Rocket,
}

function ExperiencePageContent() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const { createParticles } = useClickEffect()

  const [formData, setFormData] = useState<Omit<Experience, "id">>({
    period: "",
    location: "",
    title: "",
    company: "",
    icon: "building",
    current: false,
    description: [""],
    techs: [],
    visible: true,
  })
  const [newTech, setNewTech] = useState("")

  useEffect(() => {
    setExperiences(getExperiences())
  }, [])

  const resetForm = () => {
    setFormData({
      period: "",
      location: "",
      title: "",
      company: "",
      icon: "building",
      current: false,
      description: [""],
      techs: [],
      visible: true,
    })
    setNewTech("")
  }

  const handleAddExperience = async (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    if (!formData.title || !formData.company || !formData.period) {
      toast.error("Vui lòng điền đầy đủ thông tin!")
      return
    }

    const newExperiences = await addExperience({
      ...formData,
      description: formData.description.filter((d) => d.trim() !== ""),
    })
    setExperiences(newExperiences)
    resetForm()
    setIsAdding(false)
    toast.success("Đã thêm kinh nghiệm mới!")
  }

  const handleUpdateExperience = async (e: React.MouseEvent) => {
    createParticles(e, "sparkle")
    if (!editingId) return

    const newExperiences = await updateExperience(editingId, {
      ...formData,
      description: formData.description.filter((d) => d.trim() !== ""),
    })
    setExperiences(newExperiences)
    setEditingId(null)
    resetForm()
    toast.success("Đã cập nhật kinh nghiệm!")
  }

  const handleDeleteExperience = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    createParticles(e, "confetti")
    const newExperiences = await deleteExperience(id)
    setExperiences(newExperiences)
    toast.success("Đã xóa kinh nghiệm!")
  }

  const handleToggleVisibility = async (e: React.MouseEvent, id: string, visible: boolean) => {
    e.stopPropagation()
    createParticles(e, "sparkle")
    const newExperiences = await updateExperience(id, { visible: !visible })
    setExperiences(newExperiences)
    toast.success(visible ? "Đã ẩn kinh nghiệm" : "Đã hiện kinh nghiệm")
  }

  const startEditing = (exp: Experience) => {
    setEditingId(exp.id)
    setFormData({
      period: exp.period,
      location: exp.location,
      title: exp.title,
      company: exp.company,
      icon: exp.icon,
      current: exp.current,
      description: exp.description,
      techs: exp.techs,
      visible: exp.visible,
    })
    setIsAdding(false)
  }

  const addDescriptionLine = () => {
    setFormData({ ...formData, description: [...formData.description, ""] })
  }

  const updateDescriptionLine = (index: number, value: string) => {
    const newDesc = [...formData.description]
    newDesc[index] = value
    setFormData({ ...formData, description: newDesc })
  }

  const removeDescriptionLine = (index: number) => {
    const newDesc = formData.description.filter((_, i) => i !== index)
    setFormData({ ...formData, description: newDesc.length ? newDesc : [""] })
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

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quản lý Kinh nghiệm</h1>
            <p className="text-muted-foreground">Thêm, sửa, xóa kinh nghiệm làm việc của bạn</p>
          </div>
          <Button
            onClick={() => {
              setIsAdding(true)
              setEditingId(null)
              resetForm()
            }}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm mới
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Experience List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Danh sách kinh nghiệm ({experiences.length})</h2>
            {experiences.map((exp) => {
              const IconComponent = iconMap[exp.icon]
              return (
                <Card
                  key={exp.id}
                  className={`bg-card border-border transition-all cursor-pointer hover:border-primary/50 ${editingId === exp.id ? "ring-2 ring-primary" : ""
                    } ${!exp.visible ? "opacity-50" : ""}`}
                  onClick={() => startEditing(exp)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{exp.title}</h3>
                            {exp.current && <Badge className="bg-green-500/20 text-green-400 text-xs">Hiện tại</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {exp.period} • {exp.location}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exp.techs.slice(0, 3).map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                            {exp.techs.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{exp.techs.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleToggleVisibility(e, exp.id, exp.visible)}
                        >
                          {exp.visible ? (
                            <Eye className="w-4 h-4 text-green-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-muted-foreground" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                          onClick={(e) => handleDeleteExperience(e, exp.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Add/Edit Form */}
          {(isAdding || editingId) && (
            <Card className="bg-card border-border h-fit sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full" />
                  {isAdding ? "Thêm kinh nghiệm mới" : "Chỉnh sửa kinh nghiệm"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Chức danh *</label>
                    <Input
                      placeholder="Senior Developer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Công ty *</label>
                    <Input
                      placeholder="Tech Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Thời gian *</label>
                    <Input
                      placeholder="2022 - Hiện tại"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Địa điểm</label>
                    <Input
                      placeholder="Hà Nội, Việt Nam"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Icon</label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value: Experience["icon"]) => setFormData({ ...formData, icon: value })}
                    >
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="building">Building (Công ty)</SelectItem>
                        <SelectItem value="code">Code (Lập trình)</SelectItem>
                        <SelectItem value="paintbrush">Paintbrush (Thiết kế)</SelectItem>
                        <SelectItem value="briefcase">Briefcase (Kinh doanh)</SelectItem>
                        <SelectItem value="rocket">Rocket (Startup)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      checked={formData.current}
                      onCheckedChange={(checked) => setFormData({ ...formData, current: checked })}
                    />
                    <label className="text-sm text-foreground">Công việc hiện tại</label>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Mô tả công việc</label>
                  {formData.description.map((desc, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        placeholder={`Mô tả ${index + 1}`}
                        value={desc}
                        onChange={(e) => updateDescriptionLine(index, e.target.value)}
                        className="bg-secondary border-border"
                      />
                      {formData.description.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => removeDescriptionLine(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addDescriptionLine} className="mt-1 bg-transparent">
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm dòng
                  </Button>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Công nghệ sử dụng</label>
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
                      placeholder="Thêm công nghệ..."
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

                <div className="flex items-center gap-3">
                  <Switch
                    checked={formData.visible}
                    onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                  />
                  <label className="text-sm text-foreground">Hiển thị trên trang chủ</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={isAdding ? handleAddExperience : handleUpdateExperience}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isAdding ? "Thêm" : "Lưu"}
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
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default function AdminExperiencePage() {
  return (
    <Suspense fallback={null}>
      <ExperiencePageContent />
    </Suspense>
  )
}
