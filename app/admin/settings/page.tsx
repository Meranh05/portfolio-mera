"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Upload,
  FileText,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"

import { useClickEffect } from "@/hooks/use-click-effect"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { getCVData, setCVData, type CVData } from "@/lib/cv-store"

import { resetAllData } from "@/lib/portfolio-store"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function AdminSettingsPage() {
  const [cvFile, setCvFile] = useState<CVData | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { createParticles } = useClickEffect()

  // Profile state
  const [profile, setProfile] = useState({
    name: "Mera",
    email: "contact@mera.dev",
    phone: "+84 987 654 321",
    location: "Việt Nam",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isResetting, setIsResetting] = useState(false)



  // Load CV data on mount
  useEffect(() => {
    const savedCV = getCVData()
    if (savedCV) {
      setCvFile(savedCV)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = useCallback((file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Chỉ chấp nhận file PDF", {
        description: "Vui lòng chọn file CV định dạng PDF.",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File quá lớn", {
        description: "Kích thước file tối đa là 5MB.",
      })
      return
    }

    setIsUploading(true)

    setTimeout(() => {
      const fileUrl = URL.createObjectURL(file)
      const newCV: CVData = {
        fileName: file.name,
        fileUrl: fileUrl,
        uploadedAt: new Date().toISOString(),
        fileSize: formatFileSize(file.size),
      }

      setCvFile(newCV)
      setCVData(newCV)
      setIsUploading(false)

      toast.success("Upload thành công!", {
        description: `File ${file.name} đã được tải lên.`,
      })
    }, 1500)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile],
  )

  const handleRemoveCV = (e: React.MouseEvent) => {
    createParticles(e, "sparkle")
    setCvFile(null)
    setCVData({
      fileName: "",
      fileUrl: "",
      uploadedAt: "",
      fileSize: "",
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast.info("Đã xóa CV", {
      description: "CV đã được xóa khỏi hệ thống.",
    })
  }

  const handleDownloadCV = (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    if (cvFile?.fileUrl) {
      const link = document.createElement("a")
      link.href = cvFile.fileUrl
      link.download = cvFile.fileName
      link.click()
      toast.success("Đang tải xuống...", {
        description: cvFile.fileName,
      })
    }
  }

  const handlePreviewCV = () => {
    if (cvFile?.fileUrl) {
      window.open(cvFile.fileUrl, "_blank")
    }
  }

  const handleSaveProfile = async (e: React.MouseEvent) => {
    createParticles(e, "confetti")
    setIsSaving(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSaving(false)
    toast.success("Đã lưu thông tin!", {
      description: "Thông tin cá nhân đã được cập nhật.",
    })
  }

  const handleResetAllData = async () => {
    setIsResetting(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    resetAllData()

    setIsResetting(false)
    toast.success("Đã đặt lại dữ liệu!", {
      description: "Tất cả dữ liệu đã được xóa và đặt về mặc định.",
    })

    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Quản lý thông tin cá nhân và CV của bạn.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* CV Upload Section */}
          <Card className="bg-card border-border animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="w-5 h-5 text-primary" />
                Quản lý CV
              </CardTitle>
              <CardDescription>Upload CV của bạn để khách truy cập có thể tải xuống.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Zone */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center",
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30",
                  isUploading && "pointer-events-none opacity-60",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />

                {isUploading ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-muted-foreground">Đang tải lên...</p>
                  </div>
                ) : cvFile?.fileName ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{cvFile.fileName}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {cvFile.fileSize} • {formatDate(cvFile.uploadedAt)}
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviewCV}
                        className="smooth-scale bg-transparent"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Xem
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadCV}
                        className="smooth-scale bg-transparent"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Tải xuống
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveCV}
                        className="smooth-scale text-red-400 hover:text-red-500 hover:bg-red-500/10 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-primary"
                    >
                      Thay đổi file
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Kéo thả file CV vào đây</p>
                      <p className="text-sm text-muted-foreground">hoặc click để chọn file (PDF, tối đa 5MB)</p>
                    </div>
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="smooth-scale">
                      <Upload className="w-4 h-4 mr-2" />
                      Chọn file
                    </Button>
                  </div>
                )}
              </div>

              {/* Status info */}
              <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Lưu ý</p>
                  <p className="text-muted-foreground">
                    File CV sẽ được hiển thị trên trang công khai. Đảm bảo không chứa thông tin nhạy cảm.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Section */}
          <Card className="bg-card border-border animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="w-5 h-5 text-primary" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>Cập nhật thông tin liên hệ hiển thị trên website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Họ và tên
                </Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Địa chỉ
                </Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>

              <Button
                className="w-full bg-primary text-primary-foreground mt-4 smooth-scale"
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu thông tin
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Reset Data Section */}
          <Card className="bg-card border-border animate-slide-up lg:col-span-2" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <RefreshCw className="w-5 h-5 text-red-500" />
                Đặt lại dữ liệu
              </CardTitle>
              <CardDescription>
                Xóa tất cả dữ liệu và đặt về trạng thái mặc định. Hành động này không thể hoàn tác.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">Cảnh báo</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Thao tác này sẽ xóa toàn bộ: dự án, kinh nghiệm làm việc, kỹ năng, GitHub repos, tin nhắn, và tất cả
                    các thiết lập cá nhân. Dữ liệu sẽ được đặt về trạng thái rỗng để bạn bắt đầu thêm mới từ đầu.
                  </p>
                  <div className="text-sm text-muted-foreground mb-4">
                    <p className="font-medium text-foreground mb-2">Sau khi reset, hệ thống sẽ:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Tự động tính toán skills từ tech stack của dự án bạn thêm</li>
                      <li>Hiển thị tỷ lệ % các ngôn ngữ/framework dựa trên số lần sử dụng</li>
                      <li>Đồng bộ realtime giữa admin và trang chính</li>
                    </ul>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="smooth-scale">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Đặt lại tất cả dữ liệu
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Bạn chắc chắn muốn đặt lại?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tất cả dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn sẽ cần thêm lại tất cả dự án,
                          kinh nghiệm và thông tin từ đầu.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-secondary text-foreground">Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleResetAllData}
                          className="bg-red-500 hover:bg-red-600 text-white"
                          disabled={isResetting}
                        >
                          {isResetting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Đang xóa...
                            </>
                          ) : (
                            "Xác nhận đặt lại"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main >
    </div >
  )
}
