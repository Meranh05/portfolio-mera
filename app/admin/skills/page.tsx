"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useClickEffect } from "@/hooks/use-click-effect"
import { cn } from "@/lib/utils"
import { getSkills, addSkill, deleteSkill, updateSkill, type Skill } from "@/lib/portfolio-store"
import { Code2, Plus, Trash2, Save, Eye, EyeOff, Settings, Sparkles, GripVertical, Pencil } from "lucide-react"

const colorOptions = [
  { value: "bg-cyan-500", label: "Cyan", preview: "bg-cyan-500" },
  { value: "bg-blue-500", label: "Blue", preview: "bg-blue-500" },
  { value: "bg-green-500", label: "Green", preview: "bg-green-500" },
  { value: "bg-yellow-500", label: "Yellow", preview: "bg-yellow-500" },
  { value: "bg-red-500", label: "Red", preview: "bg-red-500" },
  { value: "bg-purple-500", label: "Purple", preview: "bg-purple-500" },
  { value: "bg-pink-500", label: "Pink", preview: "bg-pink-500" },
  { value: "bg-orange-500", label: "Orange", preview: "bg-orange-500" },
]

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newSkill, setNewSkill] = useState<Omit<Skill, "id">>({
    name: "",
    level: 50,
    category: "language",
    color: "bg-cyan-500",
    icon: "",
    visible: true,
  })
  const { createParticles } = useClickEffect()

  useEffect(() => {
    setSkills(getSkills())
  }, [])

  const handleToggleVisibility = async (id: string) => {
    const updated = await updateSkill(id, { visible: !skills.find((s) => s.id === id)?.visible })
    setSkills(updated)
    toast.success("Cập nhật hiển thị thành công!")
  }

  const handleUpdateLevel = async (id: string, level: number) => {
    const updated = await updateSkill(id, { level })
    setSkills(updated)
  }

  const handleSaveSkill = async (skill: Skill) => {
    const updated = await updateSkill(skill.id, skill)
    setSkills(updated)
    setEditingSkill(null)
    toast.success("Đã lưu thay đổi!")
  }

  const handleAddSkill = async (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    if (!newSkill.name.trim()) {
      toast.error("Vui lòng nhập tên kỹ năng!")
      return
    }
    const updated = await addSkill(newSkill)
    setSkills(updated)
    setNewSkill({
      name: "",
      level: 50,
      category: "language",
      color: "bg-cyan-500",
      icon: "",
      visible: true,
    })
    setIsAddingNew(false)
    toast.success("Thêm kỹ năng mới thành công!")
  }

  const handleDeleteSkill = async (id: string, e: React.MouseEvent) => {
    createParticles(e, "snow")
    const updated = await deleteSkill(id)
    setSkills(updated)
    toast.success("Đã xóa kỹ năng!")
  }

  const languageSkills = skills.filter((s) => s.category === "language")
  const toolSkills = skills.filter((s) => s.category === "tool")
  const softSkills = skills.filter((s) => s.category === "soft")

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Code2 className="w-8 h-8 text-primary" />
                Quản lý Kỹ năng
              </h1>
              <p className="text-muted-foreground mt-1">
                Chỉnh sửa và quản lý các kỹ năng hiển thị trên portfolio của bạn
              </p>
            </div>
            <Button onClick={() => setIsAddingNew(true)} className="bg-primary text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              Thêm kỹ năng mới
            </Button>
          </div>
        </div>

        {/* Add New Skill Form */}
        {isAddingNew && (
          <Card className="mb-8 border-primary/50 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                Thêm kỹ năng mới
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên kỹ năng</Label>
                  <Input
                    placeholder="Ví dụ: React / Next.js"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Danh mục</Label>
                  <Select
                    value={newSkill.category}
                    onValueChange={(value: "language" | "tool" | "soft") =>
                      setNewSkill({ ...newSkill, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="language">Ngôn ngữ & Framework</SelectItem>
                      <SelectItem value="tool">Công cụ</SelectItem>
                      <SelectItem value="soft">Kỹ năng mềm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Màu sắc</Label>
                  <Select value={newSkill.color} onValueChange={(value) => setNewSkill({ ...newSkill, color: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={cn("w-4 h-4 rounded", color.preview)} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Icon (emoji)</Label>
                  <Input
                    placeholder="Ví dụ: 🐳"
                    value={newSkill.icon || ""}
                    onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mức độ thành thạo: {newSkill.level}%</Label>
                <Slider
                  value={[newSkill.level]}
                  onValueChange={([value]) => setNewSkill({ ...newSkill, level: value })}
                  max={100}
                  step={5}
                  className="py-4"
                />
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", newSkill.color)}
                    style={{ width: `${newSkill.level}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleAddSkill} className="bg-primary text-primary-foreground gap-2">
                  <Save className="w-4 h-4" />
                  Thêm kỹ năng
                </Button>
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Language & Framework Skills */}
        <Card className="mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              Ngôn ngữ & Frameworks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {languageSkills.map((skill) => (
              <div
                key={skill.id}
                className={cn(
                  "p-4 rounded-lg border transition-all",
                  skill.visible ? "bg-card border-border" : "bg-secondary/30 border-border/50 opacity-60",
                )}
              >
                {editingSkill?.id === skill.id ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        value={editingSkill.name}
                        onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                      />
                      <Select
                        value={editingSkill.color}
                        onValueChange={(value) => setEditingSkill({ ...editingSkill, color: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className={cn("w-4 h-4 rounded", color.preview)} />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Mức độ: {editingSkill.level}%</Label>
                      <Slider
                        value={[editingSkill.level]}
                        onValueChange={([value]) => setEditingSkill({ ...editingSkill, level: value })}
                        max={100}
                        step={5}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSaveSkill(editingSkill)}>
                        <Save className="w-4 h-4 mr-1" /> Lưu
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingSkill(null)}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground">{skill.name}</span>
                          <span className="text-primary font-semibold">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", skill.color)}
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button size="icon" variant="ghost" onClick={() => setEditingSkill(skill)} className="h-8 w-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleToggleVisibility(skill.id)}
                        className="h-8 w-8"
                      >
                        {skill.visible ? (
                          <Eye className="w-4 h-4 text-green-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => handleDeleteSkill(skill.id, e)}
                        className="h-8 w-8 text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tool Skills */}
        <Card className="mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Công cụ & Khác
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {toolSkills.map((skill) => (
                <div
                  key={skill.id}
                  className={cn(
                    "group relative flex items-center gap-2 px-4 py-2 rounded-lg border transition-all cursor-pointer",
                    skill.visible
                      ? "bg-card border-border hover:border-primary/50"
                      : "bg-secondary/30 border-border/50 opacity-60",
                  )}
                  onClick={(e) => createParticles(e, "sparkle")}
                >
                  {skill.icon && <span className="text-lg">{skill.icon}</span>}
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleVisibility(skill.id)
                      }}
                      className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary"
                    >
                      {skill.visible ? <Eye className="w-3 h-3 text-green-400" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteSkill(skill.id, e)
                      }}
                      className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Soft Skills */}
        <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Kỹ năng mềm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {softSkills.map((skill) => (
                <div
                  key={skill.id}
                  className={cn(
                    "relative p-4 rounded-xl border-2 text-center transition-all cursor-pointer group",
                    skill.visible ? skill.color : "border-border/50 opacity-60",
                  )}
                  onClick={(e) => createParticles(e, "confetti")}
                >
                  <div className="text-3xl mb-2">{skill.icon}</div>
                  <div className="font-medium text-foreground">{skill.name}</div>
                  <div className="text-sm text-muted-foreground mt-1">{skill.level}%</div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleVisibility(skill.id)
                      }}
                      className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center"
                    >
                      {skill.visible ? <Eye className="w-3 h-3 text-green-400" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
